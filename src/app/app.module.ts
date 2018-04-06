import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { Network } from '@ionic-native/network';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RegistrationPage } from "../pages/registration/registration";
import { SearchlocationPage } from "../pages/searchlocation/searchlocation";
import { DocumentationPage } from "../pages/documentation/documentation";
import { DriverdashboardPage } from "../pages/driverdashboard/driverdashboard";
import { LoginPage } from '../pages/login/login';
import { LocalStorageProvider } from '../app.localStorage';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { AppService } from './../app.providers';
import { HttpService } from './../app.httpService';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { DriverprofilePage } from '../pages/driverprofile/driverprofile';
import { DriverRidePage } from '../pages/driver-ride/driver-ride';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Diagnostic } from '@ionic-native/diagnostic';
import { TriphistoryPage } from '../pages/triphistory/triphistory';
import { Ionic2RatingModule } from 'ionic2-rating';
import { Vibration } from '@ionic-native/vibration';
import { OtpscreenPage } from '../pages/otpscreen/otpscreen';
import { OtpPage } from '../pages/otp/otp';
import { ResetpwdPage } from '../pages/resetpwd/resetpwd';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    RegistrationPage,
    SearchlocationPage,
    DocumentationPage,
    LoginPage,
    DriverprofilePage,
    DriverdashboardPage,
    OtpPage,
    DriverRidePage,
    TriphistoryPage,
    OtpscreenPage,
    ResetpwdPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    Ionic2RatingModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    RegistrationPage,
    SearchlocationPage,
    DocumentationPage,
    DriverprofilePage,
    DriverdashboardPage,
    OtpPage,
    DriverRidePage,
    TriphistoryPage,
    OtpscreenPage,
    ResetpwdPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    LocalStorageProvider,
    GoogleMaps,
    Geolocation,
    Camera,
    File,
    AppService,
    HttpService,
    Network, FileTransfer,
    LocalNotifications,
    Diagnostic,
    Vibration,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
