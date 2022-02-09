import { HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { IShop } from "app/entities/shop/shop.model";
import { SupplierDashboardService } from "../dashboard/dashboard.service";


@Component({
  selector: 'jhi-register-product',
  templateUrl: './register-product.component.html',
  styleUrls: ['./register-product.component.scss']
})
export class RegisterProductComponent implements OnInit {

  shops: IShop[] = [];
  closeResult = '';


  constructor(protected supplierDashboardService: SupplierDashboardService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.supplierDashboardService
    .queryByUserAndActive()
    .subscribe(
      (res: HttpResponse<IShop[]>) => this.shops = res.body!,
      () => console.error('Load shops error')
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  open(content: any): void {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
}
