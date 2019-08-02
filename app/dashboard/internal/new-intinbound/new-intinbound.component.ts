import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { FCTSDashBoard } from '../../../../environments/environment';
import { Correspondence } from '../../services/correspondence.model';
import { CorrAttachDocuments } from '../../services/corrattachdocuments.model';
// import { SearchFilters } from '../../services/dasboardsearch.model';
import { DocumentPreview } from '../../services/documentpreview.model';
import { StatusRequest } from '../../models/Shared.model';
import { CorrResponse } from '../../services/correspondence-response.model';

import { CorrespondenceService } from '../../services/correspondence.service';
import { CorrespondenceShareService } from '../../services/correspondence-share.service';
import { ErrorHandlerFctsService } from '../../services/error-handler-fcts.service';

import { WorkflowHistoryDialogBox } from '../../workflow-history/workflow-history.component';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { TransferReplyDialogComponent } from '../../transfer-reply-dialog/transfer-reply-dialog.component';
import { CompleteDialogComponent } from '../../complete-dialog/complete-dialog.component';

@Component({
  selector: 'app-new-intinbound',
  templateUrl: './new-intinbound.component.html',
  styleUrls: ['./new-intinbound.component.scss']
})
export class NewIntInboundComponent implements OnInit {
  // SearchFilterData: SearchFilters;
  SearchFilterData = {
    ReferenceCode: '',
    DocumentNumber: '',
    MyAssignments: false,
    DispatchDateFrom: '',
    DispatchDateTo: '',
    Subject: '',
    CorrespondencType: { ID: '', EN: '', AR: '' },
    ExternalOrganization: '',
    ExternalDepartment: '',
    RecipientDepartment: { ID: '', EN: '', AR: '' },
    SenderDepartment: { ID: '', EN: '', AR: '' },
    Priority: { ID: '', EN: '', AR: '' },
    BaseType: { ID: '', EN: '', AR: '' },
    IDNumber: '',
    Personalname: '',
    Transferpurpose: '',
    Contract: '',
    Tender: '',
    Mailroom: '',
    Budget: '',
    Project: '',
    Staffnumber: ''
  };

  reportType = 'IntInbNew';
  routerCorrDetail = '/dashboard/external/correspondence-detail';
  basehref: String = FCTSDashBoard.BaseHref;
  CorrAttach: CorrAttachDocuments;
  frameurl: string;
  returnedURl: string;
  AdvancedSearch = false;
  selectedCorrespondence: Correspondence;
  previewViewCorrespondence: Correspondence;
  quickViewCorrespondence: Correspondence;
  correspondenceData: Correspondence[];
  selection = new SelectionModel<Correspondence>(true, []);
  currentPageNumber = 1;
  correspondData: Correspondence;
  DocumentPreview: boolean;
  progbar = true;
  documentPreviewURL: DocumentPreview[];
  // Pagination Variiables
  itemsPerPage: number = FCTSDashBoard.DefaultPageSize;
  pagenumber = 1;
  totalCount: number;
  searchExtOrgFieldShow: boolean;
  searchSenderDeptFieldShow: boolean;
  searchRecipientDeptFieldShow: boolean;


  constructor(
    // private route: ActivatedRoute,
    public router: Router,
    public dialogU: MatDialog,
    public correspondenceService: CorrespondenceService,
    public correspondenceShareService: CorrespondenceShareService,
    public errorHandlerFctsService: ErrorHandlerFctsService
  ) { }
  AdvancedSearchButton() {
    this.AdvancedSearch = !this.AdvancedSearch;
  }
  ngOnInit() {
    this.searchExtOrgFieldShow = false;
    this.searchRecipientDeptFieldShow = true;
    this.searchSenderDeptFieldShow = true;
    this.getPage(1);
  }

  onSelect(correspondData: Correspondence): void {
    this.selectedCorrespondence = correspondData;
  }

