import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserProfileService} from "../services/user-profile/user-profile.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {

  passwordFrom !: FormGroup;
  usernameForm !: FormGroup;
  emailForm !: FormGroup;

  success: boolean = false;
  error: boolean = false;
  responseMessage: string = "";

  myUserId: number = 0;
  isAdmin: boolean = false;

  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private userService: UserProfileService) {  }


  ngOnInit() {
    if (localStorage.getItem("userId") != null) {
      this.myUserId = parseInt(localStorage.getItem("userId")!);
    }

    if (localStorage.getItem("isAdmin") != null) {
      this.isAdmin = localStorage.getItem("isAdmin") == "true";
      console.log(this.isAdmin)
    }

    this.passwordFrom = this.createPasswordForm();
    this.usernameForm = this.createUsernameForm();
    this.emailForm = this.createEmailForm();

    this.getUserProfile();
  }

  createPasswordForm() {
    return new FormGroup({
      //oldPassword: new FormControl('', [Validators.required, Validators.minLength(1)]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(5)]),
      newPasswordConfirm: new FormControl('', [Validators.required, Validators.minLength(5)]),
    })
  }

  passwordValid() {
    if (this.passwordFrom.value.newPassword == "" && this.passwordFrom.value.newPasswordConfirm == "") {
      return false;
    } else if (this.passwordFrom.value.newPassword == this.passwordFrom.value.newPasswordConfirm) {
      return true;
    }
    return false;
  }

  createEmailForm() {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.minLength(5)])
    })
  }

  createUsernameForm() {
    return new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(5)])
    })
  }

  getUserProfile() {
    this.userService.getUserProfile(this.myUserId).subscribe(
      (data: any) => {
        this.username = data.username;
        this.email = data.email;
        this.password = data.password;
      });
  }

  changeUsername() {
    this.userService.updateUserProfile(this.myUserId, this.usernameForm.value.username, this.email, this.password).subscribe(
      (data: any) => {
        this.success = true;
        this.error = false;
        this.responseMessage = data.message;
      }, (error: any) => {
        this.success = false;
        this.error = true;
        this.responseMessage = error.error.message;
      });
  }

  changeEmail() {
    this.userService.updateUserProfile(this.myUserId, this.username, this.emailForm.value.email, this.password).subscribe(
      (data: any) => {
        this.success = true;
        this.error = false;
        this.responseMessage = data.message;
      }, (error: any) => {
        this.success = false;
        this.error = true;
        this.responseMessage = error.error.message;
      });
  }

  changePassword() {
    this.userService.updateUserProfile(this.myUserId, this.username, this.email, this.passwordFrom.value.newPassword).subscribe(
      (data: any) => {
        this.success = true;
        this.error = false;
        this.responseMessage = data.message;
      }, (error: any) => {
        this.success = false;
        this.error = true;
        this.responseMessage = error.error.message;
      });
  }

}
