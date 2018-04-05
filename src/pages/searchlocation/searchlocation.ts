/**
 * 
 * Actually the final reg page
 * 
 * 
 * **/


import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, Events } from 'ionic-angular';
import { DocumentationPage } from "../documentation/documentation";
import { AppService } from '../../app.providers';
import { HttpService } from '../../app.httpService';
import { DriverdashboardPage } from '../driverdashboard/driverdashboard';
import { LocalStorageProvider } from '../../app.localStorage';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
// import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { OtpPage } from '../../pages/otp/otp';

/**
 * Generated class for the SearchlocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

/**
 *  More Ja tora 
 **/

@Component({
  selector: 'page-searchlocation',
  templateUrl: 'searchlocation.html',
  providers: [AppService, HttpService]
})
export class SearchlocationPage {
  countryDetails: any = [];
  loadingMessage: any;
  loader: any;
  passwordVerifiedMessage: string;
  id: any;
  message: any;
  locationMessage: string = '';
  location: any;
  confirmPasswordMessage: string = '';
  confirmPassword: any;
  passwordMessage: string = '';
  password: any;
  phoneNumberMessage: string = '';
  phoneNumber: any;
  lastName: any;
  firstName: any;
  email: any;
  option: any;

  public car: any = {
    'carType': 'standard',
    'carNumber': '',
    'carName': '',
    'userId': ''
  };


  public carTypes = [{
    'text': 'Standard',
    'value': 'standard'
  }, {
    'text': 'Standard Plus',
    'value': 'standard_plus'
  }, {
    'text': 'Premium',
    'value': 'premium'
  }, {
    'text': 'Premium Plus',
    'value': 'premium_plus'
  }, {
    'text': 'Sport',
    'value': 'sport'
  }, {
    'text': 'Sport Plus',
    'value': 'sport_plus'
  }];

  constructor(public nav: NavController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpService: HttpService,
    private appService: AppService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private localStorageProvider: LocalStorageProvider,
    public http: Http,
    public events: Events) {

    this.email = this.navParams.get("email");
    this.firstName = this.navParams.get("firstName");
    this.lastName = this.navParams.get("lastName");

    /*
    Accesssing country code and name
    */
    this.http.get('./assets/country.json')
      .map((res) => res.json())
      .subscribe(data => {
        for (var i = 0; i < data.countries.length; i++) {
          let countryDetails = data.countries[i];
          this.countryDetails.push(countryDetails);
          // console.log("Data :", this.countryDetails);
        }
      }, (error) => {
        console.error("Error :", error);
      });
  }

  /*
    Clean message for Phone number
  */
  phoneNumberCleanMessage() {
    if (this.phoneNumberMessage.length > 0)
      this.phoneNumberMessage = '';
  }

  /*
    Claen message for Password
  */
  passwordCleanMessage() {
    if (this.passwordMessage.length > 0)
      this.passwordMessage = '';
  }

  /*
     Claen message for Confirm password
   */
  confirmPasswordCleanMessage() {
    if (this.confirmPasswordMessage.length > 0)
      this.confirmPasswordMessage = '';
  }

  /*
    Claen message for Location
  */
  locationCleanMessage() {
    if (this.locationMessage.length > 0)
      this.locationMessage = '';
  }

  /*
    Password Validation
  */
  passwordValidation() {

    if (this.password == this.confirmPassword) {
      this.confirmPasswordMessage = "";
    }
    else if (this.password != this.confirmPassword) {
      this.confirmPasswordMessage = " wrong Password";
    }
  }

  /*
  Registration
*/
  completeRegistration() {

    let _base = this;
    /** driver car info validation **/
    if (this.car.carName.trim() == '') {
      alert('car name can not be empty');
      return;  // code stops execution here
    }

    if (this.car.carNumber.trim() == '') {
      alert('car number can not be empty');
      return; // stops code execution
    }

    if (this.phoneNumber == '' || this.phoneNumber == null) {
      this.phoneNumberMessage = "Please enter your phone number";
    }
    else if (this.password == '' || this.password == null) {
      this.passwordMessage = "Please enter your password";
    } else if (this.confirmPassword == '' || this.confirmPassword == null) {
      this.confirmPasswordMessage = "Please Re-enter your Password";
    }
    else if (this.location == '' || this.location == null) {
      this.locationMessage = "Please enter your location";
    } else {

      var data = {
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        phoneNumber: this.option + this.phoneNumber,
        password: this.password,
        location: this.location,
        role: "Driver"
      }

      var carInfo = {
        carName: this.car.carName,
        carNumber: this.car.carNumber,
        carType: this.car.carType
      }
      if (this.password == this.confirmPassword) {

        this.navCtrl.push(OtpPage, { navData: data, carData: carInfo });

      } else {
        this.message = "Please enter the confirm correct password.";
        this.showToast('top');
      }
    }
  }

  /*
    Loader message
  */
  loading() {
    this.loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: this.loadingMessage
    });
  }

  /*
    Display message
  */
  showToast(position: string) {
    let toast = this.toastCtrl.create({
      message: this.message,
      duration: 3000,
      position: 'top'
    });
    toast.present(toast);
  }
}
