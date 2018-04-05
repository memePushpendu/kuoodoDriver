import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { RegistrationPage } from "../pages/registration/registration";
import { DriverdashboardPage } from "../pages/driverdashboard/driverdashboard";
import { DocumentationPage } from '../pages/documentation/documentation';
import { SearchlocationPage } from '../pages/searchlocation/searchlocation';
import { LoginPage } from '../pages/login/login';
import { LocalStorageProvider } from '../app.localStorage';
import { AppService } from './../app.providers';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { DriverprofilePage } from '../pages/driverprofile/driverprofile';
import { DriverRidePage } from '../pages/driver-ride/driver-ride';
import * as firebase from 'firebase';  // import firebase
import { Diagnostic } from '@ionic-native/diagnostic';
import { TriphistoryPage } from '../pages/triphistory/triphistory';
import { OtpscreenPage } from '../pages/otpscreen/otpscreen';


const config = {
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

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // rootPage: any = DriverRidePage;
  rootPage: any = LoginPage;
  id: any;
  pages: Array<{ title: string, component: any }>;
  public userName = "username";
  public userImage = "https://openclipart.org/image/2400px/svg_to_png/190113/1389952697.png";

  constructor(private transfer: FileTransfer,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private localStorageProvider: LocalStorageProvider,
    private appService: AppService,
    private camera: Camera,
    public file: File,
    private diagnostic: Diagnostic,
    public events: Events) {

    let _base = this;
    // primary requirement checking

    //Driver Id
    this.id = this.localStorageProvider.getDriverId();

    this.diagnostic.isLocationEnabled().then(function (e) {
      if (!e) {
        _base.diagnostic.switchToLocationSettings();
      }
    }).catch(function (error) {
      _base.diagnostic.switchToLocationSettings();
    });

    /** get data on user changed **/
    // _base.appService.userInfo.subscribe(data => {
    //   console.log("userdata in app service :");
    //   console.log(data);

    //   if (data.firstName && data.lastName) {
    //     _base.userName = data.firstName + " " + data.lastName;
    //   }
    //   if (data.profileImage) {
    //     _base.userImage = "http://mitapi.memeinfotech.com:5040/user/fileShow?imageId=" + data.profileImage;
    //   }
    // });

    _base.events.subscribe('data', (data) => {
      if (data.firstName && data.lastName) {
        _base.userName = data.firstName + " " + data.lastName;
      }
      if (data.profileImage) {
        _base.userImage = "http://mitapi.memeinfotech.com:5040/user/fileShow?imageId=" + data.profileImage;
      }
    });

    this.initializeApp();

    if (this.id) {
      this.rootPage = DriverdashboardPage;
      var database = firebase.database();
      database.ref("/" + _base.id).on("value", function (snapshot) {
        if (snapshot.val()) {
          database.ref("/" + _base.id).remove();
          _base.appService.payment(snapshot.val());
          if (snapshot.val().purpose == 'payment') {
            _base.appService.payment({
              'status': snapshot.val().status
            });
          }
        }
      });
    }

    // used for an example of ngFor and navigation
    this.pages = [
      // { title: 'My Profile', component: DriverdashboardPage },
      // { title: 'Manage Vehicle', component: HomePage },
      // { title: 'Manage Customer', component: HomePage },
      // { title: 'History', component: HomePage },
      // { title: 'Billing Desk', component: HomePage },
      // { title: 'Help and Support', component: ListPage },
      { title: 'Document Upload', component: DocumentationPage },
      { title: 'Profile', component: DriverprofilePage },
      { title: 'trip history', component: TriphistoryPage }
      // { title: 'Logout', component: LoginPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();


    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }

  logout() {
    // localStorage.removeItem("loginId");
    localStorage.clear();
    this.nav.setRoot(LoginPage);
  }

}
