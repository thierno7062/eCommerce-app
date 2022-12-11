import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'angular-web-storage';

@Injectable({
  providedIn: 'root'
})
export class NabysyFactureService {

  public panier: any={};
  public panierKey: string = "panier" ;

  constructor(private http: HttpClient, private stockage: LocalStorageService) { 
    
   }

  ngOnInit():void{
    this.initialisePanier();
  }

  private  initialisePanier(){
    console.log(environment);
    
    if (environment.idClient==0 || environment.idClient==null){
      this.getMyIdClient();
    }

    this.panier.IdBoutique=0;
    this.panier.IdFacture=0;
    this.panier.IdClient=environment.idClient;
    this.panier.TOTALFACTURE=0;
    this.panier.ListeArticle=[];
    console.log("Initialisation Panier NAbySy: ");
    console.debug(JSON.stringify(this.panier));
  }

  /**
   * Convertit le panier de la Boutique au format Panier NabySy
   * @param listeArticlePanier 
   */
  convertToNabySyCart(listeArticlePanier: any){
    this.initialisePanier();
    listeArticlePanier.forEach((element: any) => {   
      if (element.qteAVendreDetail>0){
        let article: any={};
        article.Id =element.id;
        article.Qte =element.qteAVendreDetail;
        article.PrixU=element.prix;
        article.VENTEDETAILLEE=false;
        this.panier.ListeArticle.push(article);
      }

      if (element.qteAVendreGros>0){
        let article: any={};
        article.Id =element.id;
        article.Qte =element.qteAVendreGros;
        article.PrixU=element.prixvc;
        article.VENTEDETAILLEE=true;
        this.panier.ListeArticle.push(article);
      }
    });
    console.log("Panier convertit: "+this.panier);
    
    return this.panier ;
  }

  /**
   * Retourne le Id Client NAbySy précédemment enregistré
   */
  getMyIdClient(){
    console.log("Recherche de l'ID Client...");    
    const keyIdClient: string=this.panierKey+".IDCLIENT";
    environment.idClient=this.stockage.get(keyIdClient);
    console.log("ID-CLIENT = "+environment.idClient);
    
    return environment.idClient;
  }

  /**
   * Envoie le panier vers le serveur NAbySy distant
   * @param panierBoutique 
   */
  envoiePanier(panierBoutique: any): Observable<any>{
    this.convertToNabySyCart(panierBoutique);   
    const panierContenue=JSON.stringify(this.panier);
    let param="IDCLIENT="+environment.idClient+'&Contenue='+panierContenue;
    const baseUrl=environment.endPoint+'?Action=SAVE_PANIER_COMMANDE'+'&'+param;
    console.log('Envoie du panier: '+baseUrl);
    return this.http.get<any>(baseUrl);    
  }

  
}
