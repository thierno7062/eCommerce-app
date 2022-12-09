import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from 'angular-web-storage';
import Swal from 'sweetalert2'

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
    
    if (qte<=0){
      return ;
    }
    //On va vérifier si l'article n'est pas dejà dans le panier
      let articleExistant=this.findArticle(product,false);
      if(articleExistant){
        if (venteGros>0){
          articleExistant.qteAVendreGros=qte ;          
        }else{
          articleExistant.qteAVendreDetail=qte;       
        }
        this.productList.next(this.cartItemList)
        this.getTotalPrice();
        console.log(this.getTotalPrice());
        this.savePanierToStorage();
        console.log(this.cartItemList);

        Swal.fire({
          // position: 'top-end', Masqué pour affiché le modal au mileu de la page
          icon: 'success',
          title: 'Article mit à jour dans le Panier',
          showConfirmButton: false,
          timer: 500
        })

      }else{
        //Nouvel article à ajouter au panier this.cartItemList
        if (venteGros>0){
          product.qteAVendreGros=qte ;          
        }else{
          product.qteAVendreDetail=qte;       
        }
        console.log('Nouvel article ajouté au panier.');        
        this.cartItemList.push(product);
        this.savePanierToStorage();
        this.getTotalPrice();        
        this.productList.next(this.cartItemList)
        Swal.fire({
          // position: 'top-end', Masqué pour affiché le modal au mileu de la page
          icon: 'success',
          title: 'Nouvel article ajouté au Panier',
          showConfirmButton: false,
          timer: 500
        })
      }

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
      let articleTrouve=this.findArticle(product,false);
      if(articleTrouve){
        if (isVenteG == false){
          console.log("Suppression de la Qté détail de "+articleTrouve.nom);
          articleTrouve.qteAVendreDetail=0;
        }else{
          //console.log(articleTrouve.qteAVendreDetail);
          console.log("Suppression de la Qté Gros de "+articleTrouve.nom);
          articleTrouve.qteAVendreGros=0;
        }
      }
    })

    let newListe: any=[];
    let result=this.cartItemList.map((article:any, index: any)=>{
      //On va enlever du panier les éments ayant au moins une quantité
      if (article.qteAVendreDetail>0 || article.qteAVendreGros>0){
        newListe.push(article);
      }
    })
        
    this.cartItemList=newListe;

    if (+this.cartItemList.length==0){
      this.removeAllCart();
    }
    this.savePanierToStorage();
    console.log('Reste dans le panier '+this.cartItemList.length+' élément(s).');
    this.productList.next(this.cartItemList);

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

  /**
   * Permet de restorer les quantités sauvegardées du panier dans la liste des articles affichées dans la boutique
   * 
   */
  restoreCartQteToArticleliste(listeArticle: any=null){
      if (!listeArticle){
        console.log("Liste vide, vous n'avez aucun article à vendre !!!");
        return;
      }
      if (listeArticle.length==0){
        console.log("La liste des articles de la boutique est vide");
        return;
      }
      console.log("Mise à jour des quantités précedemment saisie dans la panier sur la boutique...");

      const keyContenuePanier: string=this.panierKey+".contenue";
      let panierSauv=this.stockage.get(keyContenuePanier);
      if (panierSauv){
        panierSauv.forEach((artPanier: any) => {
          listeArticle.forEach((artB: any) => {
            if (artPanier.id==artB.id){          
                if (artPanier.qteAVendreGros>0){
                  artB.qteAVendreGros=artPanier.qteAVendreGros;
                }
                if (artPanier.qteAVendreDetail>0){
                  artB.qteAVendreDetail=artPanier.qteAVendreDetail;
                }
            }
          });
          
        });
      }
      console.log(this.cartItemList);      
      console.log("Mise à jour terminée.");
      this.productList.next(this.cartItemList);

  }

}
