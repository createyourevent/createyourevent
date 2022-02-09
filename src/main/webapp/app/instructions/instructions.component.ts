import { Component, OnInit } from '@angular/core';

import { AccountService } from 'app/core/auth/account.service';
import { GeneralService } from '../general.service';
import { SharedLanguageChangeService } from 'app/layouts/navbar/SharedLanguageChangeService.service';
import { JhiLanguageService } from 'ng-jhipster';
import { TranslateService } from '@ngx-translate/core';
import { SharedDialogLanguageService } from 'app/sharedDialogLanguage.service';


interface Lang {
  name: string,
  code: string
}

@Component({
  selector: 'jhi-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['instructions.component.scss']
})
export class InstructionsComponent implements OnInit {


  constructor(
    private accountService: AccountService,
    private generalService: GeneralService,
    private languageService: JhiLanguageService,
    private translate: TranslateService,
    private sharedLanguageChangeService: SharedLanguageChangeService,
    private sharedDialogLanguageService: SharedDialogLanguageService
  ) {
  }

  ngOnInit(): void {


  }
}
