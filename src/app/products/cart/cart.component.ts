import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  public product:any=[];
  public grandTotal:number=0;
  public listePanier: any=[];
  searchText:string | any;
  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.getProducts()
    .subscribe(res=>{
      this.product=res;
      this.grandTotal=this.cartService.getTotalPrice();

      //Convertir le contenue du Panier pour séparer les qtés en gros et les détails à part
      let vListe=new Array;

      res.forEach(function (art: any){
          const qteGros=art.qteAVendreGros;
          const qteDetail=art.qteAVendreDetail ;
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
            let vArticle=Object.assign({},art) ;

            if (qteDetail>0){
              vArticle.qteAVendreDetail=qteDetail ;
              vArticle.qteAVendreGros=0;
              vArticle.isVenteGros=false ;
              vListe.push(vArticle);
            }
            if (qteGros>0){
              vArticle.qteAVendreGros=qteGros;
              vArticle.qteAVendreDetail=0;
              vArticle.isVenteGros=true ;
              vListe.push(vArticle);
            }

          }

        }
      );
      this.listePanier=vListe;
      if (this.listePanier.length==0){
        //this.cartService.cartItemList=[];
      }
      //console.log(this.listePanier);


    })
  }

  removeItem(item: any, isVenteG: any){
    let venteG=false;
    let TxC="au détail";
    //console.log(isVenteG);

    if (isVenteG>0 || isVenteG==true){
      venteG=true;
      TxC="en gros";
    }
    /* if(confirm("Confirmez-vous la suppression de "+item.nom+" vendu "+TxC+" du panier ?")){

      this.cartService.removeCartItem(item,venteG);
    } */
    //alert("Ligne d'article correctement supprimée.")
    Swal.fire({
      title: 'Supprimer '+ item.nom+' ['+TxC+'] ?',
      text: "Confirmez-vous la suppression ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, Supprimer ce Produit!',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.removeCartItem(item,venteG);
        Swal.fire(
          'Article supprimé du panier !',
          item.nom+' ['+TxC+'] a été supprimé correctement.',
          'success'
        )
      }
    })
  }

  emptyCart(){
    this.cartService.removeAllCart();
  }

}
