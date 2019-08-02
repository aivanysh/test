import { Component, OnInit } from '@angular/core';
import { BaseDashboardFullComponent } from '../../base-classes/base-dashboard-full/base-dashboard-full.component';
import { MatDialog } from '@angular/material';
import { CorrespondenceService } from 'src/app/dashboard/services/correspondence.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-external-dashboard',
  templateUrl: './external-dashboard.component.html',
  styleUrls: ['./external-dashboard.component.scss']
})

export class ExternalDashboardComponent extends BaseDashboardFullComponent  implements OnInit {

  constructor(
    public dialogU: MatDialog,
    public correspondenceService: CorrespondenceService,
    public router: Router) {
    super(dialogU, correspondenceService, router);
    this.reportType = 'ExtFullSearch';
  }

}
