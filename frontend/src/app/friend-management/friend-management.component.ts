import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../services/user/user.service";
import {AuthenticationComponent} from "../authentication/authentication.component";
import {AuthenticationService} from "../services/authentication/authentication.service";
import {Friend} from "../services/user/Friend";


@Component({
  selector: 'app-friend-management',
  templateUrl: './friend-management.component.html',
  styleUrls: ['./friend-management.component.css']
})
export class FriendManagementComponent implements OnInit {

//ToDo: Verhindern, dass beim neuladen der seite die userid usw weg ist, sodass man direkt zum login weitergeleitet wird
  userId: number = 0;
  isAdmin: boolean = false;

  friends: Friend[] = [];

  newFriendName: string = '';

  success: boolean = false;
  error: boolean = false;
  responseMessage: string = "";

  myUserId: number = 0;

  constructor(private router: Router,
              private userService: UserService,
              private authentication: AuthenticationComponent, private authService: AuthenticationService) {
  }

  ngOnInit() {

    if (localStorage.getItem("userId") != null) {
      this.myUserId = parseInt(localStorage.getItem("userId")!);
    }

    if (!this.myUserId) {
      this.toLogin();
    }

    this.getFriends(this.myUserId);
  }


  addFriend() {
//ToDo: Wenn freund existiert Fehler im Server
    this.userService.addFriend(this.myUserId, this.newFriendName).subscribe((data: any) => {

      if (data.message !== `Friend: ${this.newFriendName} added successfully!`) {
        throw new Error("player not found");
      }
        this.responseMessage = data.message;
        this.success = true;
        this.error = false;

        this.friends.push(data);
        this.getFriends(this.myUserId);

        setTimeout(() => {
          this.success = false;
          this.responseMessage = "";
        }, 2000);

    }, (error) => {
      console.log(error);
      this.responseMessage = error.error.message;
      this.success = false;
      this.error = true;

      setTimeout(() => {
        this.error = false;
        this.responseMessage = "";
      }, 2000);
    });
  }

  /* ALt
    addFriend() {

      this.userService.addFriend(this.myUserId, this.newFriendName).subscribe((data: any) => {

        if(data.message !== "Friend: michi added successfully!") {
          this.responseMessage = data.message;
          this.success = false;
          this.error = true;
          return;
        } else {
          this.responseMessage = data.message;
          this.success= true;
          this.error = false;

          this.friends.push(data);
          this.getFriends(this.myUserId);

          setTimeout(() => {
            this.error = false;
            this.responseMessage = "";
          }, 2000);
        }
      }, (error) => {
        console.log(error);
        this.responseMessage = error.error.message;
        this.success = false;
        this.error = true;

        setTimeout(() => {
          this.error = false;
          this.responseMessage = "";
        }, 2000);
      });
    }
  */

  removeFriend(friend: Friend) {
    this.userService.deleteFriend(friend.user_id).subscribe((data: any) => {

      this.responseMessage = data.message;
      this.success = true;
      this.error = false;

      this.friends.splice(data);
      this.getFriends(this.myUserId);

      setTimeout(() => {
        this.success = false;
        this.responseMessage = "";
      }, 2000);

    }, (error) => {
      console.log(error)
      this.responseMessage = error.message;
      this.success = false;
      this.error = true;

      setTimeout(() => {
        this.error = false;
        this.responseMessage = "";
      }, 2000);
    })
  }

  /*
    removeFriend(friend: Friend) {
      this.userService.deleteFriend(friend.user_id).subscribe((data:any) => {

        if(!data) {
          this.responseMessage = data.message;
          this.success = false;
          this.error = true;
          return;
        } else {
          this.responseMessage = data.message;
          this.success= true;
          this.error = false;

          this.friends.splice(data);
          this.getFriends(this.myUserId);

          setTimeout(() => {
            this.error = false;
            this.responseMessage = "";
          }, 2000);
        }
      }, (error) => {
        console.log(error)
        this.responseMessage = error.error.message;
        this.success = false;
        this.error = true;

        setTimeout(() => {
          this.error = false;
          this.responseMessage = "";
        }, 2000);
      })
    }
    */

  getFriends(userId: number) {

    this.userService.getFriends(userId).subscribe((data: any) => {

      this.friends = data;


    }, (error: any) => {
      console.log(error);

      setTimeout(() => {
        this.error = false;
        this.responseMessage = "";
      }, 2000);
    });
  }

  /*
    getFriends(userId: number) {

      this.userService.getFriends(userId).subscribe((data: any) => {

        if(!data) {
          this.responseMessage = data.message;
          this.success = false;
          this.error = true;
          return;
        } else {

          this.responseMessage = data.message;
          this.success= true;
          this.error = false;
          this.friends = data;

          setTimeout(() => {
            this.error = false;
            this.responseMessage = "";
          }, 2000);
        }
      }, (error: any) => {
        console.log(error);
        this.responseMessage = error.error.message;
        this.success = false;
        this.error = true;

        setTimeout(() => {
          this.error = false;
          this.responseMessage = "";
        }, 2000);
      });
    }
    */

  toLogin() {
    this.router.navigate(['/']);
  }
}
