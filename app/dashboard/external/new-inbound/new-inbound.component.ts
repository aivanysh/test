import { Component, OnInit } from '@angular/core';
import { Correspondence } from 'src/app/dashboard/services/correspondence.model';
import { CorrespondenceService } from 'src/app/dashboard/services/correspondence.service';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder } from '@angular/forms';

import { CorrAttachDocuments } from '../../services/corrattachdocuments.model';
import { FCTSDashBoard } from '../../../../environments/environment';
import { SearchFilters } from '../../services/dasboardsearch.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentPreview } from '../../services/documentpreview.model';
import { MatDialog } from '@angular/material';
import { WorkflowHistoryDialogBox } from '../../workflow-history/workflow-history.component';
import { StatusRequest, SetStatusRow } from '../../models/Shared.model';
import { CorrespondenceShareService } from '../../services/correspondence-share.service';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { CompleteDialogComponent } from '../../complete-dialog/complete-dialog.component';


@Component({
  selector: 'app-new-inbound',
  templateUrl: './new-inbound.component.html',
  styleUrls: ['./new-inbound.component.scss']
})
export class NewInboundComponent implements OnInit {
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


  constructor(private correspondenceService: CorrespondenceService,
    private _correspondenceShareService: CorrespondenceShareService,
    private route: ActivatedRoute,
    private router: Router, private fb: FormBuilder, public dialogU: MatDialog) { }
  AdvancedSearchButton() {
    this.AdvancedSearch = !this.AdvancedSearch;
  }
  ngOnInit() {
    this.searchExtOrgFieldShow = true;
    this.searchRecipientDeptFieldShow = true;
    this.searchSenderDeptFieldShow = false;
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
    this.getCorrespondence('ExtInbNew', start, end, page, this.SearchFilterData);
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
  CompleteRequestFinal = this._correspondenceShareService.buildObject(this.selection.selected, status, 'Multiselect');
  this._correspondenceShareService.setTransferToStatus(CompleteRequestFinal).subscribe(result => {
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
 // const numRowsNewInboxlCorrespondence = this.correspondData.length;
  const numRowsNewInboxlCorrespondence = this.correspondenceData.filter(element => {
           return element.transIsCC == 1 && element.transID == 0; } ).length;
  return ( numSelectedNewInboxlCorrespondence === numRowsNewInboxlCorrespondence );
}
selectionNewInboxAllCorrespondence() {
  this.selectionNewInboxAll()
    ? this.selection.clear()
    : this.correspondenceData.filter(element => element.transIsCC == 1 && element.transID == 0).forEach(element => {this.selection.select(element); });
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
    this.router.navigate(['/dashboard/external/correspondence-detail'],
      { queryParams: { VolumeID: correspondenceData.VolumeID, CorrType: correspondenceData.CorrFlowType, CoverID: correspondenceData.CoverID, locationid: correspondenceData.DataID, TaskID: correspondenceData.SubWorkTask_TaskID, TransID: correspondenceData.transID, TransIsCC: correspondenceData.transIsCC } });
  }
  getCoverDocumentURL(CoverID: String): void {

    this.correspondenceService.getDocumentURL(CoverID)
      .subscribe(documentPreviewURL => this.documentPreviewURL = documentPreviewURL);
  }
  showWorkflowAudit(VolumeID: number) {
    let WFAuditWindow;
    const winFeatures = 'width=1600,height=800,resizable,scrollbars=yes';
    const url = '?func=ll&objId=249044&objAction=RunReport&inputlabel1=' + VolumeID + '&prompting=done';
    WFAuditWindow = window.open(url, 'WF Audit', winFeatures);
    if (WFAuditWindow.focus) {
      WFAuditWindow.focus();
    }
    return false;
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
      CompleteRequestFinal = this._correspondenceShareService.buildObject(correspondData, status, 'SingleDashboard', '');
      this._correspondenceShareService.setTransferToStatus(CompleteRequestFinal)
        .subscribe(result => {
          this.getPage(this.pagenumber);
        });
    }
  }
/* *************************************************************************** */
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

