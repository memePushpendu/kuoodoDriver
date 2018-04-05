import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { HttpService } from '../../app.httpService';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
    selector: 'page-resetpwd',
    templateUrl: 'resetpwd.html',
})
export class ResetpwdPage {
    public confirmPassword: string = '';
    public password: string = '';
    public phoneNumber: any;
    public message: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public api: HttpService,
        public toastCtrl: ToastController) {
        // GET PHONENUMBER FROM URL PARAM
        this.phoneNumber = navParams.get('phoneNumber');
        console.log(this.phoneNumber);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ResetpwdPage');
    }

    // RESET PASSWORD FUNCTION
    resetPassword() {
        if (this.confirmPassword == this.password) {
            this.api.resetFPassword(this.phoneNumber, this.password).subscribe(data => {
                console.log(data);
                if (data.error == false) {
                    console.log("After reset password :");
                    console.log(data);
                    this.navCtrl.setRoot(LoginPage);
                } else {
                    let toast = this.toastCtrl.create({
                        message: "Could not reset password",
                        duration: 3000,
                        position: 'top'
                    });
                    toast.present(toast);
                }
            });
        }
        else {
            let toast = this.toastCtrl.create({
                message: "Password are not matched",
                duration: 3000,
                position: 'top'
            });
            toast.present(toast);
        }
    }
}