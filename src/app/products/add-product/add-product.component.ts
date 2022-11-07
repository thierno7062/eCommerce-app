import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
  }

  addNewProduct(form: any){
    console.log(form.value);

    let newProduct = {
      id:112,
      categoryId: form.value.product_category,
      categoryName: form.value.product_category,
      description: form.value.product_description,
      rating: form.value.product_rating,
      price: form.value.product_price,
      productImg: '',
      isAvailable: 1,
      color: form.value.product_color,
      reviews: form.value.product_reviews,
    };
    console.log(newProduct);
    this.productService.createProduct(newProduct).subscribe(data=>{
      console.log(data);

    })

  }
}
