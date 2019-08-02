import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { CorrespondenceService } from 'src/app/dashboard/services/correspondence.service';
import { BaseDashboardActiveComponent } from 'src/app/dashboard/base-classes/base-dashboard-active/base-dashboard-active.component';
import { ErrorHandlerFctsService } from 'src/app/dashboard/services/error-handler-fcts.service';
import { CorrespondenceShareService } from 'src/app/dashboard/services/correspondence-share.service';

@Component({
  selector: 'app-in-progress',
  templateUrl: './in-progress.component.html',
  styleUrls: ['./in-progress.component.scss']
})

export class InProgressComponent extends BaseDashboardActiveComponent implements OnInit {

  constructor(
      public router: Router,
      public dialogU: MatDialog,
      public correspondenceService: CorrespondenceService,
      public correspondenceShareService: CorrespondenceShareService,
      public errorHandlerFctsService: ErrorHandlerFctsService
    ) {
      super(router, dialogU, correspondenceService, correspondenceShareService, errorHandlerFctsService);
      this.reportType = 'ExtInbAck';
    }

  ngOnInit() {
    super.ngOnInit();
    this.searchExtOrgFieldShow = false;
    this.searchRecipientDeptFieldShow = true;
    this.searchSenderDeptFieldShow = true;
  }

}