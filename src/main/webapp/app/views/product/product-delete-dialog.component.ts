import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { JhiEventManager } from 'ng-jhipster';



@Component({
  templateUrl: './product-delete-dialog.component.html'
})
export class ProductDeleteDialogComponent {
  product?: IProduct;

  constructor(protected productService: ProductService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.productService.delete(id).subscribe(() => {
      this.eventManager.broadcast('productListModification');
      this.activeModal.close();
    });
  }
}
