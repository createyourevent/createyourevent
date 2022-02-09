import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IProduct } from 'app/entities/product/product.model';

@Component({
  selector: 'jhi-product-list',
  templateUrl: './productList.component.html',
  styleUrls: ['./productList.component.scss']
})
export class ProductListComponent implements OnInit {

  @Input() products: IProduct[] = [];


  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToProduct(productId: number): void {
    this.router.navigate(['/products/' + productId + '/view']);
  }

}
