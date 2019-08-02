import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { FCTSDashBoard } from '../../../../environments/environment';
import { Correspondence, RecallStepsInfo } from '../../services/correspondence.model';
import { CorrAttachDocuments } from '../../services/corrattachdocuments.model';
// import { SearchFilters } from '../../services/dasboardsearch.model';
import { DocumentPreview } from '../../services/documentpreview.model';

import { CorrespondenceService } from '../../services/correspondence.service';
import { CorrespondenceShareService } from '../../services/correspondence-share.service';
import { ErrorHandlerFctsService } from '../../services/error-handler-fcts.service';

import { WorkflowHistoryDialogBox } from '../../workflow-history/workflow-history.component';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { MessageDialogComponent } from '../../message-dialog/message-dialog.component';
import { TransferRecallDialogComponent } from '../../transfer-recall-dialog/transfer-recall-dialog.component';

@Component({
  selector: 'app-new-intoutbound',
  templateUrl: './new-intoutbound.component.html',
  styleUrls: ['./new-intoutbound.component.scss']
})
export class NewIntOutboundComponent implements OnInit {
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

  reportType = 'IntOutWIP';
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
      private router: Router,
      public dialogU: MatDialog,
      private _correspondenceService: CorrespondenceService,
      private _correspondenceShareService: CorrespondenceShareService,
      private _errorHandlerFctsService: ErrorHandlerFctsService
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
    if (correspondData) { this.setPerformerPermission(correspondData); }
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
  }

  getCorrespondence(pageType: string, startrow: number, endrow: number, page: number, SearchFilterData: any): void {
    this.progbar = true;
    this._correspondenceService
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
/*  selectionNewInboxAll() {
    const numSelectedNewInboxlCorrespondence = this.selection.selected.length;
    const numRowsNewInboxlCorrespondence = this.correspondData.length;
    return (
      numSelectedNewInboxlCorrespondence === numRowsNewInboxlCorrespondence
    );
  }
  selectionNewInboxAllCorrespondence() {
    this.selectionNewInboxAll()
      ? this.selection.clear()
      : this.correspondData.forEach(element => this.selection.select(element));
  }*/
  SearchDashboard(): void {
    this.getPage(1);
  }
  /*routeToDetailsPage(correspondenceData: Correspondence) {
    this.setPerformerPermission(correspondenceData);
    this.router.navigate(['/dashboard/external/correspondence-detail'],
      { queryParams: {
                        VolumeID: correspondenceData.VolumeID,
                        CorrType: correspondenceData.CorrFlowType,
                        CoverID: correspondenceData.CoverID,
                        locationid: correspondenceData.DataID,
                        TaskID: correspondenceData.SubWorkTask_TaskID,
                        TransID: correspondenceData.transID, TransIsCC: correspondenceData.transIsCC
                      }
      }
    );
  }*/

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

    this._correspondenceService.getDocumentURL(CoverID)
      .subscribe(documentPreviewURL => this.documentPreviewURL = documentPreviewURL);
  }

  onSearchDashboardButtonClick(selecetedValues: any): void {
    this.SearchFilterData = selecetedValues;
    this.SearchDashboard();
  }

  setPerformerPermission(correspondData: Correspondence): void {
    this._correspondenceService.setPerformerPermission(correspondData).subscribe(
      response => {      },
      responseError => {
        this._errorHandlerFctsService.handleError(responseError).subscribe();
      }
    );
  }

