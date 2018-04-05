import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocalStorageProvider } from '../../app.localStorage';
import { AppService } from '../../app.providers';


@IonicPage()
@Component({
  selector: 'page-triphistory',
  templateUrl: 'triphistory.html',
})
export class TriphistoryPage {

  public userID: string; // current user ID

  public trips: any;  // list of trips

  public imageBase = "http://mitapi.memeinfotech.com:5040/user/fileShow?imageId=";

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private localStorageProvider: LocalStorageProvider,
    private appService: AppService) {
    this.userID = this.localStorageProvider.getDriverId();
  }

  ionViewDidLoad() {
    let _base = this;
    console.log('ionViewDidLoad TriphistoryPage');
    this.getUserTripHistory()
      .then(function (success: any) {
        console.log(success.result);
        _base.trips = success.result;
        // console.log(_base.trips[1].startTime.now());
      }, function (error) {
        console.log(error);
      });
  }

  getUserTripHistory() {
    let _base = this;
    return new Promise(function (resolve, reject) {
      _base.appService.userHistory(_base.userID, (error, data) => {
        if (error) {
          reject(error);
        } else {
          if (data) {
            resolve(data);
          }
        }
      });
    });
  }

}
