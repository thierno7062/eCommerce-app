import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('quantiteDetail') quantiteDetail:ElementRef | undefined; 
  @ViewChild('quantiteGros') quantiteGros:ElementRef | undefined;
  
  public totalItem:number = 0;

  constructor(private productService: ProductService, private cartservice: CartService) { }

  ngOnInit(): void {
  /*   this.productService.viewProduct().subscribe(data=>{
      this.productList=data;
      console.log(data);

    }) */
    this.productService.viewProduct2().subscribe(data=>{
      let newListeArticles=new Array();      
      data.forEach(function (article: any) {
        article['qteAVendreDetail']=0;
        article['qteAVendreGros']=0;
        article['TypeVente']=0;
        article['isVenteGros']=false;
        newListeArticles.push(article);
        
      });
      console.log(newListeArticles);
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

 }

 updateQteDetail(article: any, qte: any){
  article.qteAVendreDetail= +qte ;
  console.log(article.nom+ ": "+ article.qteAVendreDetail+" X "+ article.prix);
  
 }

 updateQteGros(article: any, qte: any){
  article.qteAVendreGros=+qte;
  console.log(article.nom+ ": "+ article.qteAVendreGros+" X "+ article.prixvc);
}

}
