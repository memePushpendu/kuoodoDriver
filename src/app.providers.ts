import { Injectable } from '@angular/core';
import { HttpService } from './app.httpService';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AppService {

    userInfo: BehaviorSubject<any> = new BehaviorSubject({});
    PaymentDetails: BehaviorSubject<any> = new BehaviorSubject({});

    constructor(private httpService: HttpService) { }

    updateUser(userData: any) {
        console.log("userdata");
        console.log(userData);
        this.userInfo.next(userData);
    }

    payment(PaymentData: any) {
        console.log("PaymentData");
        console.log(PaymentData);
        this.PaymentDetails.next(PaymentData);
    }

    //User registration in providers 
    public userRegistration(params, callback): any {
        console.log("User registration in providers");
        console.log(params);
        this.httpService.userRegistration(params).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }

    /**
     * 
     *   Get the profile info of user\
     *   params: userID ( String )
     * 
     *   returns userInfo (Objectu)
     * 
     * **/

    public getProfile(userID: string, callback): any {
        this.httpService.getUserInfo(userID).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }

    //User login in providers 
    public login(params, callback): any {
        console.log("User login in providers");
        console.log(params);
        this.httpService.login(params).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }

    //Driver location update in providers 
    public driverLocation(params, callback): any {
        console.log("Driver location in providers");
        console.log(params);
        this.httpService.driverLocation(params).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }

    // update driver status
    updateDriverStatus(status: string, userID: string, callback): any {
        this.httpService.updateDriverStatus(status, userID).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }

    // update profile pic
    addProfileImage(profileImg: string, userID: string, callback): any {
        this.httpService.addProfileImage(profileImg, userID).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }

    //Update User 
    public UpdateUser(params, callback): any {
        console.log("Update User :");
        console.log(params);
        this.httpService.UpdateUser(params).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }

    //Document Upload 
    public documentUpload(params, callback): any {
        console.log("Document Upload in providers :");
        console.log(params);
        this.httpService.documentUpload(params).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }

    //Driver Start Ride
    public driverStartRide(params, callback): any {
        console.log("Driver start ride in providers :");
        console.log(params);
        this.httpService.driverStartRide(params).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }

    //Driver End Ride
    public driverEndRide(params, callback): any {
        console.log("Driver end ride in providers :");
        console.log(params);
        this.httpService.driverEndRide(params).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }

    //Accept Ride
    public acceptRide(params, callback): any {
        console.log("Driver accept ride in providers :");
        console.log(params);
        this.httpService.acceptRide(params).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }

    //cancel Ride
    public cancelRide(params, callback): any {
        console.log("Driver cancel ride in providers :");
        console.log(params);
        this.httpService.cancelRide(params).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }

    //Driver history list
    // add car
    public addCar(carData, callback): any {
        this.httpService.addCar(carData).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }


    public getCar(driverID, callback): any {
        this.httpService.getCar(driverID).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }

    public getDistance(oLat: string, oLng: string, dLat: string, dLng: string, callback): any {
        this.httpService.getDistance(oLat, oLng, dLat, dLng).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }

    //User history list
    public userHistory(params, callback): any {
        console.log("User history in providers :");
        console.log(params);
        this.httpService.userHistory(params).subscribe(data => {
            callback(false, data);
        }, error => {
            callback(true, error || 'HTTP fail.');
        });
    }

}