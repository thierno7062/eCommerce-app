import { Component, OnInit , ViewChild, ElementRef,EventEmitter,Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { SearchDataService } from '../search-data.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  myControl = new FormControl();
  filteredOptions: Observable<string[]> | any;
  listeArticle: any;
  autoCompleteList: any[] | undefined

  @ViewChild('autocompleteInput') autocompleteInput: ElementRef | any;
  @Output() onSelectedOption = new EventEmitter();
  @Output() onRechercheChange = new EventEmitter<string>();

  textRecherche: string='';
  
  constructor(
    public dataService: SearchDataService
  ) { }

  ngOnInit() {
    //this.dataService.getPosts().subscribe((articles: any) => {
      this.listeArticle = this.dataService.listeArticleBoutique ;

    //});

    this.myControl.valueChanges.subscribe(userInput => {
      this.autoCompleteExpenseList(userInput);
    })
  }

  private autoCompleteExpenseList(input: any) {
    let categoryList = this.filterCategoryList(input)
    this.autoCompleteList = categoryList;
  }

  filterCategoryList(val: any) {
    console.log(val);
    
    var categoryList = []
    if (typeof val != "string") {
      return [];
    }
    if (val === '' || val === null) {
      //return this.dataService.listeSansFiltre ;
      return [];
    }
    
    let resultat: any = this.dataService.listeArticleBoutique.filter((s: any) => s.nom.toLowerCase().indexOf(val.toLowerCase()) != -1);
    
    if (resultat.length == 0){
      console.log("Aucun resultat trouvé.");      
      return this.dataService.listeSansFiltre ;
    }
    console.log(resultat);
    return resultat ;
    
    return val ? this.dataService.listeArticleBoutique.filter((s: any) => s.nom.toLowerCase().indexOf(val.toLowerCase()) != -1)
      : this.listeArticle;
  }

  displayFn(post: any) {
    let k = post ? post.nom : post;
    return k;
  }

  filterPostList(event: any) {
    var posts= event.source.value;
    console.log(posts);    
        if(!posts) {
          this.dataService.searchOption=[]
        }
        else {
          console.log("not");
          this.dataService.searchOption.push(posts);
          this.onSelectedOption.emit(this.dataService.searchOption);
        }        
        this.focusOnPlaceInput();        
  }


  removeOption(option: any) {
        
    let index = this.dataService.searchOption.indexOf(option);
    if (index >= 0)
        this.dataService.searchOption.splice(index, 1);
        this.focusOnPlaceInput();

        this.onSelectedOption.emit(this.dataService.searchOption)
  }

  focusOnPlaceInput() {
    this.autocompleteInput.nativeElement.focus();
    this.autocompleteInput.nativeElement.value = '';
  }

  demandeRecherche(event: any){
    this.textRecherche=event.target.value;
    if (this.textRecherche !=''){
      console.log("Je dois rechercher "+this.textRecherche);
    }    
    this.onRechercheChange.emit(event.target.value);
  }

}
