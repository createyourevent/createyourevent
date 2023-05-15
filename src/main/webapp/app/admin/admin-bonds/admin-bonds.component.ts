import { GeneralService } from 'app/general.service';
import { IBond, Bond } from './../../entities/bond/bond.model';
import { BondService } from './../../entities/bond/service/bond.service';
import { Component, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-admin-bonds',
  templateUrl: './admin-bonds.component.html',
  styleUrls: ['./admin-bonds.component.scss'],
})
export class AdminBondsComponent implements OnInit {
  // Add bond vars
  name: string;
  description: string;
  points: number;
  code: string;

  valide = true;

  generated: string[] = [];
  possible: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  //Overview bonds vars
  bonds: IBond[];

  constructor(private bondService: BondService, protected router: Router, private generalService: GeneralService) {}

  ngOnInit(): void {
    this.bondService.query().subscribe(bonds => {
      this.bonds = bonds.body;
    });
  }

  generateBond(): void {
    if (!this.name || !this.description || !this.points) {
      this.valide = false;
      return;
    } else {
      this.valide = true;
    }

    this.generated = [];
    this.generateCodes(1, 15);
    this.generalService.findBondsByCode(this.generated.toString()).subscribe(b => {
      const bs = b.body;
      if (bs.length >= 1) {
        this.generateBond();
      }
    });

    const bond = new Bond();
    bond.name = this.name;
    bond.description = this.description;
    bond.creationDate = dayjs();
    bond.code = this.generated.toString();
    bond.points = this.points;
    this.bondService.create(bond).subscribe(() => {
      this.bondService.query().subscribe(bonds => {
        this.bonds = bonds.body;
      });
    });
  }

  generateCodes(number: number, length: number): void {
    for (var i = 0; i < number; i++) {
      this.generateCode(length);
    }
  }

  generateCode(length?: number): void {
    var text = '';

    for (var i = 0; i < length; i++) {
      text += this.possible.charAt(Math.floor(Math.random() * this.possible.length));
    }

    if (this.generated.indexOf(text) === -1) {
      this.generated.push(text);
    } else {
      this.generateCode();
    }
  }

  gotoBond(id: number): void {
    this.router.navigate(['admin/' + id + '/print-bond']);
  }

  onRowEditInit(bond: any): void {
    console.log(bond);
  }

  onRowEditComplete(bond: any): void {
    console.log(bond);
    this.bondService.update(bond.data).subscribe();
  }

  onRowEditCancel(bond: any) {
    console.log(bond);
  }

  deleteBond(bond: IBond): void {
    this.bondService.delete(bond.id).subscribe(() => {
      this.bondService.query().subscribe(bonds => {
        this.bonds = bonds.body;
      });
    });
  }
}
