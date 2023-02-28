import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http'
import { OdersModule } from './oders/oders.module';
import { ProductsModule } from './products/products.module';
import { SiteLayoutModule } from './site-layout/site-layout.module';
import { AngularWebStorageModule } from 'angular-web-storage';

import { ViewAllProductComponent } from './products/view-all-product/view-all-product.component';
import { SwiperModule } from 'swiper/angular';
import {CarouselModule} from 'primeng/carousel';
import {ButtonModule} from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import { ReactiveFormsModule } from '@angular/forms';
import { GallerieModalComponent } from './galleries/gallerie-modal/gallerie-modal.component';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import { SearchBarComponent } from 'src/app/recherche/search-bar/search-bar.component';
import { SearchDataService } from 'src/app/recherche/search-data.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatGridListModule} from '@angular/material/grid-list';




// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    ViewAllProductComponent,
    GallerieModalComponent,
    SearchBarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    OdersModule,
    HttpClientModule,
    SiteLayoutModule,
    ProductsModule,
    AngularWebStorageModule,
    SwiperModule,
    CarouselModule,
    ButtonModule,
    ToastModule,
    ReactiveFormsModule,

    MatIconModule, MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    MatGridListModule

  ],
  providers: [SearchDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
