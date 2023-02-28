import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import Swal from 'sweetalert2';
import { NabysyFactureService } from 'src/app/nabysy-facture.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  public product:any=[];
  public grandTotal:number=0;
  public listePanier: any=[];
  public grandTotalFormat: any;

  searchText:string | any;
  constructor(private cartService: CartService, private nabysyService: NabysyFactureService) {
    this.getAllProduct();
   }

  ngOnInit(): void {
    this.getAllProduct();
  }

  getAllProduct(){
    this.cartService.getProducts()
    .subscribe(res=>{
      this.product=res;
      this.grandTotal=this.cartService.getTotalPrice();
      this.grandTotalFormat=this.formatToMillier(this.grandTotal);

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

  envoyerCommande(){
    if (this.listePanier.length==0){
      Swal.fire(
        'Panier Vide !',
        '',
        'warning'
      )
      return ;
    }

    this.nabysyService.envoiePanier(this.listePanier).subscribe(data=>{
      console.log(data);
      let Reponse=data;
      if (Reponse.OK>0){
        Swal.fire(
          'Envoie de la commande réussit !',
          'Votre Numero de Commande: '+Reponse.Extra,
          'success'
        );
        this.cartService.removeAllCart();
        //On ferme la page et on retourne vers WhatsApp ou bien ?
        window.close();
      }else{
        Swal.fire(
          'Commande non envoyée !',
          Reponse.TxErreur,
          'warning'
        )
      }
    })
  }

  formatToMillier(montant: number){
    return montant.toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g,'$1 ');
  }

}
