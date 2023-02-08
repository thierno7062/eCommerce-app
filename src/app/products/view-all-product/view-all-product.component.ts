import { Component, ElementRef, OnInit, ViewChild, HostListener, Input} from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { environment } from 'src/environments/environment';
import { ProductService } from '../product.service';
import {ActivatedRoute} from '@angular/router';
import {LocalStorageService } from 'angular-web-storage';

import { ModalServiceService } from 'src/app/services/modal-service.service';

import { SearchDataService } from 'src/app/recherche/search-data.service';



@Component({
  selector: 'app-view-all-product',
  templateUrl: './view-all-product.component.html',
  styleUrls: ['./view-all-product.component.css']
})


export class ViewAllProductComponent implements OnInit {
  productList: any;
  listArticles: any[]=[];
  @ViewChild('quantiteDetail') quantiteDetail:ElementRef | undefined;
  @ViewChild('quantiteGros') quantiteGros:ElementRef | undefined;

  @Input() TexteRecherche = '';

  public totalItem:number = 0;
  public panierKey: string = "panier" ;

  public openMenu: boolean = false;
  isOver = false;

  responsiveOptions: any;

  posSuivante: number = 1 ;
  nbLignePage: number = 20 ;
  chargementEncour: boolean = false;
  lastPosY: number=0;

  
  constructor(private productService: ProductService, private cartservice: CartService, private route: ActivatedRoute,
    private stockage: LocalStorageService, protected modalService: ModalServiceService, private dataService: SearchDataService) {
      const keyIdClient: string=this.panierKey+".IDCLIENT";
      console.log(this.stockage.get(keyIdClient));

      environment.idClient=this.stockage.get(keyIdClient);

      this.chargementEncour=true;
      this.route.queryParams.subscribe(params => {
        if (params['IDCLT']){
          environment.idClient = params['IDCLT'];
          this.stockage.set(keyIdClient,environment.idClient);
        }
        this.restorePanierFromStorage();
        this.chargementEncour=false;
      });

      this.responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
      ];
  }

  ngOnInit(): void {
  /*   this.productService.viewProduct().subscribe(data=>{
      this.productList=data;
      console.log(data);

    }) */
    this.restorePanierFromStorage();

    let newListeArticles=new Array();

    this.productService.viewProduct2(this.posSuivante,this.nbLignePage).subscribe(data=>{
      this.chargementEncour=true;
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
      this.chargementEncour=false;
      this.dataService.listeArticleBoutique = this.listArticles;
      this.dataService.listeSansFiltre=this.listArticles ;

    });

    this.cartservice.getProducts()
    .subscribe(res=>{
      //console.log(res);
      this.totalItem=res.length;
    })
  }

  chargeListeArticle(){
    let newListeArticles=new Array();
    this.chargementEncour=true;
    this.productService.viewProduct2(this.posSuivante,this.nbLignePage).subscribe(data=>{      
      data.forEach(function (article: any) {
        article['qteAVendreDetail']=0;
        article['qteAVendreGros']=0;
        article['TypeVente']=0;
        article['isVenteGros']=false;
        newListeArticles.push(article);        
      });
      this.cartservice.restoreCartQteToArticleliste(newListeArticles);
      let listeA=this.listArticles ;
      newListeArticles.forEach(function(article: any) {
        listeA.push(article);       
      });
      //console.log(this.listArticles);
      this.chargementEncour=false; 
      this.dataService.listeArticleBoutique = listeA ;
      this.dataService.listeSansFiltre=listeA ;

    });
  }

  ngAfterContentChecked():void{
    if ( this.lastPosY != document.body.offsetHeight ){
      //console.log("PosY: "+this+this.lastPosY);    
      //console.log("La prochaine position sera : "+document.body.offsetHeight);    
      this.lastPosY=document.body.offsetHeight ;
    }   
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

  ShowArticle(art: any){
    //Ouvre le modal contenant la gallerie
    console.log('Je vais ouvrir la gallerie pour '+art.nom);
    this.modalService.open(art.id)
    console.log("IdArt="+art.id);

  }

  @HostListener("window:scroll", [])
  onScroll(): void {
    if (this.bottomReached()) {
      this.posSuivante +=this.nbLignePage;
      //On appele l'api pour charger la suite
      console.log("Chargement de la suite numero..."+this.posSuivante);
      this.chargeListeArticle();
      //this.elements = [...this.elements, this.count++];
    }
  }

  bottomReached(): boolean {
    if (this.lastPosY==0){
      this.lastPosY=document.body.offsetHeight ;
    }
    if (this.chargementEncour){
      console.log("Un précédement chargement est en cour...");      
      return false;
    }
    //return (window.innerHeight + window.scrollY) >= (document.body.offsetHeight);
    if (((window.innerHeight+window.scrollY)+1700) >= (this.lastPosY)){
      return true;
    }else{
      return false;
    }
    
  }

  formatToMillier(montant: number){
    return montant.toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g,'$1 ');
  }

  onSelectedOption(e: any) {
    console.log("recherche e cour...");
    this.getFilteredExpenseList();
  }

  onRechercheChange(txRech: any){
    if (txRech==''){
      //On reinitialise l'affichage
      this.listArticles=this.dataService.listeSansFiltre ;
      return ;
    }
    //console.log("On va recherche ici..."+ txRech);
    let newListe=[];
    
    let origineList: Array<any>=this.dataService.listeSansFiltre ;

    newListe=origineList.filter( 
      function (article: any){
        let xNom=article.nom.toLowerCase();
       if (article.nom.toLowerCase().indexOf(txRech)>=0){
          return true;
       }else{
        return false;
       }
      }
    ) ;

    console.log(newListe);    
    this.listArticles=newListe ;

  }

  

  getFilteredExpenseList() {
    if (this.dataService.searchOption.length > 0){
      console.log("On a des options de recherche e cour...");
      this.listArticles = this.dataService.filteredListOptions();
    }      
    else {
      console.log("Aucune option de Recherche choisit.");      
      this.listArticles = this.dataService.listeSansFiltre;
    }
    console.log(this.listArticles)
  }



}
