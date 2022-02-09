import { NgModule } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { RouterModule } from "@angular/router";
import { SharedModule } from "app/shared/shared.module";
import { MzdTimelineModule } from "ngx-rend-timeline";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { OrganizationChartModule } from "primeng/organizationchart";
import { TabViewModule } from "primeng/tabview";
import { ImpressumComponent } from "./impressum.component";
import { IMPRESSUM_ROUTE } from "./impressum.route";

@NgModule({
  imports: [SharedModule, RouterModule.forChild(IMPRESSUM_ROUTE), TabViewModule, CardModule, MzdTimelineModule, MatCardModule, ButtonModule, OrganizationChartModule],
  declarations: [ImpressumComponent]
})

export class ImpressumModule {}
