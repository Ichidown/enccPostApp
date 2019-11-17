import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AppComponent } from './app.component';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import {PostListService} from './Services/post_list.service';
import {TypeListService} from './Services/type_list.service';
import {AdminPListService} from './Services/admin-p-list.service';
import {ConverterService} from './Services/converter.service';
import {DownloaderService} from './Services/downloader.service';
import {ErrorIdentifierService} from './Services/error-identifier.service';
import {FiltererService} from './Services/filterer.service';

import {LoginGuardService} from './Guards/login_guard';

import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { LoginComponent } from './components/login/login.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { AdminTypesComponent } from 'src/app/components/admin-types/admin-types.component';

import { ImageUploadModule } from 'ng2-imageupload';
import { AdminTypeListService } from './Services/admin_type_list.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';


// defining app routing
const appRoutes: Routes = [
  {path: '', component: PostListComponent},
  {path: 'login', component: LoginComponent},
  {path: 'admin', component: NavBarComponent, canActivate: [LoginGuardService], children: [
    {path: '', component: AdminHomeComponent, outlet: 'adminRouter'},
    {path: 'types', component: AdminTypesComponent, outlet: 'adminRouter'}
  ]},
  {path: '**', component: PostListComponent}, // Fallback route : if path not found redirect to here (should be last)
  ];

@NgModule({
  declarations: [
    AppComponent,
    AdminHomeComponent,
    LoginComponent,
    PostListComponent,
    NavBarComponent,
    AdminTypesComponent
  ],
  imports: [
    BrowserModule,
    MDBBootstrapModule.forRoot(),
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    ImageUploadModule
  ],
  schemas: [NO_ERRORS_SCHEMA], // to avoid errors based on unknown errors from MDBootstrap
  providers: [
    PostListService,
    TypeListService,
    AdminPListService,
    LoginGuardService,
    ConverterService,
    DownloaderService,
    ErrorIdentifierService,
    FiltererService,
    AdminTypeListService,
    {provide: LocationStrategy, useClass: HashLocationStrategy} // to avoid routin problems when deploying
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
