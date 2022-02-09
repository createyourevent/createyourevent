import { Component, AfterViewInit, OnInit, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { IChipsAdmin } from "app/entities/chips-admin/chips-admin.model";
import { ChipsAdminService } from "app/entities/chips-admin/service/chips-admin.service";
import { IChipsCollectionChips, ChipsCollectionChips } from "app/entities/chips-collection-chips/chips-collection-chips.model";
import { ChipsCollectionChipsService } from "app/entities/chips-collection-chips/service/chips-collection-chips.service";
import { IChipsCollection } from "app/entities/chips-collection/chips-collection.model";
import { ChipsCollectionService } from "app/entities/chips-collection/service/chips-collection.service";
import { IChips } from "app/entities/chips/chips.model";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";
import { PointsDataService } from "app/points/points-display/points-display.service";
import { Subscription } from "rxjs";
import { ChipsControllerService } from "../chips-controller.service";
import { SwitchOffOnEmitterService } from "../switch-off-on-emitter.service";
import { ChipItem } from "./chip-item";
import { ChipComponent } from "./chip.component";
import { ChipHolderDirective } from "./chip.directive";


@Component({
  selector: 'jhi-chip-holder',
  template: `
                <ng-template jhiChipHolder></ng-template>
            `,
  styleUrls: ['./chip.component.scss']
})
export class ChipHolderComponent implements AfterViewInit, OnInit {

  chipsComponent: ChipItem[] = [];
  chips!: IChips[];
  chipsCollectionChips!: IChipsCollectionChips[];
  currentAdIndex = -1;
  @ViewChild(ChipHolderDirective, {static: true}) chipHolder!: ChipHolderDirective;
  viewContainerRef!: ViewContainerRef;
  componentRef!: ComponentRef<ChipComponent>;
  user!: IUser;
  userChipCollection!: IChipsCollection;
  valueOffOn!: string;


  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private chipsControllerService: ChipsControllerService,
              private router: Router,
              private generalService: GeneralService,
              private chipsCollectionService: ChipsCollectionService,
              private switchOffOnEmitterService: SwitchOffOnEmitterService,
              private chipsAdminService: ChipsAdminService,
              private chipsCollectionChipsService: ChipsCollectionChipsService,
              private pointsData: PointsDataService)
              {}


  ngOnInit(): void {
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body!;

      if(this.user != null) {
      this.getChips().then(() => {
        this.loadComponent();
      });

      this.chipsAdminService.find(1).subscribe(m => {
        const gameActive: IChipsAdmin = m.body!;
        if(gameActive.gameActive) {
          this.valueOffOn = "on";
        } else {
          this.valueOffOn = "off";
        }

      this.router.events.subscribe(val => {
        if(val instanceof NavigationEnd) {
          // this.getChips().then(() => {
            this.loadComponent();
          // });
        }
      });

      if (this.switchOffOnEmitterService.subsVar === undefined) {
        this.switchOffOnEmitterService.subsVar = this.switchOffOnEmitterService.
        invokeSwitchOffOn.subscribe((value:string) => {
          this.valueOffOn = value;
          this.chipsAdminService.find(1).subscribe(ms => {
            const activeGame: IChipsAdmin = ms.body!;
            if(value === 'on') {
              activeGame.gameActive = true;
            } else {
              activeGame.gameActive = false;
            }
            this.chipsAdminService.update(activeGame).subscribe();
          });
        });
       }
      });
     }
    });
  }


  ngAfterViewInit(): void {


  }

  loadComponent(): void {
    this.viewContainerRef = this.chipHolder.viewContainerRef;
    this.viewContainerRef.clear();

    if(this.valueOffOn === "on") {
      this.chipsComponent.forEach(chipItem => {
        this.generalService.findChipsCollectionByUserId(this.user.id!).subscribe(uc => {
          this.userChipCollection = uc.body!;

          this.generalService.findOndChipsCollectionChipsByChipsCollectionIdAndChipsId(this.userChipCollection.id!, chipItem.data.id).subscribe(res => {
            const ucc = res.body;

            if(this.router.url.includes(chipItem.data.website) && (ucc === null || ucc === undefined)) {
              const componentFactory = this.componentFactoryResolver.resolveComponentFactory(chipItem.component);

              this.componentRef = this.viewContainerRef.createComponent<ChipComponent>(componentFactory);
              this.componentRef.instance.id = chipItem.data.id;
              this.componentRef.instance.points = chipItem.data.points;
              this.componentRef.instance.left = chipItem.data.left;
              this.componentRef.instance.top = chipItem.data.top;
              this.componentRef.instance.website = chipItem.data.website;
              this.componentRef.instance.image = chipItem.data.image;
              this.componentRef.instance.imageContentType = chipItem.data.imageContentType;
              this.componentRef.instance.color = chipItem.data.color;
              this.componentRef.changeDetectorRef.detectChanges();
              const sub:Subscription = this.componentRef.instance.clickChip.subscribe(event => this.clickChip(event));
              this.componentRef.onDestroy(()=> { sub.unsubscribe()});
            }
        });
        });
      });
    }
  }

  clickChip(event: any): void {
    this.viewContainerRef.clear();
    const chip: IChips = event.chip;

    const foundChip = new ChipsCollectionChips();

    this.generalService.findChipsCollectionByUserId(this.user.id!).subscribe(cc => {
      this.pointsData.changePoint(this.user.points! + chip.points!);
      const collection: IChipsCollection = cc.body!;
      foundChip.chips = chip;
      foundChip.chipsCollection = collection;
      this.chipsCollectionChipsService.create(foundChip).subscribe();
      this.user.points! += chip.points!;
      this.generalService.updateUserLoggedInAndPoints(this.user.id!, this.user!.loggedIn!, this.user!.points!).subscribe();
    });

  }


  getChips(): Promise<void>{
    return new Promise<void>(resolve => {
      this.chipsComponent = [];
      this.chipsControllerService.getAllChips().subscribe(c => {
        this.chips = c.body!;
        this.chips.forEach(chip => {
          this.chipsComponent.push(new ChipItem(ChipComponent, {id: chip.id, points: chip.points,left: chip.x, top: chip.y, website: chip.website, image: chip.image, imageContentType: chip.imageContentType, color: chip.color}));
        });
        resolve();
      });
    });
  }
}
