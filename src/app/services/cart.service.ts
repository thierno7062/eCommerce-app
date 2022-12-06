import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from 'angular-web-storage';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cartItemList:any=[]
  public productList = new BehaviorSubject<any>([])
  public panierKey: string="panier";

  constructor(private stockage: LocalStorageService) { }

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
    this.savePanierToStorage();
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
    this.cartItemList.map((article:any, index: any)=>{
      let articleTrouve=this.findArticle(product,false,isVenteG);

      if(articleTrouve){
        if (isVenteG == false){
          console.log("Suppression de la Qté détail de "+articleTrouve.nom);          
          articleTrouve.qteAVendreDetail=0;
        }else{
          console.log(articleTrouve.qteAVendreDetail);
          
          console.log("Suppression de la Qté Gros de "+articleTrouve.nom);
          articleTrouve.qteAVendreGros=0;
        }
        
        if (articleTrouve.qteAVendreDetail==0 && articleTrouve.qteAVendreGros==0){        
          console.log("Suppression de "+articleTrouve.nom+" du panier.");
          this.cartItemList.splice(index, 1);
          //this.productList.next(this.cartItemList);    
        } 
        //console.log(this.cartItemList);
        if (this.cartItemList.length==0){
          this.removeAllCart();
          this.productList.next(this.cartItemList);
        }else{
          this.savePanierToStorage();
          this.productList.next(this.cartItemList);
        }
      }else{
        console.log("Impossible de trouver l'article dans le panier.");        
        //console.log(product);
        
      }
      
      

    })
    
  }

  removeAllCart(){
    this.cartItemList=[];
    const keyContenuePanier: string=this.panierKey+".contenue";
    this.stockage.remove(keyContenuePanier);
    this.productList.next(this.cartItemList);
  }

   /**
   * Permet de sauvegarder le panier localement
   * @returns boolean
   */
    savePanierToStorage(){
      //Si le panier est vide on le sauvegardera pas    
      if (this.cartItemList.length == 0){
        console.log("Panier vide. pas de sauvegarde.");
        return false ;
      }
      const keyContenuePanier: string=this.panierKey+".contenue";
      // On efface le contenue du panier avant de sauvegarder tout le panier de nouveaus
      const precPanier=this.stockage.get(keyContenuePanier);
      // On efface le précédent panier
      this.stockage.remove(keyContenuePanier);
      const contenue=JSON.stringify(this.cartItemList);
      //console.log(contenue);
      
      this.stockage.set(keyContenuePanier,this.cartItemList) ;
      return true;
  
    }
  
    /**
     * Permet la restoration du panier
     * @returns boolean
     */
    restorePanierFromStorage(){
      //Si le panier n'existe pas en sauvegarde on a pas de restoration
      const keyContenuePanier: string=this.panierKey+".contenue";
      let panierSauv=this.stockage.get(keyContenuePanier);
      if (panierSauv){
        console.log("Panier disponible, restoration en cour ...");
        this.cartItemList= panierSauv;
        if (this.cartItemList.length>0){
          this.productList.next(this.cartItemList);
          console.log("Panier restoré correctement: ");
          //console.log(this.cartItemList);
          
        }    
        return true ;
      }
      return false;
  
    }

}
