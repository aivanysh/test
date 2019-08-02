import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { CorrespondenceService } from 'src/app/dashboard/services/correspondence.service';
import { BaseDashboardComponent } from '../../base-classes/base-dashboard/base-dashboard.component';
import { ErrorHandlerFctsService } from '../../services/error-handler-fcts.service';

@Component({
  selector: 'app-achieved-outbound',
  templateUrl: './achieved-outbound.component.html',
  styleUrls: ['../../base-classes/base-dashboard/base-dashboard.component.scss']
})
export class AchievedOutboundComponent extends BaseDashboardComponent implements OnInit {

  constructor(
    public router: Router,
    public dialogU: MatDialog,
    public correspondenceService: CorrespondenceService,
    public errorHandlerFctsService: ErrorHandlerFctsService
  ) {
      super(router, dialogU, correspondenceService, errorHandlerFctsService);
      this.reportType = 'ExtOutArc';
  }

  ngOnInit() {
    super.ngOnInit();
    this.searchExtOrgFieldShow = true;
    this.searchRecipientDeptFieldShow = false;
    this.searchSenderDeptFieldShow = true;
  }
}
