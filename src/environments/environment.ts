// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // endPoint:'http://technopharm.homeip.net/nabysygsapi/gs_api.php',
  endPoint:'https://technopharm.homeip.net:8081/app/web/nabysy/whatsappAPI.php',
  idClient:0,

  /* getProducts(){
    this.readAPI(environment.endPoint+'Action=GET_LISTE_PRODUIT_WHATSAPP&IDCATEGORIE=1')
    .subscribe((Listes) =>{
      // console.log(Listes);
      this.listeProducts=Listes ;
      console.log(this.listeProducts);
    });
  }
  readAPI(url: string){
    console.log(url);
    return this.http.get(url);
  } */
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
