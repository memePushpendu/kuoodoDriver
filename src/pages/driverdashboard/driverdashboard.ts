import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController, AlertController, Events } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  MarkerOptions,
  Marker,
  LatLng,
  CameraPosition,
  GoogleMapOptions
} from '@ionic-native/google-maps';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import { AppService } from '../../app.providers';
import { HttpService } from '../../app.httpService';
import { LocalStorageProvider } from '../../app.localStorage';
import { ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Vibration } from '@ionic-native/vibration';

declare var google;

/**
 * Generated class for the DriverdashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-driverdashboard',
  templateUrl: 'driverdashboard.html',
  providers: [HttpService]
})
export class DriverdashboardPage {

  //waiting loader
  public waitingLoader: any;


  acceptRideDataMessage: any;
  e: any;
  bID: any;
  online: boolean;
  message: string;
  base: string;
  public marker: any = null;
  public destinationmarker: any = null;
  id: any;
  bookingId: any;
  response: any;

  loadingMessage: any;
  loader: any;

  endLongitude: any;
  startLatitude: any;

  userStartLatitude: any;
  userStartLongitude: any;

  userEndLatitude: any;
  userEndLongitude: any;

  public userStartLoc: LatLng;
  public userEndLoc: LatLng;

  public alert: any;

  //timer variable
  public timer: any;
  public duration: any = "00:00:00";

  // public directionsService: any;
  // public directionsDisplay: any;

  // public directionsService = new google.maps.DirectionsService();
  // public directionsDisplay = new google.maps.DirectionsRenderer();

  userID: any;
  public isStartRide: boolean = true;
  public isEndRide: boolean = true;
  public ridingStatus: boolean = false;
  public ridingStatusComplete: boolean = false;
  public isPathDraw: boolean = false;

  /** Ride status **/
  // public isAcceptRideHidden: boolean = true;
  // public isCancelRideHidden: boolean = true;

  public IsStartRideHidden: boolean = true;
  public IsEndRideHidden: boolean = true;

  public carDetails: any;

  public price: any;
  public distance: any;

  public carTypes = [{
    'amount': 5,
    'type': 'standard'
  }, {
    'amount': 8,
    'type': 'standard_plus'
  }, {
    'amount': 12,
    'type': 'premium'
  }, {
    'amount': 15,
    'type': 'premium_plus'
  }, {
    'amount': 10,
    'type': 'sport'
  }, {
    'amount': 20,
    'type': 'sport_plus'
  }];

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  /** driver status **/
  public status: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private _googleMaps: GoogleMaps,
    private _geoLoc: Geolocation,
    private appService: AppService,
    private localStorageProvider: LocalStorageProvider,
    private toastCtrl: ToastController,
    private network: Network,
    public platform: Platform,
    private localNotifications: LocalNotifications,
    public loadingCtrl: LoadingController, private vibration: Vibration,
    public alertController: AlertController,
    public events: Events) {

    let _base = this;

    _base.isStartRide = false;
    _base.isEndRide = false;

    this.id = this.localStorageProvider.getDriverId();

    /** get current driver car info **/
    _base.appService.getCar(this.id, (error, data) => {
      if (!error) {
        delete data.result[0].userId;
        _base.carDetails = data.result[0];
      }
    });

    var config = {
      apiKey: "AIzaSyB-x42Ln5XY7imsMCxZ9SKtdXeYG342mK4",
      authDomain: "kuoodo-39b36.firebaseapp.com",
      databaseURL: "https://kuoodo-39b36.firebaseio.com",
      projectId: "kuoodo-39b36",
      storageBucket: "kuoodo-39b36.appspot.com",
      messagingSenderId: "146065520356"
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }

    //getting payment data
    this.appService.PaymentDetails.subscribe(data => {
      if (data) {
        if (data.status == "success") {
          this.map.clear();
          _base.marker = null;
          _base.destinationmarker = null;
          _base.userStartLatitude = null;
          _base.userStartLongitude = null;
          _base.userEndLatitude = null;
          _base.userEndLongitude = null;
          _base.isStartRide = false;
          _base.isEndRide = false;
          _base.IsStartRideHidden = true;
          _base.IsEndRideHidden = true;
          _base.waitingLoader.dismiss();
          alert("User has paid the payment");
        }
      }
    });

    /** user has booked a car **/

    var database = firebase.database();
    var userData = firebase.database().ref(_base.id);
    userData.on('value', function (userdata) {
      if (userdata.val()) {
        // Schedule a single notification
        // _base.localNotifications.schedule({
        //   id: 1,
        //   text: 'User has booked a car.'
        // });
        let data = userdata.val();
        _base.vibration.vibrate([3000, 1000, 3000]);

        // _base.isAcceptRideHidden = false;
        // _base.isCancelRideHidden = false;

        /**Accept and cancel ride button using alert */
        if (data) {
          _base.alert = _base.alertController.create({
            title: "Ride accept and Cancel",
            buttons: [{
              text: "Accept Ride",
              handler: () => {
                _base.acceptRide();
              }
            }, {
              text: "Cancel Ride",
              handler: () => {
                _base.cancelRide();
              }
            }]
          });
          _base.alert.present();
        }

        let userFirstName = (data.data.firstName) ? data.data.firstName : '';
        let userLastName = (data.data.lastName) ? data.data.lastName : '';
        _base.userID = data.data.userId;
        _base.bookingId = data.data.bookingID;

        _base.userStartLatitude = data.data.pickUpLocation.latitude;
        _base.userStartLongitude = data.data.pickUpLocation.longitude;

        if (_base.userStartLatitude && _base.userStartLongitude) {
          _base.userStartLoc = new LatLng(_base.userStartLatitude, _base.userStartLongitude);
          // _base.moveCamera(_base.userStartLoc);
          _base.createUserMarkar(_base.userStartLoc);
        }

        _base.userEndLatitude = data.data.destination.latitude;
        _base.userEndLongitude = data.data.destination.longitude;

        if (_base.userEndLatitude && _base.userEndLongitude) {
          _base.userEndLoc = new LatLng(parseFloat(_base.userEndLatitude), parseFloat(_base.userEndLongitude));
          // _base.moveCamera(_base.userEndLoc);
          _base.createUserMarkar(_base.userEndLoc);
        }
        userData.remove();
      }
    });
  }

  /** Accept Ride */
  acceptRide() {
    let _base = this;
    _base.vibration.vibrate(0);
    if (_base.bookingId) {
      var data = {
        bookingId: _base.bookingId
      }
      this.appService.acceptRide(data, (error, data) => {
        if (error) {
          console.log(error);
        } else if (data) {

          var database = firebase.database();
          database.ref("/" + _base.userID).remove();
          database.ref("/" + _base.userID).set({
            "purpose": "rideAccept"
          });

          // _base.acceptRideDataMessage = data.message;

          // if (_base.acceptRideDataMessage) {
          //   _base.isAcceptRideHidden = true;
          // }
          // _base.isCancelRideHidden = true;
          _base.IsStartRideHidden = false;
          _base.IsEndRideHidden = true;
          _base.isStartRide = true;
          if (_base.isStartRide == true) {
            _base.alert.dismiss();
          }
        }
      });
    }
    else {
      _base.showToast("Firstly you select the driver.");
    }
  }

  /** cancel Ride */
  cancelRide() {
    let _base = this;
    _base.vibration.vibrate(0);
    if (_base.bookingId) {
      var data = {
        bookingId: _base.bookingId
      }
      this.appService.cancelRide(data, (error, data) => {
        if (error) {
          console.log(error);
        } else if (data) {

          var database = firebase.database();
          database.ref("/" + _base.userID).remove();
          database.ref("/" + _base.userID).set({
            "purpose": "rideCancel"
          });
          // _base.isAcceptRideHidden = true;
          _base.alert.dismiss();
        }
      });
    }
    else {
      _base.showToast("Firstly you select the driver.");
    }
  }

  /*
  Direction drawing from user start location to end location
  */


  //change driver status
  changeStatus() {
    let _base = this;
    let currentStatus = "";
    if (this.status == true) {
      currentStatus = "Online";
      _base.startWatch();
    } else {
      currentStatus = "Offline";
      _base.stopWatch();
    }
    this.appService.updateDriverStatus(currentStatus, this.id, (error, data) => {
      if (error) {
        _base.showToast("Can not update status");
      }
      else {
        _base.showToast("You are now " + currentStatus);
      }
    });
  }

  ionViewDidLoad() {
    let _base = this;
    /** user driver profile info **/
    this.appService.getProfile(this.id, (error, data) => {
      if (error) {
        console.log("Error in fetching profile :", error);
      } else {
        if (data) {
          if (data.user.availability) {
            if (data.user.availability == "Online") {
              _base.status = true;
              _base.startWatch();
            } else {
              _base.status = false;
              _base.stopWatch();
            }
          }
          // _base.appService.updateUser(data.user);
          _base.events.publish('data', data.user);
        }
      }
    });

    /*
      Network check
    */

    if (document.URL.includes('https://') || document.URL.includes('http://')) {
      this.base = "http://127.0.0.1:3001/";
    }
    else {
      this.base = 'http://mitapi.memeinfotech.com:5040/';
    }

    this.platform.ready().then(() => {
      let type = this.network.type;

      //Try and find out the current online status of the device
      if (type == "unknown" || type == "none" || type == undefined) {
        this.online = false;
      }
      else {
        this.online = true;
        this.mapViewAndDriverShow();
      }
    });

    this.network.onDisconnect().subscribe(() => {
      this.online = false;
      this.message = "Please check your internet connection";
      this.showToast('top');
    });

    this.network.onConnect().subscribe(() => {
      this.online = true;
      this.mapViewAndDriverShow();
    });
  }

  mapViewAndDriverShow() {
    let _base = this;
    let loc: LatLng;
    this.initMap();

    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {

      this.getLocation().subscribe((res) => {
        this.response = res;

        this.startLatitude = res.coords.latitude;
        this.endLongitude = res.coords.longitude;

        if (this.response) {
          loc = new LatLng(this.response.coords.latitude, this.response.coords.longitude);

          this.locationUpdate();
          this.moveCamera(loc);

          this.createMarkar(loc);
          // if (_base.acceptRideDataMessage) {
          //   this.calculateStartDistance(_base.userStartLatitude, _base.userStartLongitude, this.startLatitude, this.endLongitude);
          // }
          // if (this.ridingStatus == true) {
          //   this.calculateEndDistance(_base.userEndLatitude, _base.userEndLongitude, this.startLatitude, this.endLongitude);
          // }
        }
      });
    });
  }

  initMap() {
    let _base = this;
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 43.0741904,
          lng: -89.3809802
        },
        zoom: 15,
        tilt: 8
      }
    };
    let element = this.mapElement.nativeElement;
    this.map = GoogleMaps.create(element, mapOptions);
    // _base.directionsDisplay.setMap(this.map);
  }

  getLocation() {
    return this._geoLoc.watchPosition();
  }

  moveCamera(loc: LatLng) {
    let options: any = {
      target: loc,
      tilt: 8
    };
    this.map.moveCamera(options);
  }

  /* 
  Create marker for driver
  */
  createMarkar(loc: LatLng) {
    let _base = this;
    const image = {
      url: './assets/icon/car.png',
      size: {
        width: 20,
        height: 20
      }
    };
    let markarOptions: MarkerOptions = {
      position: loc,
      "icon": image
    };
    if (_base.marker != null) {
      _base.marker.setPosition(loc);
    }
    else {
      _base.map.addMarker(markarOptions)
        .then(marker => {
          _base.marker = marker;
        });
    }
  }

  /* 
  Create marker for User
  */
  createUserMarkar(loc: LatLng) {
    let _base = this;
    const image = {
      url: './assets/icon/myself.png',
      size: {
        width: 20,
        height: 20
      }
    };
    let markarOptions: MarkerOptions = {
      position: loc,
      "icon": image
    };
    if (_base.destinationmarker != null) {
      _base.marker.setPosition(loc);
    }
    else {
      _base.map.addMarker(markarOptions)
        .then(marker => {
          _base.destinationmarker = marker;
        });
    }
  }

  locationUpdate() {
    if (this.response) {
      var data = {
        "_id": this.id,
        "location": {
          "latitude": this.startLatitude,
          "longitude": this.endLongitude
        }
      }

      this.appService.driverLocation(data, (error, data) => {
        if (error) {
          console.log("Error :", error);
        }
        else if (data) {
          console.log(data);
        }
      });
    }
  }

  /*
  Driver Start Riding
  */
  startRide() {
    let _base = this;
    var database = firebase.database();
    database.ref("/" + _base.userID).remove();
    database.ref("/" + _base.userID).set({
      "purpose": "rideStart"
    });
    var data = {
      bookingId: _base.bookingId
    }
    this.appService.driverStartRide(data, (error, data) => {
      if (error) {
        console.log("Error in Driver start ride :", error);
      }
      else if (data) {
        // _base.isStartRide = true;
        this.ridingStatus = true;
        _base.appService.getDistance(_base.userStartLatitude, _base.userStartLongitude, _base.userEndLatitude, _base.userEndLongitude, (error, data) => {
          if (!error) {
            console.log("distance calculator", data);
            _base.distance = Math.ceil(parseInt(data.routes[0].legs[0].distance.value) * 0.00062137);
            _base.price = parseInt(_base.distance) * (_base.getPerMilePrice(_base.carDetails.carType))
            console.log("distance", _base.distance);
            console.log("price", _base.price);
            _base.IsEndRideHidden = false;
            _base.IsStartRideHidden = true;
          }
        });
      }
    });
  }

  /*
  Driver End Riding
  */
  endRide() {
    let _base = this;
    var database = firebase.database();
    database.ref("/" + _base.userID).remove();
    database.ref("/" + _base.userID).set({
      "purpose": "rideEnd",
      "amount": _base.price,
      "currency": "USD"
    });

    var data = {
      bookingId: _base.bookingId,
      amount: _base.price
    }

    this.appService.driverEndRide(data, (error, data) => {
      if (error) {
        console.log("Error in Driver end ride :", error);
      }
      else if (data) {
        console.log("Data in Driver end ride :", data);
        _base.isEndRide = true;
        _base.IsEndRideHidden = true;
        _base.IsStartRideHidden = true;
        _base.waitingLoader = _base.loadingCtrl.create({
          content: 'Please wait for user payment ...'
        });
      }
    });
  }

  /*
  Calculate distance between Driver Start location and User Start Location in Km for startRide
  */
  // calculateStartDistance(userStartLatitude, userStartLongitude, startLatitude, endLongitude) {
  //   let _base = this;
  //   console.log("userStartLatitude :", userStartLatitude + "userStartLongitude :", + userStartLongitude +
  //     "startLatitude :", startLatitude + "endLongitude :", endLongitude);

  //   var R = 6371; // Radius of the earth in km

  //   //Convert degree to redian
  //   var lat = (startLatitude - userStartLatitude) * (Math.PI / 180);
  //   console.log("lat :", lat);
  //   var lon = (endLongitude - userStartLongitude) * (Math.PI / 180);
  //   console.log("lon :", lon);
  //   var a =
  //     Math.sin(lat / 2) * Math.sin(lat / 2) +
  //     Math.cos((userStartLatitude) * (Math.PI / 180)) * Math.cos((startLatitude) * (Math.PI / 180)) *
  //     Math.sin(lon / 2) * Math.sin(lon / 2)
  //     ;
  //   console.log("a :", a);
  //   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   console.log("c :", c);
  //   var d = (R * c) * 1000; // Distance in meter
  //   console.log("d :", d);
  //   if (d <= 100) {
  //     this.isStartRide = false;
  //   }
  // }

  /*
  Calculate distance between Driver Start location and User end Location in Km for EndRide
  */
  // calculateEndDistance(userEndLatitude, userEndLongitude, startLatitude, endLongitude) {
  //   let _base = this;
  //   console.log("userEndLatitude :", userEndLatitude + "userEndLongitude :", + userEndLongitude +
  //     "startLatitude :", startLatitude + "endLongitude :", endLongitude);

  //   var R = 6371; // Radius of the earth in km

  //   //Convert degree to redian
  //   var lat = (startLatitude - userEndLatitude) * (Math.PI / 180);
  //   console.log("lat :", lat);
  //   var lon = (endLongitude - userEndLongitude) * (Math.PI / 180);
  //   console.log("lon :", lon);
  //   var a =
  //     Math.sin(lat / 2) * Math.sin(lat / 2) +
  //     Math.cos((userEndLatitude) * (Math.PI / 180)) * Math.cos((startLatitude) * (Math.PI / 180)) *
  //     Math.sin(lon / 2) * Math.sin(lon / 2)
  //     ;
  //   console.log("a :", a);
  //   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   console.log("c :", c);
  //   var d = (R * c) * 1000; // Distance in meter
  //   console.log("d :", d);
  //   if (d <= 100) {
  //     // this.isEndRide = false;
  //     // this.isStartRide = true;
  //     _base.ridingStatusComplete = true;
  //     _base.IsStartRideHidden = true;

  //     _base.IsEndRideHidden = false;
  //     _base.isEndRide = false;
  //   }
  // }

  /*
   Loader message
 */
  loading() {
    this.loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: this.loadingMessage
    });
  }


  /** toast contorller **/
  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present(toast);
  }


  getPerMilePrice(carType: string) {
    let _base = this;
    for (let i = 0; i < _base.carTypes.length; i++) {
      if (_base.carTypes[i].type == carType) {
        return _base.carTypes[i].amount;
      }
      if (i == _base.carTypes.length - 1) {
        return _base.carTypes[0].amount; // if type not found calculate as standard car
      }
    }
  }

  calculateRouteDistance() {
    var service = new google.maps.DistanceMatrixService();
  }


  startWatch() {
    let count = 0;
    let _base = this;
    _base.stopWatch();
    this.timer = setInterval(() => {
      count++;
      let duration = _base.getDuration(count);
      _base.duration = duration;
    }, 1000);
  }

  stopWatch() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.duration = "00:00:00";
  }

  getDuration(seconds: number) {
    if (seconds < 60) {
      return '00:00:' + seconds;
    } else if (seconds >= 60 && seconds <= 3600) {
      let min = seconds / 60;
      let sec = seconds % 60;
      return '00:' + Math.floor(min) + ':' + sec;
    } else {
      let hour = seconds / 3600;
      let sec = seconds % 3600;
      if (sec >= 60) {
        let min = sec / 60;
        let secs = sec % 60;
        return Math.floor(hour) + ':' + Math.floor(min) + ':' + secs;
      } else {
        return Math.floor(hour) + ':' + '00' + sec;
      }
    }
  }

}
