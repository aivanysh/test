import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { FCTSDashBoard } from 'src/environments/environment';
import { Correspondence, RecallStepsInfo } from 'src/app/dashboard/services/correspondence.model';

import { CorrespondenceService } from 'src/app/dashboard/services/correspondence.service';
import { CorrespondenceShareService } from 'src/app/dashboard/services/correspondence-share.service';
import { ErrorHandlerFctsService } from 'src/app/dashboard/services/error-handler-fcts.service';

import { ConfirmationDialogComponent } from 'src/app/dashboard/confirmation-dialog/confirmation-dialog.component';
import { StatusRequest, SetStatusRow } from 'src/app/dashboard/models/Shared.model';
import { BaseDashboardComponent } from '../base-dashboard/base-dashboard.component';
// import { SearchFilters } from '../../services/dasboardsearch.model';
import { DataSharingService } from "../../services/data-sharing.service";

@Component({
  selector: 'app-base-dashboard-active',
  templateUrl: './base-dashboard-active.component.html'
})

export class BaseDashboardActiveComponent extends BaseDashboardComponent implements OnInit {
 constructor(
  public router: Router,
  public dialogU: MatDialog,
  public correspondenceService: CorrespondenceService,
  public correspondenceShareService: CorrespondenceShareService,
  public errorHandlerFctsService: ErrorHandlerFctsService,
  public dataSharingService: DataSharingService
  ) {
    super(router, dialogU, correspondenceService, errorHandlerFctsService, dataSharingService );
  } 


  ngOnInit() {
    console.log('init intermidiate component');
    super.ngOnInit();
  }

  getPage(page: number): void {
    const perPage = FCTSDashBoard.DefaultPageSize;
    const start = ((page - 1) * perPage) + 1;
    const end = (start + perPage) - 1;
    this.getCorrespondence(this.reportType, start, end, page, this.SearchFilterData);
    if (this.selection.selected.length > 0) { this.selection.clear(); }
  }

  sendStatus(status: string): void {
    let CompleteRequestFinal: StatusRequest = new StatusRequest;
    CompleteRequestFinal = this.correspondenceShareService.buildObject(this.selection.selected, status, 'Multiselect');
    this.correspondenceShareService.setTransferToStatus(CompleteRequestFinal).subscribe(result => {
        this.getPage(this.pagenumber);
      });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.correspondenceData.length;
    return numSelected === numRows;
  }

  selectionNewInboxAll() {
    const numSelectedNewInboxlCorrespondence = this.selection.selected.length;
    const numRowsNewInboxlCorrespondence = this.correspondenceData.length;
    return (
      numSelectedNewInboxlCorrespondence === numRowsNewInboxlCorrespondence
    );
  }

  selectionNewInboxAllCorrespondence() {
    this.selectionNewInboxAll()
      ? this.selection.clear()
      : this.correspondenceData.forEach(element => this.selection.select(element));
  }
  /* The label for the checkbox on the passed row */
  checkboxLabel(correspondData?: any): string {
    if (!correspondData) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(correspondData) ? 'deselect' : 'select'} row ${correspondData.position + 1}`;
  }
 /* ********************************** Confirmation dialog *************************** */
 OpenDashCompleteDialog(correspondData: Correspondence, status: string): void {
    if (status === '1' && correspondData.transID.toString() !== '0' && correspondData.transStatus.toString() === '0' ) {
      const dialogRef = this.dialogU.open(ConfirmationDialogComponent, {
        width: '100%',
        panelClass: 'complete-dialog',
        maxWidth: '30vw',
        data: {
          data: correspondData,
          callplace: 'SingleDashboard'
        }
      }).afterClosed().subscribe( result => {
        if (result === 'Reload') { this.getPage(this.pagenumber); }
        });
    } else {
      let CompleteRequestFinal: StatusRequest = new StatusRequest;
      CompleteRequestFinal = this.correspondenceShareService.buildObject(correspondData, status, 'SingleDashboard', '');
      this.correspondenceShareService.setTransferToStatus(CompleteRequestFinal).subscribe(result => { this.getPage(this.pagenumber); });
    }
  }

}
