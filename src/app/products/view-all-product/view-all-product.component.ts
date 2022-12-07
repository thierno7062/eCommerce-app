import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { environment } from 'src/environments/environment';
import { Product } from '../product';
import { ProductService } from '../product.service';
import {ActivatedRoute} from '@angular/router';
import {LocalStorageService, LocalStorage } from 'angular-web-storage';

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
    this.route.queryParams.subscribe(params => {
      environment.idClient = params['IDCLT'];
      this.stockage.set("IDCLIENT",environment.idClient);
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
      this.listArticles=newListeArticles;
      //console.log(data);

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
  let venteGros=0;
  if (article.qteAVendreGros>0){
      venteGros=1;
      this.cartservice.addtoCart(article,article.qteAVendreGros,venteGros);
    }else{
      venteGros=0;
      this.cartservice.addtoCart(article,article.qteAVendreDetail,venteGros);
    }
 }

 /**
  * Permet la mise à jour d'une quantité au détail dans le panier
  * @param article
  * @param qte
  */
 updateQteDetail(article: any, qte: any){
  article.qteAVendreDetail= +qte ;
  console.log(article.nom+ ": "+ article.qteAVendreDetail+" X "+ article.prix);
  this.savePanierToStorage();
 }

 updateQteGros(article: any, qte: any){
  article.qteAVendreGros=+qte;
  console.log(article.nom+ ": "+ article.qteAVendreGros+" X "+ article.prixvc);
  this.savePanierToStorage();
}

  /**
   * Permet de sauvegarder le panier localement
   * @returns boolean
   */
  savePanierToStorage(){
    //Si le panier est vide on le sauvegardera pas
    if (this.cartservice.cartItemList.length == 0){
      console.log("Panier vide. pas de sauvegarde.");
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
    /*
    const keyContenuePanier: string=this.panierKey+".contenue";
    let panierSauv=this.stockage.get(keyContenuePanier);
    if (panierSauv){
      console.log("Panier disponible, restoration en cour ...");
      this.cartservice.cartItemList= panierSauv;
      if (this.cartservice.cartItemList.length>0){
        console.log("Panier restoré correctement: ");
      }
      return true ;
    }
    return false; */

  }

  clickMenu(){
    this.openMenu = !this.openMenu;
  }

  hello(mex: string){
      alert('Hello '+mex+'!' );
  }
}
