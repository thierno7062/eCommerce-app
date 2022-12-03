import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cartItemList:any=[]
  public productList = new BehaviorSubject<any>([])

  constructor() { }

  getProducts(){
    return this.productList.asObservable();
  }
  setProduct(product: any){
    this.cartItemList.push(...product);
    this.productList.next(product);
  }

  /**
   * 
   * @param product : Article à ajouter au panier
   * @param qte : Qté à Ajouter
   * @param venteGros : 1= Oui ; 0= Non
   */
  addtoCart(product: any, qte: number,venteGros: number){

      if (venteGros>0){
        product.qteAVendreGros=qte ;
      }else{
        product.qteAVendreDetail=qte;
      }
    
    this.cartItemList.push(product);
    this.productList.next(this.cartItemList)
    this.getTotalPrice();
    console.log(this.getTotalPrice());
    
    console.log(this.cartItemList);

  }

  getTotalPrice(){
    let grandTotal=0;
    this.cartItemList.map((a: any)=>{
      //console.log(a);
      if (a.qteAVendreDetail !==0){
        let TotalPdtDetail=a.prix*a.qteAVendreDetail;      
        grandTotal +=TotalPdtDetail;
      }
      if (a.qteAVendreGros !==0){
        let TotalPdtGros=a.prixvc*a.qteAVendreGros;      
        grandTotal +=TotalPdtGros;
      }
      
    })
    return grandTotal
  }

  removeCartItem(product: any){
    this.cartItemList.map((a:any, index: any)=>{
      if(product.id==a.id)
      this.cartItemList.splice(index, 1)
    })
    this.productList.next(this.cartItemList);
  }

  removeAllCart(){
    this.cartItemList=[]
    this.productList.next(this.cartItemList);
  }
}
