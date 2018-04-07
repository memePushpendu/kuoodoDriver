import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { HttpService } from '../../app.httpService';
import { ResetpwdPage } from '../resetpwd/resetpwd';

@IonicPage()
@Component({
    selector: 'page-otpscreen',
    templateUrl: 'otpscreen.html',
})
export class OtpscreenPage {

    public isPhoneNumber: boolean = true;
    public isCode: boolean = false;

    public phone: string = "";
    public code: string = "";
    public otpmessage: string;
    public loader: any;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        public api: HttpService, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OtpscreenPage');
    }

    sendOTP() {
        let _base = this;
        this.loading();
        this.api.sendFOTP(this.phone).subscribe(data => {
            _base.loader.dismiss();
            console.log('otp result', data)
            this.isPhoneNumber = false;
            this.isCode = true;
        },
            error => {
                _base.loader.dismiss();
                if (error.error == true) {
                    let toast = this.toastCtrl.create({
                        message: error.message,
                        duration: 3000,
                        position: 'top'
                    });
                    toast.present(toast);
                }
            });
    }

    verifyOTP() {
        console.log('code input', this.code)
        let _base = this;
        if (this.code) {
            this.loading();
            this.api.verifyFOTP(this.phone, parseInt(this.code)).subscribe(result => {
                console.log('verify otp result', result)
                _base.loader.dismiss();
                if (result.error == false) {
                    this.navCtrl.push(ResetpwdPage, {
                        phoneNumber: this.phone
                    });
                }
                else {
                    alert("Invalid otp");
                }
            }, error => {
                _base.loader.dismiss();
            })
        }
    }

    loading() {
        this.loader = this.loadingCtrl.create({
            spinner: 'bubbles',
            content: 'loading...'
        });
        this.loader.present();
    }

}