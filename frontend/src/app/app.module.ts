import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './navbar/navbar.component';
import { PlayComponent } from './play/play.component';
import { RouterModule, Routes } from "@angular/router";
import { AuthenticationComponent } from './authentication/authentication.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { FooterComponent } from './footer/footer.component';
import { SettingsComponent } from './settings/settings.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { SimplegameComponent } from './simplegame/simplegame.component';
import { FriendManagementComponent } from './friend-management/friend-management.component';
import { FriendschallengeComponent } from './friendschallenge/friendschallenge.component';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import {NgOptimizedImage} from "@angular/common";
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { SuccessAlertComponent } from './alerts/success-alert/success-alert/success-alert.component';
import { DangerAlertComponent } from './alerts/danger-alert/danger-alert/danger-alert.component';
import { EditQuestionComponent } from './profile-page/edit-Question/edit-question/edit-question.component';
import {SocketIoConfig, SocketIoModule} from "ngx-socket-io";
import { ImpressumComponent } from './impressum/impressum.component';
import { FaqComponent } from './faq/faq.component';
import { SocketService} from "./services/socket/socket.service";
import { UserProfileComponent } from './user-profile/user-profile.component';
import {UserProfileService} from "./services/user-profile/user-profile.service";

const myRoutes: Routes =[
  {path:'' , component:AuthenticationComponent},
  {path:'play' , component:PlayComponent},
  {path:'friends' , component:FriendManagementComponent},
  {path:'settings' , component:SettingsComponent},
  {path:'statistics' , component:StatisticsComponent},
  {path:'simplegame' , component:SimplegameComponent},
  {path:'friendschallenge' , component:FriendschallengeComponent},
  {path:'admin' , component:ProfilePageComponent},
  {path:'impressum' , component:ImpressumComponent},
  {path:'faq' , component:FaqComponent},
  {path:'profile' , component:UserProfileComponent},
]

const config: SocketIoConfig = { url: 'http://localhost:3000/', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PlayComponent,
    AuthenticationComponent,
    FooterComponent,
    SettingsComponent,
    StatisticsComponent,
    SimplegameComponent,
    FriendManagementComponent,
    FriendschallengeComponent,
    ProfilePageComponent,
    SuccessAlertComponent,
    DangerAlertComponent,
    EditQuestionComponent,
    ImpressumComponent,
    FaqComponent,
    UserProfileComponent
  ],
  imports: [
    RouterModule.forRoot(myRoutes),
    BrowserModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'German',
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    FormsModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [AuthenticationComponent, SocketService],
  exports: [RouterModule, TranslateModule],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function httpTranslateLoader(http: HttpClient){
  return new TranslateHttpLoader(http);
}
