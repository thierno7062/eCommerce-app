import { NgModule, VERSION } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { UpdateProductComponent } from './update-product/update-product.component';
import { DeleteProductComponent } from './delete-product/delete-product.component';
import { ViewAllProductComponent } from './view-all-product/view-all-product.component';
import { ViewProductByDateComponent } from './view-product-by-date/view-product-by-date.component';
import { ViewProductByCategoryComponent } from './view-product-by-category/view-product-by-category.component';

import { LightgalleryModule } from 'lightgallery/angular';
import { LightgalleryComponent } from 'lightgallery/angular';
import lgZoom from 'lightgallery/plugins/zoom';
import { BeforeSlideDetail } from 'lightgallery/lg-events';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    ProductsComponent,
    AddProductComponent,
    ViewProductComponent,
    UpdateProductComponent,
    DeleteProductComponent,
    ViewAllProductComponent,
    ViewProductByDateComponent,
    ViewProductByCategoryComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule ,
    BrowserModule,
    LightgalleryModule,
  ]
})


export class ProductsModule {
  title = 'eCommerce-app';
  name = "Angular " + VERSION.full ;
  settings = {
    counter: false,
    plugins: [lgZoom]
  };
  onBeforeSlide = (detail: BeforeSlideDetail): void => {
    const { index, prevIndex } = detail;
    console.log(index, prevIndex);
  };

 }
