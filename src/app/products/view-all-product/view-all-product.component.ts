import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { environment } from 'src/environments/environment';
import { Product } from '../product';
import { ProductService } from '../product.service';
import {ActivatedRoute} from '@angular/router';
import {LocalStorageService, LocalStorage } from 'angular-web-storage';
import { NgImageSliderComponent } from 'ng-image-slider';

@Component({
  selector: 'app-view-all-product',
  templateUrl: './view-all-product.component.html',
  styleUrls: ['./view-all-product.component.css']
})
export class ViewAllProductComponent implements OnInit {
  productList: any;
  listArticles: any;
  @ViewChild('quantiteDetail') quantiteDetail:ElementRef | undefined;
  @ViewChild('quantiteGros') quantiteGros:ElementRef | undefined;

  public totalItem:number = 0;
  public panierKey: string = "panier" ;

  public openMenu: boolean = false;
  isOver = false;

  constructor(private productService: ProductService, private cartservice: CartService, private route: ActivatedRoute,
    private stockage: LocalStorageService) {
      const keyIdClient: string=this.panierKey+".IDCLIENT";
      console.log(this.stockage.get(keyIdClient));

      environment.idClient=this.stockage.get(keyIdClient);

      this.route.queryParams.subscribe(params => {
        if (params['IDCLT']){
          environment.idClient = params['IDCLT'];
          this.stockage.set(keyIdClient,environment.idClient);
        }
        this.restorePanierFromStorage();
        //console.log(environment.idClient);
      });
  }

  ngOnInit(): void {
  /*   this.productService.viewProduct().subscribe(data=>{
      this.productList=data;
      console.log(data);

    }) */
    this.restorePanierFromStorage();

    this.productService.viewProduct2().subscribe(data=>{
      let newListeArticles=new Array();
      data.forEach(function (article: any) {
        article['qteAVendreDetail']=0;
        article['qteAVendreGros']=0;
        article['TypeVente']=0;
        article['isVenteGros']=false;
        newListeArticles.push(article);

      });
      //console.log(newListeArticles);
      this.cartservice.restoreCartQteToArticleliste(newListeArticles);
      this.listArticles=newListeArticles;
    });

    this.cartservice.getProducts()
    .subscribe(res=>{
      //console.log(res);
      this.totalItem=res.length;
    })
  }

  /**
   *
   * @param item : Article à ajouter au panier
   * @param qte : Qté à Ajouter
   * @param venteGros : 1= Oui ; 0= Non
   */
  addToCart(article: any, venteGros: number){
    //console.log("QTE="+qte);
    let qte=0;
    if (qte==0){
      if (venteGros>0){
        qte=article.qteAVendreGros ;
      }else{
        qte=article.qteAVendreDetail;
      }
    }
    //console.log("Je dois ajouter "+qte+" de l'article "+article.nom+". VenteGros="+venteGros);
    this.cartservice.addtoCart(article,qte,venteGros);
    this.savePanierToStorage();

 }

 addArticleToCart(article: any){
      this.cartservice.addtoCart(article,article.qteAVendreGros,1);
      this.cartservice.addtoCart(article,article.qteAVendreDetail,0);
 }

 /**
  * Permet la mise à jour d'une quantité au détail dans le panier
  * @param article
  * @param qte
  */
 updateQteDetail(article: any, qte: any){
  article.qteAVendreDetail= +qte ;
  //console.log(article.nom+ ": "+ article.qteAVendreDetail+" X "+ article.prix);
  this.savePanierToStorage();
 }

 updateQteGros(article: any, qte: any){
  article.qteAVendreGros=+qte;
  //console.log(article.nom+ ": "+ article.qteAVendreGros+" X "+ article.prixvc);
  this.savePanierToStorage();
}

  /**
   * Permet de sauvegarder le panier localement
   * @returns boolean
   */
  savePanierToStorage(){
    //Si le panier est vide on le sauvegardera pas
    if (this.cartservice.cartItemList.length == 0){
      //console.log("Panier vide. pas de sauvegarde.");
      return false ;
    }
    const keyContenuePanier: string=this.panierKey+".contenue";
    // On efface le contenue du panier avant de sauvegarder tout le panier de nouveaus
    const precPanier=this.stockage.get(keyContenuePanier);
    // On efface le précédent panier
    this.stockage.remove(keyContenuePanier);
    const contenue=JSON.stringify(this.cartservice.cartItemList);
    //console.log(contenue);

    this.stockage.set(keyContenuePanier,this.cartservice.cartItemList) ;
    return true;

  }

  /**
   * Permet la restoration du panier
   * @returns boolean
   */
  restorePanierFromStorage(){
    //Si le panier n'existe pas en sauvegarde on a pas de restoration
    return this.cartservice.restorePanierFromStorage();

  }

  /**
   * Permet de restorer les quantités sauvegardées du panier dans la liste des articles affichées dans la boutique
   * @param listePdt
   */
  restoreCartQteToArticleliste(listePdt: any){

  }

  clickMenu(){
    this.openMenu = !this.openMenu;
  }

  hello(mex: string){
      alert('Hello '+mex+'!' );
  }

}
