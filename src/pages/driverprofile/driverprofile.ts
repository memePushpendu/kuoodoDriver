import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Events } from 'ionic-angular';
import { HttpService } from '../../app.httpService';
import { AppService } from '../../app.providers';
import { LocalStorageProvider } from '../../app.localStorage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

/**
 * Generated class for the DriverprofilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-driverprofile',
  templateUrl: 'driverprofile.html',
  providers: [HttpService, AppService]
})
export class DriverprofilePage {
  rate: any = 0;

  // objectKeys = Object.keys;
  // value = { option1: '+91', option2: '+93', option3: '+1' };

  imageId: any;
  public userImage = "https://openclipart.org/image/2400px/svg_to_png/190113/1389952697.png";
  lastName: string;
  firstName: string;
  phoneNumber: any;
  location: any;
  email: any;
  username: string;
  id: any;

  public isUsername: boolean = false;
  public isEmail: boolean = false;
  public isLocation: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private localStorageProvider: LocalStorageProvider,
    private httpService: HttpService,
    private appService: AppService,
    public actionSheetCtrl: ActionSheetController,
    private transfer: FileTransfer,
    private camera: Camera,
    public file: File,
    public events: Events) {

    /*
    Getting id's after registration or login in driver profile page
    */

    this.id = this.localStorageProvider.getDriverId();
    console.log("Getting Id in Profile page :");
    console.log(this.id);

    /*
    Profile information 
    */

    if (this.id) {
      this.appService.getProfile(this.id, (error, data) => {
        if (error) {
          console.log("Error in fetching profile :", error);
        } else {
          if (data) {
            console.log("Profile information :");
            console.log(data);
            this.isUsername = true;
            this.isEmail = true;
            this.isLocation = true;

            this.username = data.user.firstName + " " + data.user.lastName;
            this.email = data.user.email;
            this.phoneNumber = data.user.phoneNumber;
            this.location = data.user.location;
            this.imageId = data.user.profileImage;
            this.rate = data.user.rating;
            if (this.imageId) {
              this.userImage = "http://mitapi.memeinfotech.com:5040/user/fileShow?imageId=" + this.imageId;
            }
          }
        }
      });
    }
  }

  /*
    Edit profile 
    */

  editProfile() {
    this.isUsername = false;
    this.isEmail = false;
    this.isLocation = false;
  }

  /*
  Submit data after edit profile
  */

  submit() {
    let _base = this;
    if (this.username) {
      this.firstName = this.username.substr(0, this.username.indexOf(' '));
      this.lastName = this.username.substr(this.username.indexOf(' ') + 1);
    }

    if (this.id) {
      var data = {
        _id: this.id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        location: this.location
      }
      this.appService.UpdateUser(data, (error, data) => {
        if (error) {
          console.log("Update user data error :");
          console.log(error);
        }
        else if (data) {
          console.log("Update user data :");
          console.log(data);

          this.username = data.user.firstName + " " + data.user.lastName;
          this.email = data.user.email;
          this.phoneNumber = data.user.phoneNumber;
          this.location = data.user.location;
          this.imageId = data.user.profileImage;
          this.rate = data.user.rating;
          if (this.imageId) {
            this.userImage = "http://mitapi.memeinfotech.com:5040/user/fileShow?imageId=" + this.imageId;
          }
          // this.appService.updateUser(data.user);
          _base.events.publish('data', data.user);
          this.isUsername = true;
          this.isEmail = true;
          this.isLocation = true;
        }
      });
    }
  }

  /*
  Selecting images from camera and galery
  */
  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.accessGallery()
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture()
            console.log("open camera:")
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]

    });
    actionSheet.present();
  }

  // take a picture from camera
  takePicture() {
    let _base = this;
    let options: CameraOptions =
      {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.CAMERA  // to access camera
      }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      console.log(imageData);

      const fileTransfer: FileTransferObject = this.transfer.create();

      let file: FileUploadOptions = {
        fileKey: 'file',
        fileName: 'ionicfile',
        chunkedMode: false,
        mimeType: "image/jpeg",
        headers: {}
      }
      console.log("click in upload image .....");
      console.log(file);

      fileTransfer.upload(imageData, 'http://mitapi.memeinfotech.com:5040/user/fileUpload', file)
        .then((data: any) => {
          console.log("upload success", data);
          let imageID = JSON.parse(data.response).upload._id;

          if (this.id) {
            var value = {
              _id: this.id,
              profileImage: imageID
            }
            this.appService.UpdateUser(value, (error, data) => {
              if (error) {
                console.log(error);
              }
              else if (data) {
                console.log("After update user data :");
                console.log(data);
                _base.appService.updateUser(data.user);
                _base.userImage = "http://mitapi.memeinfotech.com:5040/user/fileShow?imageId=" + imageID;
              }
            });
          }
        }, (err) => {
          console.log(err);
        });
    }, (err) => {
      console.log(err);
    });
  }

  // access gallery to select one picture
  accessGallery() {
    let _base = this;
    let options: CameraOptions =
      {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY // to access photo gallery
      }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      console.log(imageData);

      const fileTransfer: FileTransferObject = this.transfer.create();

      let file: FileUploadOptions = {
        fileKey: 'file',
        fileName: 'ionicfile',
        chunkedMode: false,
        mimeType: "image/jpeg",
        headers: {}
      }
      console.log("click in upload image .....");
      console.log(file);
      fileTransfer.upload(imageData, 'http://mitapi.memeinfotech.com:5040/user/fileUpload', file)
        .then((data: any) => {
          console.log("upload success", data);
          let imageID = JSON.parse(data.response).upload._id;

          if (this.id) {
            var value = {
              _id: this.id,
              profileImage: imageID
            }
            this.appService.UpdateUser(value, (error, data) => {
              if (error) {
                console.log(error);
              }
              else if (data) {
                console.log("After update user data :");
                console.log(data);
                _base.appService.updateUser(data.user);
                this.userImage = "http://mitapi.memeinfotech.com:5040/user/fileShow?imageId=" + imageID;
              }
            });
          }
        }, (err) => {
          console.log(err);
        });
    }, (err) => {
      console.log(err);
    });
  }

}
