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
   * Permet de retrouver un article dans le panier
   * @param article : Article recherchée
   * @param boolean rechercheEtendue : Si oui la recherche vérifiera le type de vente en gros ou au détail
   * @param boolean rechercheVenteGros : Oui pour rechercher un article vendu en gros
   */
  findArticle(article: any,rechercheEtendue: boolean=false, rechercheVenteGros: boolean=true):any{
    let articleTrouve=null;
    if (this.cartItemList){      
      this.cartItemList.forEach(function(art: any){
        if (art.id==article.id){
          if (rechercheEtendue){
            if (rechercheVenteGros){                       
              if (art.qteAVendreGros !== 0){
                console.log('Article trouvé en gros: '+art.nom); 
                articleTrouve=art;
                return art;
              }
            }else{
              if (art.qteAVendreDetail !== 0){
                console.log('Article trouvé au détail: '+art.nom); 
                articleTrouve=art;
                return art;
              }
            }
          }
          else{
            articleTrouve=art;
            return art;
          }          
        }
      })
    }
    return articleTrouve;
  }
  /**
   * 
   * @param product : Article à ajouter au panier
   * @param qte : Qté à Ajouter
   * @param venteGros : 1= Oui ; 0= Non
   */
  addtoCart(product: any, qte: number,venteGros: number){
    //On va vérifier si l'article n'est pas dejà dans le panier
    if (qte<=0){
      return ;
    }
      let articleExistant=this.findArticle(product);

      if (venteGros>0){
        product.qteAVendreGros=qte ;
        if (articleExistant){
          product.qteAVendreDetail=articleExistant.qteAVendreDetail;          
        }
      }else{
        product.qteAVendreDetail=qte;
        if (articleExistant){
          product.qteAVendreGros=articleExistant.qteAVendreGros ;
        }
      }
    
      if (articleExistant){
        console.log(articleExistant);
        this.removeCartItem(articleExistant);
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

  removeCartItem(product: any, isVenteG: boolean=false){
    this.cartItemList.map((a:any, index: any)=>{
      let articleTrouve=this.findArticle(product,true,isVenteG);

      if(articleTrouve){
        if (!isVenteG){
          console.log("Suppression de la Qté détail de "+articleTrouve.nom);          
          articleTrouve.qteAVendreDetail=0;
        }else{
          console.log("Suppression de la Qté Gros de "+articleTrouve.nom);
          articleTrouve.qteAVendreGros=0;
        }
        if (articleTrouve.qteAVendreDetail==0 && articleTrouve.qteAVendreGros==0){        
          console.log("Suppression de "+articleTrouve.nom+" du panier.");
          this.cartItemList.splice(index, 1);
          this.productList.next(this.cartItemList);    
        } 
        
      }
      
      if (articleTrouve){
        this.productList.next(this.cartItemList);    
        //console.log(this.cartItemList);    
      }

    })
    
  }

  removeAllCart(){
    this.cartItemList=[]
    this.productList.next(this.cartItemList);
  }
}
