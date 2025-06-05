import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppComponent} from "../app.component";
import {TranslateService} from "@ngx-translate/core";
import {UserService} from "../services/user/user.service";
import {timeout} from "rxjs";
import {AuthenticationService} from "../services/authentication/authentication.service";
import jwt_decode from "jwt-decode";
import {SocketService} from "../services/socket/socket.service";

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit{

  isLoginMode: boolean = false;
  username: string = '';
  email: string = '';
  password: string = '';
  lemail: string = '';
  lpassword: string = '';

  success: boolean = false;
  error: boolean = false;
  responseMessage: string = "";

  static userId: number;
  static isAdmin: boolean;

  constructor(private router: Router,
              private translate: TranslateService,
              private userService: UserService,
              private authenticationService: AuthenticationService) {
  }

  //ToDo: Irgendwie beim beenden des servers noch einfügen, dass local storage gecleart wird, sonst kann man überall hin
  ngOnInit() {
    if (localStorage.getItem("userId")) {
      this.toPlayPage();
    }

  }

  signUp() {

    if (this.username.length > 2 && this.email.length > 4 && this.password.length > 4) {
      this.userService.postUser(this.username, this.password, this.email).subscribe((data: any) => {

        this.responseMessage = data.message;
        this.success = true;
        this.error = false;
        setTimeout(() => {
          this.toLogin();
        }, 1000);

      }, (error: any) => {
        this.responseMessage = error.error.message;
        this.success = false;
        this.error = true;
      });
    } else {
      this.responseMessage = "Der Username muss mindestens 3 Zeichen lang sein. Die Email und das Passwort müssen mindestens 5 Zeichen lang sein.";
      this.success = false;
      this.error = true;
    }
  }

  logIn() {

    if (this.lemail != '' || this.lpassword != '') {
      this.authenticationService.login(this.lemail, this.lpassword).subscribe((data: any) => {

        if (!data.user) {
          this.responseMessage = data.message;
          this.success = false;
          this.error = true;
          return;
        } else {

          const token = this.getDecodedAccessToken(data.token)

          localStorage.setItem('userId', token.userId);
          localStorage.setItem('isAdmin', token.isAdmin);
          localStorage.setItem('username', token.username);

          this.responseMessage = data.message;
          this.success = true;
          this.error = false;

          setTimeout(() => {
            this.toPlayPage();
          }, 1000);
        }
      }, (error: any) => {
        this.responseMessage = error.error.message;
        this.success = false;
        this.error = true;
      });
    } else {
      this.responseMessage = "Please fill out all fields";
      this.success = false;
      this.error = true;
    }


  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  logOut() {
    this.authenticationService.logout().subscribe((data: any) => {
      console.log(data);
      if (data.message == "The user has been logged out.") {
        localStorage.clear();
        this.toLogin();
        this.responseMessage = data.message;
        this.success = true;
        this.error = false;
      } else {
        this.responseMessage = data.message;
        this.success = false;
        this.error = true;
        return;
      }
    }, (error: any) => {
      this.responseMessage = error.error.message;
      this.success = false;
      this.error = true;

    });

  }

  toPlayPage() {
    this.router.navigate(['/play']);
  }

  toLogin() {
    this.router.navigate(['/']);
  }

  getMyUserId() {
    return AuthenticationComponent.userId;
  }

  checkIfAdmin() {
    return AuthenticationComponent.isAdmin;
  }


}
