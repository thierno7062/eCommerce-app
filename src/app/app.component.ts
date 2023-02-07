import { Component } from '@angular/core';
import { SearchDataService } from './recherche/search-data.service';

providers: [SearchDataService];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'eCommerce-app';
}
