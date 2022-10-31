import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../site-layout/category';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpclient: HttpClient) { }

  createProduct(productBody: any):Observable<Product>{
    const baseUrl='http://localhost:3000/products';
    return this.httpclient.post<Product>(baseUrl,productBody);
  }

  viewProduct():Observable<Product>{
    const baseUrl='http://localhost:3000/products';
    return this.httpclient.get<Product>(baseUrl);
  }

  updateProduct(productID: any,productBody: any):Observable<Product>{
    const baseUrl='http://localhost:3000/products'+productID;
    return this.httpclient.put<Product>(baseUrl,productBody);
  }

  deleteProduct(productID: any):Observable<Product>{
    const baseUrl='http://localhost:3000/products'+productID;
    return this.httpclient.get<Product>(baseUrl);
  }

  searchCategorieProduct(categorieID: any):Observable<Product>{
    const baseUrl='http://localhost:3000/products'+categorieID;
    return this.httpclient.get<Product>(baseUrl);
  }

  searchDateProduct(dateParam: any):Observable<Product>{
    const baseUrl='http://localhost:3000/products'+dateParam;
    return this.httpclient.delete<Product>(baseUrl);
  }

  getCategory(){
    const categoryUrl='http://localhost:3000/categories';
    return this.httpclient.get<Category>(categoryUrl);
  }

}
