import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../site-layout/category';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpclient: HttpClient,private http: HttpClient) { }

  createProduct(productBody: any):Observable<Product>{
    const baseUrl='http://localhost:3000/product';
    return this.httpclient.post<Product>(baseUrl,productBody);
  }

  viewOneProduct(Id: any):Observable<Product>{
    const baseUrl='http://localhost:3000/products/'+Id;
    return this.httpclient.get<Product>(baseUrl);
  }
  viewProduct():Observable<Product>{
    const baseUrl='http://localhost:3000/products/';
    return this.httpclient.get<Product>(baseUrl);
  }
  viewProduct2(){
    const baseUrl=environment.endPoint+'?Action=GET_LISTE_PRODUIT_WHATSAPP&IDCATEGORIE=1&IDCLIENT='+environment.idClient;
    return this.http.get<any>(baseUrl);
  }

  updateProduct(productId: any,productBody: any):Observable<Product>{
    const baseUrl='http://localhost:3000/product'+productId;
    return this.httpclient.put<Product>(baseUrl,productBody);
  }

  deleteProduct(productId: any):Observable<Product>{
    const baseUrl='http://localhost:3000/product'+productId;
    return this.httpclient.get<Product>(baseUrl);
  }

  searchCategorieProduct(categoryId: any):Observable<Product>{
    const baseUrl='http://localhost:3000/products?categoryId='+categoryId;
    console.log(baseUrl);

    return this.httpclient.get<Product>(baseUrl);
  }

  searchDateProduct(dateParam: any):Observable<Product>{
    const baseUrl='http://localhost:3000/product/date='+dateParam;
    return this.httpclient.delete<Product>(baseUrl);
  }

  getCategory(){
    const categoryUrl='http://localhost:3000/categories';
    return this.httpclient.get<Category>(categoryUrl);
  }

}
