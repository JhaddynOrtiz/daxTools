import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputConverterComponent } from './components/input-converter/input-converter.component';

import { environment } from "../environments/environment";

import { FormsModule } from '@angular/forms'; // or import { ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { MaterialModule } from './core/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FirebaseUIModule, firebase, firebaseui } from 'firebaseui-angular';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { LoginComponent } from './components/login/login.component';
import { ProductionTaskListComponent } from './components/production-task-list/production-task-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { HomeComponent } from './components/home/home.component';


const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      {
          scopes: [
              'public_profile',
              'email',
              'user_likes',
              'user_friends'
          ],
          customParameters: {
              'auth_type': 'reauthenticate'
          },
          provider:       firebase.auth.FacebookAuthProvider.PROVIDER_ID
      },
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
      {
          requireDisplayName: false,
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
      },
      firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
  ],
  //term of service
  tosUrl: '<your-tos-link>',
  //privacy url
  privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
  //credentialHelper:             firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM
  credentialHelper: firebaseui.auth.CredentialHelper.NONE
};

firebase.initializeApp(environment.firebaseConfig);
@NgModule({
  declarations: [
    AppComponent,
    InputConverterComponent,
    LoginComponent,
    ProductionTaskListComponent,
    SideBarComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MonacoEditorModule.forRoot(),
    FormsModule,
    NgxJsonViewerModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    AgGridModule,
    HttpClientModule,
    SweetAlert2Module.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
