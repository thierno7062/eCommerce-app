import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http'
import { OdersModule } from './oders/oders.module';
import { ProductsModule } from './products/products.module';
import { SiteLayoutModule } from './site-layout/site-layout.module';
import { AngularWebStorageModule } from 'angular-web-storage';
// import { NgImageSliderModule } from 'ng-image-slider';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OdersModule,
    HttpClientModule,
    SiteLayoutModule,
    ProductsModule,
    AngularWebStorageModule,
    // NgImageSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
