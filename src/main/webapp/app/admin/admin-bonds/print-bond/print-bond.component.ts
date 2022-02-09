import { IBond } from './../../../entities/bond/bond.model';
import { BondService } from './../../../entities/bond/service/bond.service';
import { Component, OnInit } from '@angular/core';
import jspdf from 'jspdf';
import * as html2canvas from 'html2canvas';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'jhi-print-bond',
  templateUrl: './print-bond.component.html',
  styleUrls: ['./print-bond.component.scss']
})
export class PrintBondComponent implements OnInit {

  bondId: number;
  bond: IBond;

  constructor(private route: ActivatedRoute, private bondService: BondService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.bondId = params['bondId'];
      this.bondService.find(this.bondId).subscribe(b => {
        this.bond = b.body;
      });
    });
  }

  generatePDF(): void {
    const data = document.getElementById('bond');
    html2canvas(data!).then((canvas: any) => {
      const imgWidth = 297;
      const imgHeight = 210;
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('l', 'mm', 'a4');
      pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('point-bond.pdf');
    });
  }

  previousState(): void {
    window.history.back();
  }

}
