import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationComponent} from "../authentication/authentication.component";


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {


  username: string = '';

  // @ts-ignore
  constructor(private router: Router, private authComponent: AuthenticationComponent) {

  }


  ngOnInit(): void {
    // @ts-ignore

    if (localStorage.getItem("userId") != null) {
      this.username = String(localStorage.getItem('username'));
    }
  }

  goToPlay() {
    this.router.navigate(['/play']);
  }

  goToStatistics(option: string) {
    this.onOptionSelected(option);
    this.router.navigate(['/statistics']);
  }

  goToFriendsManger(option: string) {
    this.onOptionSelected(option);
    this.router.navigate(['/friends']);
  }

  goToSettings(option: string) {
    this.onOptionSelected(option);
    this.router.navigate(['/settings']);
  }

  goToAdmin(option: string) {
    this.onOptionSelected(option);
    this.router.navigate(['/admin']);
  }

  goToProfile(option: string) {
    this.onOptionSelected(option);
    this.router.navigate(['/profile']);
  }

  logOut(option: string) {
    this.onOptionSelected(option);
    this.authComponent.logOut();
  }

  isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  onOptionSelected(option: string) {
    console.log('Selected:', option);
    this.isOpen = false; // Schließen Sie das Dropdown nach der Auswahl
  }
}
