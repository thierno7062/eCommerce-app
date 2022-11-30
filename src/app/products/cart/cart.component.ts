import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  public product:any=[];
  public grandTotal:number=0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.getProducts()
    .subscribe(res=>{
      this.product=res;
      this.grandTotal=this.cartService.getTotalPrice();
    })
  }

  removeItem(item: any){
    if(confirm('Are you sure to delete?'))
    this.cartService.removeCartItem(item);
    alert("item deleted successfully")
  }

  emptyCart(){
    this.cartService.removeAllCart();
  }

}
