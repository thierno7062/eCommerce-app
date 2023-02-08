import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchDataService {

  searchOption: any = [];
  listeArticleBoutique: any ;
  listeSansFiltre: any;

  constructor() { }

  getPosts(): Observable<any>{
    return this.listeArticleBoutique;
    
  }

  filteredListOptions() {
    let liste = this.listeArticleBoutique;
        let filteredPostsList = [];
        for (let article of liste) {
            for (let options of this.searchOption) {
                if (options.nom === article.nom) {
                  filteredPostsList.push(article);
                }
            }
        }
        console.log(filteredPostsList);
        return filteredPostsList;
  }

}
