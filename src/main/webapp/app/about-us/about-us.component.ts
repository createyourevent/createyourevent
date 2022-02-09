import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TreeNode, MessageService } from 'primeng/api';
import { MatomoTracker } from 'ngx-matomo';

@Component({
  selector: 'jhi-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['about-us.component.scss'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class AboutUsComponent implements OnInit {

  data1!: TreeNode[];
  selectedNode!: TreeNode;

  constructor(private messageService: MessageService, private matomoTracker: MatomoTracker) {}

  ngOnInit(): void {
    
    this.matomoTracker.setDocumentTitle('About-us');
    
    this.data1 = [
      {
        label: 'Headquarter',
        type: 'person',
        styleClass: 'p-person',
        expanded: true,
        data: { name: 'MMMM - Heartfull Mind', avatar: 'heartfull-mind-logo.png', url: 'https://www.heartfull-mind.org' },
        children: [
          {
            label: 'SUB-UNIT',
            type: 'person',
            styleClass: 'p-subunit',
            expanded: true,
            data: { name: 'Really Fair', avatar: 'really-fair-logo.png', url: '' }
          },
          {
            label: 'SUB-UNIT',
            type: 'person',
            styleClass: 'p-subunit',
            expanded: true,
            data: { name: 'Create Your Humanity', avatar: 'create-your-humanity-logo.png', url: '' }
          },
          {
            label: 'SUB-UNIT',
            type: 'person',
            styleClass: 'p-subunit',
            expanded: true,
            data: { name: 'Create Your Ideas', avatar: 'create-your-ideas-logo.png', url: '' },
            children: [
              {
                label: 'SUB-UNIT',
                type: 'person',
                styleClass: 'p-subsubunit',
                expanded: true,
                data: { name: 'Create Your Event', avatar: 'create_your_event_logo.png', url: '' }
              }
            ]
          },
          {
            label: 'SUB-UNIT',
            type: 'person',
            styleClass: 'p-person',
            expanded: true,
            data: { name: 'Create Your Sense', avatar: 'create-your-sense-logo.png', url: '' }
          }
        ]
      }
    ];
  }

  onNodeSelect(event: any): void {
    this.messageService.add({ severity: 'success', summary: 'Node Selected', detail: event.node.label });
  }

}
