import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
    constructor(public navCtrl: NavController, public navParams: NavParams, public api: HttpService) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OtpscreenPage');
    }

    sendOTP() {
        if (this.phone.trim().length >= 8) {
            console.log('send otp function', this.phone)
            this.api.sendFOTP(this.phone).subscribe(data => {
                console.log('otp result', data)
                this.isPhoneNumber = false;
                this.isCode = true;
            })
        }
    }

    verifyOTP() {
        console.log('code input', this.code)
        if (this.code) {
            this.api.verifyFOTP(this.phone, parseInt(this.code)).subscribe(result => {
                console.log('verify otp result', result)
                if (result.error == false) {
                    this.navCtrl.push(ResetpwdPage, {
                        phoneNumber: this.phone
                    });
                }
                else {
                    alert("Invalid otp");
                }
            })
        }
    }

}