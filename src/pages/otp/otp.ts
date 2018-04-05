import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Events } from 'ionic-angular';
import { AppService } from '../../app.providers';
import { HttpService } from '../../app.httpService';
import { LocalStorageProvider } from '../../app.localStorage';
import { AlertController } from 'ionic-angular';
import { DriverdashboardPage } from '../driverdashboard/driverdashboard';

/**
 * Generated class for the OtpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html',
  providers: [AppService, HttpService]
})
export class OtpPage {
  otp: any;
  OTPmessage: string = '';
  loader: any;
  userData: any = {};
  carInfo: any = {};

  public otpVerified: boolean = false;

  constructor(public nav: NavController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private api: HttpService,
    private appService: AppService,
    public toastCtrl: ToastController,
    private localStorageProvider: LocalStorageProvider,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController, public events: Events) {
    this.userData = this.navParams.get("navData");
    this.carInfo = this.navParams.get("carData");
    console.log(this.navParams.get("navData"));
    console.log(this.navParams.get("carData"));
    console.log("call otp send api");
    this.resendOTP();
  }

  resendOTP() {
    let _base = this;
    this.loading();
    this.sendOTP()
      .then(function (success: any) {
        console.log(success);
        alert(success.message);
        _base.loader.dismiss();
      }, function (error) {
        console.log(error);
        _base.loader.dismiss();
      });
  }

  sendOTP() {
    let _base = this;
    return new Promise(function (resolve, reject) {
      _base.api.sendOtp(_base.userData.phoneNumber)
        .subscribe(function (success) {
          console.log(success);
          resolve(success);
        }, function (error) {
          console.log(error);
          reject(error);
        });
    });
  }

  verifyOTP() {
    let _base = this;
    _base.api.verifyOtp(_base.userData.phoneNumber, parseInt(_base.otp))
      .subscribe(function (success) {
        console.log(success);
        if (success.error == false) {
          _base.register();
        } else {
          alert(success.message);
        }
      }, function (error) {
        console.log(error);
      });
  }



  /*
   Display message
 */
  showToast(position: string, MESSAGE: string) {
    let toast = this.toastCtrl.create({
      message: MESSAGE,
      duration: 3000,
      position: 'top'
    });

    toast.present(toast);
  }

  public showalert(otp: any) {
    let alert = this.alertCtrl.create({
      subTitle: 'Otp is - ' + otp
    });
    alert.present();
  }

  /*
    Loader message
  */
  loading() {
    this.loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'loading...'
    });
    this.loader.present();
  }

  register() {
    let _base = this;
    this.appService.userRegistration(_base.userData, (error, data) => {
      this.loader.dismiss();
      console.log(data);
      if (error) {
        console.log("Registration error :", error);
      }
      else {
        if (!data.error) {
          console.log("Getting data after registration :");
          console.log(data);
          _base.events.publish('data', data.user);
          this.localStorageProvider.setDriverId(data.user._id);
          console.log("After registration _id is :");
          if (data.user._id) {
            var carData = {
              carName: _base.carInfo.carName,
              carNumber: _base.carInfo.carNumber,
              carType: _base.carInfo.carType,
              userId: data.user._id
            }
            _base.appService.addCar(carData, (error, success) => {
              if (error) {
                alert('Error adding car');
              } else {
                console.log("car registration information :");
                console.log(success);
                this.navCtrl.setRoot(DriverdashboardPage);
              }
            });
          }
        }
      }
    });
  }
}