  previewViewWrapper(correspondData: Correspondence): void {
    if (correspondData) {this.setPerformerPermission(correspondData); }
    this.getCoverDocumentURL('' + correspondData.CoverID);
    this.previewViewCorrespondence = correspondData;
  }

  quickViewWrapper(correspondData: Correspondence): void {
    this.quickViewCorrespondence = correspondData;
  }

  getPage(page: number): void {
    const perPage = FCTSDashBoard.DefaultPageSize;
    const start = ((page - 1) * perPage) + 1;
    const end = (start + perPage) - 1;
    this.getCorrespondence(this.reportType, start, end, page, this.SearchFilterData);
    if (this.selection.selected.length > 0) { this.selection.clear(); }
  }

  getCorrespondence(pageType: string, startrow: number, endrow: number, page: number, SearchFilterData: any): void {
    this.progbar = true;
    this.correspondenceService
      .getDashboardMain(pageType, startrow, endrow, SearchFilterData)
      .subscribe(correspondenceData => {
        this.correspondenceData = correspondenceData;
        this.progbar = false;
        if (this.correspondenceData.length === 0) {
          this.totalCount = 0;
        } else if (startrow === 1) {
          this.totalCount = correspondenceData[0].totalRowCount;
        }
        this.pagenumber = page;
      }
      );
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
    const numRowsNewInboxlCorrespondence = this.correspondenceData.filter(element => {
      return element.transIsCC == 1 && element.transID == 0; } ).length;
    return (
      numSelectedNewInboxlCorrespondence === numRowsNewInboxlCorrespondence
    );
  }
  selectionNewInboxAllCorrespondence() {
    this.selectionNewInboxAll()
      ? this.selection.clear()
      : this.correspondenceData
        .filter(element => element.transIsCC == 1 && element.transID == 0)
          .forEach(element => { this.selection.select(element); });
  }
   /** The label for the checkbox on the passed row */
  checkboxLabel(correspondData?: any): string {
    if (!correspondData) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(correspondData) ? 'deselect' : 'select'} row ${correspondData.position + 1}`;
  }
/***************************************************************************** */
  SearchDashboard(): void {
    this.getPage(1);
  }

  routeToDetailsPage(correspondenceData: Correspondence) {
    this.setPerformerPermission(correspondenceData);

    if (correspondenceData.SubWorkTask_TaskID > 0 && correspondenceData.SubWorkTask_PerformerID_Groups.split(',').indexOf(correspondenceData.SubWorkTask_PerformerID) > 0 ) {
       this.userConfirmation( 'assignWF', correspondenceData );
    } else if (correspondenceData.transID > 0 && correspondenceData.transHoldSecretaryID !== CSConfig.globaluserid ) {
      this.userConfirmation( 'assignTransfer', correspondenceData );

    /*} else if (correspondenceData.transID > 0 && correspondenceData.transHoldSecretaryID != CSConfig.globaluserid ) {
      console.log("transfer assigned to USER"); */
    } else {
      this.router.navigate([this.routerCorrDetail],
                            { queryParams:
                               {
                                 VolumeID: correspondenceData.VolumeID,
                                 CorrType: correspondenceData.CorrFlowType,
                                 CoverID: correspondenceData.CoverID,
                                 locationid: correspondenceData.DataID,
                                 TaskID: correspondenceData.SubWorkTask_TaskID,
                                 TransID: correspondenceData.transID,
                                 TransIsCC: correspondenceData.transIsCC
                                }
                              }
                          );
    }
    console.log(correspondenceData);
  }

  getCoverDocumentURL(CoverID: String): void {
    this.correspondenceService.getDocumentURL(CoverID)
      .subscribe(documentPreviewURL => this.documentPreviewURL = documentPreviewURL);
  }
  onSearchDashboardButtonClick(selecetedValues: any): void {
    this.SearchFilterData = selecetedValues;
    this.SearchDashboard();
  }

 /* ****************************** Complete/Archive ************************** */
 OpenDashCompleteDialog(correspondData: Correspondence, status: string): void {
  if (status === '1' && correspondData.transID != 0 && correspondData.transStatus == 0 ) {
    const dialogRef = this.dialogU.open(CompleteDialogComponent, {
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
    this.correspondenceShareService.setTransferToStatus(CompleteRequestFinal)
      .subscribe(result => {
        this.getPage(this.pagenumber);
      });
  }
}
/* **************************** Assign Group task ************************************ */
  userConfirmation(mess: string, correspondenceData: Correspondence): void {
      const dialogRef = this.dialogU.open(ConfirmationDialogComponent, {
        width: '100%',
        panelClass: 'userConfirmation',
        maxWidth: '30vw',
        data: {
          message: mess
        }
      }).afterClosed().subscribe( response => {
          // data == true ? console.log('true') : data == false ? console.log('false') : console.log('cancel');
          if ( mess === 'assignTransfer' && response === true) {
            this.correspondenceShareService.ToggleTransStatus(correspondenceData.transID, 'holdTask').subscribe(
                data => {
                  if (data.transfer_status_changes[0].ID == correspondenceData.transID) {
                    console.log('DEV: transfer asiigned to current user');
                    // open CorrView
                    this.router.navigate([this.routerCorrDetail],
                      { queryParams:
                          {
                            VolumeID: correspondenceData.VolumeID,
                            CorrType: correspondenceData.CorrFlowType,
                            CoverID: correspondenceData.CoverID,
                            locationid: correspondenceData.DataID,
                            TaskID: correspondenceData.SubWorkTask_TaskID,
                            TransID: correspondenceData.transID,
                            TransIsCC: correspondenceData.transIsCC
                          }
                        }
                    );
                  } else {
                    console.log('DEV: ERROR with assigning trarnsfer');
                  }
                });
          } else if ( mess === 'assignTransfer' && response === false) {
            console.log('DEV: Open with RO mode');
            this.router.navigate(['/dashboard/external/correspondence-detail'],
                { queryParams:
                    {
                      VolumeID: correspondenceData.VolumeID,
                      CorrType: correspondenceData.CorrFlowType,
                      CoverID: correspondenceData.CoverID,
                      locationid: correspondenceData.DataID,
                      TaskID: correspondenceData.SubWorkTask_TaskID,
                      TransID: correspondenceData.transID,
                      TransIsCC: correspondenceData.transIsCC
                    }
                  }
              );
          } else if ( mess === 'assignWF' && response === true) {
            console.log('DEV: Assign WF step');
          }

      });
  }

/* *****************************  Transfer reply ******************************************* */
transferReplyDialog(correspondData: Correspondence, transUser: CorrResponse): void {
  const dialogRef = this.dialogU.open(TransferReplyDialogComponent, {
    width: '100%',
    panelClass: 'transfer-reply-dialog',
    maxWidth: '60vw',
    data: {
      corrData: correspondData,
      transferUser: transUser,
      callPlace: 'SingleDashboard'
    }
  }).afterClosed().subscribe(result => {
      if (result === 'Reload') { this.getPage(this.pagenumber);
      }
    });
}

transferReply(correspondData: Correspondence): void {
  this.correspondenceShareService.getTransferUser(correspondData.transDelegatorID.toString()).subscribe(
    transferUser => {
      this.transferReplyDialog(correspondData, transferUser);
    },
    responseError => {
      this.errorHandlerFctsService.handleError(responseError).subscribe();
    }
  );
}
/* ************************************************************************************** */

   openDialog(correspondData: Correspondence): void {
    const dialogRef = this.dialogU.open(WorkflowHistoryDialogBox, {
      width: '100%',
      panelClass: 'transferDialogBoxClass',
      maxWidth: '85vw',
      data: {
        data: correspondData
      }
    });
  }
  setPerformerPermission(correspondData: Correspondence): void {
    this.correspondenceService.setPerformerPermission(correspondData).subscribe();
  }

}
