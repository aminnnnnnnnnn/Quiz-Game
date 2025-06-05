import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  selectedLanguage: string | undefined;
  selectedTheme: string | undefined;
  constructor(private router: Router, public translate: TranslateService) {
    translate.addLangs(['English', 'German', 'French']);
    translate.setDefaultLang('English');
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }

  toLogin(){
    this.router.navigate(['/']);
  }

  ngOnInit() {

    var activeUser = localStorage.getItem("activeUser");

    if (activeUser) {
      this.selectedLanguage = 'en';
      this.selectedTheme = 'light';
    } else {
      //this.toLogin();
    }
  }

  saveSettings() {
    // Hier könntest du die Einstellungen speichern, z.B. in LocalStorage oder einem Backend
    console.log('Settings saved:', this.selectedLanguage, this.selectedTheme);
  }
}
