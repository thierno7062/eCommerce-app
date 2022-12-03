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
  public listePanier: any=[];

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.getProducts()
    .subscribe(res=>{      
      this.product=res;
      this.grandTotal=this.cartService.getTotalPrice();

      //Convertir le contenue du Panier pour séparer les qtés en gros et les détails à part
      let vListe=new Array;      
      
      res.forEach(function (art: any){
          let qteGros=art.qteAVendreGros;
          let qteDetail=art.qteAVendreDetail ;
          if (qteDetail > 0 && qteGros>0){
            if (qteDetail !== 0){
              let vArticle=Object.assign({},art) ;
              vArticle.qteAVendreDetail=qteDetail ;
              vArticle.qteAVendreGros=0;    
              vArticle.isVenteGros=false ;   
              vListe.push(vArticle);
            }
            if (qteGros !== 0){
              let vArticle2=Object.assign({},art) ;
              vArticle2.qteAVendreGros=qteGros ;
              vArticle2.qteAVendreDetail=0;
              vArticle2.isVenteGros=true ; 
              vListe.push(vArticle2);
            }
          }else{
            vListe.push(art) ;
          }
          
        }
      );
      this.listePanier=vListe;
      //console.log(this.listePanier);
      

    })
  }

  removeItem(item: any, isVenteG: boolean = false){
    if(confirm("Confirmez-vous la suppression de l'article du panier ?")){
      this.cartService.removeCartItem(item,isVenteG);
    }    
    //alert("Ligne d'article correctement supprimée.")
  }

  emptyCart(){
    this.cartService.removeAllCart();
  }

}
