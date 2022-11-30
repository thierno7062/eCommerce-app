import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { environment } from 'src/environments/environment';
import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-view-all-product',
  templateUrl: './view-all-product.component.html',
  styleUrls: ['./view-all-product.component.css']
})
export class ViewAllProductComponent implements OnInit {
  productList: any;
  listArticles: any;

  public totalItem:number = 0;

  constructor(private productService: ProductService, private cartservice: CartService) { }

  ngOnInit(): void {
  /*   this.productService.viewProduct().subscribe(data=>{
      this.productList=data;
      console.log(data);

    }) */
    this.productService.viewProduct2().subscribe(data=>{
      this.listArticles=data;
      console.log(data);

    });
    this.cartservice.getProducts()
    .subscribe(res=>{
      this.totalItem=res.length;
    })
  }

  addToCart(item: any){
    this.cartservice.addtoCart(item);

 }

}
