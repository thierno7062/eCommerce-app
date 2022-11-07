import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/site-layout/category';
import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-view-product-by-category',
  templateUrl: './view-product-by-category.component.html',
  styleUrls: ['./view-product-by-category.component.css']
})
export class ViewProductByCategoryComponent implements OnInit {
  searchCategory: any;
  productList: any;

  constructor(private productService: ProductService,private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
   this.activatedRoute.queryParams.subscribe(data=>{
    this.searchCategory= data['id'];
    console.log(data);

    this.productService.searchCategorieProduct(this.searchCategory).subscribe(categoryData=>{
      console.log(categoryData);

      this.searchCategory=categoryData;
    })
   })
  }

}
