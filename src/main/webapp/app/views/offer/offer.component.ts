import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTable } from "@angular/material/table";
import { UserType } from "app/entities/enumerations/user-type.model";
import { WorksheetType } from "app/entities/enumerations/worksheet-type.model";
import { IEvent } from "app/entities/event/event.model";
import { IProduct } from "app/entities/product/product.model";
import { IUser } from "app/entities/user/user.model";
import { WorksheetService } from "app/entities/worksheet/service/worksheet.service";
import { IWorksheet, Worksheet } from "app/entities/worksheet/worksheet.model";
import { EditRowBoxComponent } from "./editrow-box.component";


@Component({
  selector: 'jhi-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss']
})
export class OfferComponent implements OnInit {
  displayedColumns: string[] = ['description', 'start', 'end', 'costHour', 'total', 'action'];

  @Input() worksheets!: IWorksheet[];
  @Input() userType!: UserType;
  @Input() event!: IEvent;
  @Input() product!: IProduct;
  @Input() user!: IUser;
  @Input() billingType!: WorksheetType;

  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

  constructor(public dialog: MatDialog, private worksheetService: WorksheetService) {}

  ngOnInit(): void {
    if (this.worksheets === null) {
      this.worksheets = [];
    }
  }

  openDialog(action: any, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(EditRowBoxComponent, {
      width: '450px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event === 'Add') {
        this.addRowData(result.data);
      } else if (result.event === 'Update') {
        this.updateRowData(result.data);
      } else if (result.event === 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }

  addRowData(rowObj: IWorksheet): void {
    const worksheet: IWorksheet = new Worksheet();
    worksheet.description = rowObj.description;
    worksheet.start = rowObj.start;
    worksheet.end = rowObj.end;
    worksheet.costHour = rowObj.costHour;
    worksheet.total = rowObj.total;
    worksheet.userType = this.userType;
    worksheet.billingType = this.billingType;
    worksheet.user = this.user;
    worksheet.event = this.event;
    worksheet.product = this.product;

    this.worksheetService.create(worksheet).subscribe();
    this.worksheets.push({
      description: rowObj.description,
      start: rowObj.start,
      end: rowObj.end,
      costHour: rowObj.costHour,
      total: rowObj.total
    });
    this.table.renderRows();
  }

  updateRowData(rowObj: IWorksheet): void {
    this.worksheets = this.worksheets.filter(value => {
      if (value.id === rowObj.id) {
        this.worksheetService.find(rowObj.id!).subscribe(res => {
          const worksheet = res.body!;
          worksheet.description = rowObj.description;
          worksheet.start = rowObj.start;
          worksheet.end = rowObj.end;
          worksheet.costHour = rowObj.costHour;
          worksheet.total = rowObj.total;
          this.worksheetService.update(worksheet).subscribe();

          value.description = rowObj.description;
          value.start = rowObj.start;
          value.end = rowObj.end;
          value.costHour = rowObj.costHour;
          value.total = rowObj.total;
        });
      }
      return true;
    });
  }

  deleteRowData(rowObj: IWorksheet): void {
    this.worksheetService.delete(rowObj.id!).subscribe();
    this.worksheets = this.worksheets.filter(value => {
      return value.id !== rowObj.id;
    });
  }

  getTotalCost(): number {
    let sum = 0;
    this.worksheets.forEach(sheet => {
      sum += sheet.total!;
    });
    return sum;
  }
}