/* *************************** Assign Group task ************************************ */
  userConfirmation(mess: string, correspondenceData: Correspondence): void {
    const dialogRef = this.dialogU.open(ConfirmationDialogComponent, {
      width: '100%',
      panelClass: 'userConfirmation',
      maxWidth: '30vw',
      data: {
        message: mess
      }
    }).afterClosed().subscribe(
        response => {
        if ( mess === 'assignTransfer' && response === true) {
          this._correspondenceShareService.ToggleTransStatus(correspondenceData.transID, 'holdTask').subscribe(
              response => {
                if (response.transfer_status_changes[0].ID == correspondenceData.transID) {
                  console.log('DEV: transfer asiigned to current user');
                  // open CorrView
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
                } else {
                  console.log('DEV: ERROR with assigning trarnsfer');
                }
              },
              responseError => {
                this._errorHandlerFctsService.handleError(responseError).subscribe();
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
          this._correspondenceService.assignWFStep(correspondenceData)
          .subscribe(
            response => {
             console.log('DEV: Assign WF step');
            /* !!!!!! there should be opened WF step, temporary: withing development CorrespView is opened */
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
            /* *************************************************** */
            },
            responseError => {
              this._errorHandlerFctsService.handleError(responseError).subscribe();
            }
          );
        }
      },
      responseError => {
        this._errorHandlerFctsService.handleError(responseError).subscribe();
      }
    );
}
/* ************************** Open History Diaolog  ********************************* */
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

  showMessage(message: string) {
    const dialogRef = this.dialogU.open( MessageDialogComponent, {
      width: '100%',
      // margin: 'auto',
      panelClass: 'complete-dialog',
      maxWidth: '30vw',
      data: { message }
    })
      .afterClosed().subscribe(
        // the lifecycle hook can be used e.g. to reload Dashboard
      );
  }
/* ******************  START RECALL  ****************** */
  startRecall(correspondData: Correspondence, recallType: string): void {
    if ( recallType !== 'ReturnToAS' ) {
      if ( correspondData.SubWorkTask_TaskID > 0 ) {
        this.recallWF(correspondData, recallType);
      } else {
        this.openRecallDialog(correspondData, recallType);
      }
    } else {
      this.returnToAS(correspondData, recallType);
      console.log('run transfer Return to ASA');
    }
  }

  openRecallDialog(correspondData: Correspondence, recallType: string): void {
    const dialogRef = this.dialogU.open(TransferRecallDialogComponent, {
      width: '100%',
      panelClass: 'transferDialogBoxClass',
      maxWidth: '85vw',
      data: {
        'correspondData': correspondData,
        'recallType': recallType,
        'selectedRows': ''
      }
    }).afterClosed().subscribe(
      response => {
        if ( response === 'recall') { this.getPage(this.pagenumber); }
      },
      errorResponse => {
        console.log('eroor from in-progress-ininbound-component:');
      }
    );
  }

  recallWF(correspondData: Correspondence, recallType: string): void {
    this._correspondenceService.checkRecallWF(correspondData).subscribe(
      response => {
        // DEV: need to check
        const recallCreateDate = Date.parse('13 September 2018');
        if ( recallCreateDate > Date.parse(response.initDate) ) {
          this.showMessage('The Correspondence was initiated before Recall functionality has been created');
        } else {
          if (recallType === 'SimpleRecall') {
            if (response.currTask !== -1 && response.prevTask !== -1 ) {
              console.log('DEV: simple recall');
              this.runWFRecall(response);
            } else {
              this.showMessage('You can not recall this Correspondence');
            }
          } else if (recallType === 'MRRecall') {
            if (response.currTask !== -1 && response.ASAprevTask !== -1 ) {
              // this.RunRecallASA(response);
              console.log('DIV: ASA recall');
            } else {
              this.showMessage('You can not recall this Correspondence');
            }
          }
        }
      },
      responseError => {
        this._errorHandlerFctsService.handleError(responseError).subscribe();
      }
    );
  }

  runWFRecall(stepsInfo: RecallStepsInfo) {
    this._correspondenceService.runRecallWF(stepsInfo)
      .subscribe(
        response => {
          console.log(response);
          if (response.ok.toString() === 'true') {
            this.setDispAudit(stepsInfo, 'Recall');
            this.multipleApprove_Recall(stepsInfo);
            this.sendNotification(stepsInfo);
            this.getPage(this.pagenumber);
          } else {
            this.showMessage('An error occurred withing run Recall Correspondence, please contact the administrator');
          }
        },
        responseError => {
          this._errorHandlerFctsService.handleError(responseError).subscribe();
        }
      );
  }

  returnToAS(correspondData: Correspondence, recallType: string) {

  }

  setDispAudit(stepsInfo: RecallStepsInfo, disposition1: string): void {
    const setDisp = this._correspondenceService.returnDisp1ForAudit(stepsInfo, disposition1);
    this._correspondenceService.setCustomDispositionAudit(stepsInfo, setDisp).subscribe(
      response => {
        if ( response.toString().trim() === stepsInfo.subWorkID.toString() ) {
          // DispAudit is set
        } else {
          this.showMessage('Error withing saving Disposition1 for Correspondence, VolumeID = ' + stepsInfo.subWorkID.toString());
        }
      },
      responseError => {
        this._errorHandlerFctsService.handleError(responseError).subscribe();
      }

    );
  }

  multipleApprove_Recall(stepsInfo: RecallStepsInfo): void {
    if ( (stepsInfo.CorrespondenceFlowType === '7' && stepsInfo.currTask === 37) || (stepsInfo.CorrespondenceFlowType === '5' && stepsInfo.currTask === 17) ) {
      this._correspondenceService.recallMultipleApprove(stepsInfo).subscribe(
        response => {
          console.log(response);
        },
        responseError => {
          this._errorHandlerFctsService.handleError(responseError).subscribe();
        }
      );
    }
  }

  sendNotification(stepsInfo: RecallStepsInfo): void {
    this._correspondenceService.sendRecallNotification(stepsInfo).subscribe(
      response => {
        console.log(response);
      },
      responseError => {
        this._errorHandlerFctsService.handleError(responseError).subscribe();
      }
    );
  }
/* ******************  END RECALL  ****************** */
}

