//import modules
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class HttpService {

    //provide the base url
    private url = 'http://mitapi.memeinfotech.com:5040/';
    // private url = 'http://localhost:5020/';
    //request headers

    private headerOptions = new RequestOptions({
        headers: new Headers({ 'Content-Type': 'application/json;charset=UTF-8' })
    });

    constructor(private http: Http) { }


    public sendOtp(params) {
        console.log("verify user and send otp for registration");
        console.log(params);
        return this.http.post(this.url + "user/verifyUser", JSON.stringify({ phoneNumber: params }), this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    //Verify OTP for registration in http service
    public verifyOtp(phone, code) {
        console.log("Verify otp for registration");
        console.log(phone);
        console.log(code);
        console.log(typeof (code));
        return this.http.post(this.url + "user/verifyOTP", JSON.stringify({ phoneNumber: phone, code: code }), this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    //User registration in http service
    public userRegistration(params) {
        console.log("User registration in http service");
        console.log(params);
        return this.http.post(this.url + "user/registration", JSON.stringify(params), this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    //User login in http service
    public login(params) {
        console.log("User login in http service");
        console.log(params);
        return this.http.post(this.url + "user/login", JSON.stringify(params), this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    //Driver location in http service
    public driverLocation(params) {
        console.log("Driver location in http service");
        console.log(params);
        return this.http.put(this.url + "user/driverUpdateLocation", JSON.stringify(params), this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    /**
     * 
     *   Get info / details of the current user
     *   params : User id
     *   return userinfo (object)
     * 
     * **/
    public getUserInfo(userID: string) {
        return this.http.get(this.url + "user/getDetails?_id=" + userID, this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    /** driver status update **/
    public updateDriverStatus(status: string, userID: string) {
        return this.http.put(this.url + "user/availability", { 'availability': status, "_id": userID }, this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    //add profile image
    public addProfileImage(profileImg: string, userID: string) {
        return this.http.put(this.url + "user/update", { 'profileImage': profileImg, "_id": userID }, this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    //Uers Update 
    public UpdateUser(params) {
        console.log("Uers Update :");
        console.log(params);
        return this.http.put(this.url + "user/update", JSON.stringify(params), this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    //Document upload
    public documentUpload(params) {
        console.log("Document upload in http service");
        console.log(params);
        return this.http.post(this.url + "driver/driverDocs", JSON.stringify(params), this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    //Driver Start Ride 
    public driverStartRide(params) {
        console.log("Driver start ride in http :");
        console.log(params);
        return this.http.put(this.url + "booking/startRide", JSON.stringify(params), this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    //Driver End Ride 
    public driverEndRide(params) {
        console.log("Driver end ride in http :");
        console.log(params);
        return this.http.put(this.url + "booking/endRide", JSON.stringify(params), this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    //Accept Ride
    public acceptRide(params) {
        console.log("Driver accept ride in http :");
        console.log(params);
        return this.http.put(this.url + "booking/accept", JSON.stringify(params), this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    //cancel Ride
    public cancelRide(params) {
        console.log("Driver cancel ride in http :");
        console.log(params);
        return this.http.put(this.url + "booking/cancel", JSON.stringify(params), this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    //Driver history list
    //Driver add Car
    public addCar(carData: any) {
        return this.http.post(this.url + "driver/driverDocs", carData, this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    // get driver car details
    public getCar(driverID: any) {
        return this.http.get(this.url + "driver/driverCarDetails?driverId=" + driverID, this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    //get distance
    public getDistance(oLat: string, oLng: string, dLat: string, dLng: string) {
        return this.http.get('http://maps.googleapis.com/maps/api/directions/json?origin=' + oLat + ',' + oLng + '&destination=' + dLat + ',' + dLng + '&sensor=false', this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    //User history list
    public userHistory(userId: string) {
        return this.http.get(this.url + "booking/driverHistory?driverId=" + userId, this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    // APIS for FORGOT Password
    public sendFOTP(phone) {
        return this.http.post(this.url + "user/forgotPassword", { phoneNumber: phone }, this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    public verifyFOTP(phone, code) {
        console.log(code)
        return this.http.post(this.url + "user/verifyforForgotPassword", { phoneNumber: phone, code: code }, this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }

    public resetFPassword(phone, newPassword) {
        return this.http.put(this.url + "user/resetPassword", { phoneNumber: phone, password: newPassword }, this.headerOptions)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json() || `Server error`));
    }
}