import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { FCTSDashBoard } from 'src/environments/environment';
import { Correspondence, RecallStepsInfo } from 'src/app/dashboard/services/correspondence.model';
import { CorrAttachDocuments } from 'src/app/dashboard/services/corrattachdocuments.model';
import { DocumentPreview } from 'src/app/dashboard/services/documentpreview.model';

import { CorrespondenceService } from 'src/app/dashboard/services/correspondence.service';
import { CorrespondenceShareService } from 'src/app/dashboard/services/correspondence-share.service';
import { ErrorHandlerFctsService } from 'src/app/dashboard/services/error-handler-fcts.service';

import { WorkflowHistoryDialogBox } from 'src/app/dashboard/workflow-history/workflow-history.component';
import { ConfirmationDialogComponent } from 'src/app/dashboard/confirmation-dialog/confirmation-dialog.component';
import { StatusRequest, SetStatusRow } from 'src/app/dashboard/models/Shared.model';
// import { SearchFilters } from '../../services/dasboardsearch.model';

import { DataSharingService } from "../../services/data-sharing.service";
import { MenuCountInt, MenuItemsInfo} from "../../services/data-sharing.model"

@Component({
  selector: 'app-base-dashboard',
  templateUrl: './base-dashboard.component.html'
})

export class BaseDashboardComponent implements OnInit {
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

  reportType = '';
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
  // currentPageNumber = 1;
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
  //Items Count Variables
  itemsCount: MenuCountInt;
  fullPageNumber: string;


  constructor(
    public router: Router,
    public dialogU: MatDialog,
    public correspondenceService: CorrespondenceService,
    public errorHandlerFctsService: ErrorHandlerFctsService,
    public dataSharingService: DataSharingService
  ) { }

  ngOnInit() {
    console.log('init component - ' + this.reportType);
    this.getPage(this.pagenumber);
    this.setItemCount();
  }

  setItemCount(){
    let InbArray = ['IntInbNew','IntInbAck','IntInbArc','ExtInbArc','ExtInbNew','ExtInbAck',]
    let OutArray = ['IntOutWIP','IntOutSig','IntOutArc','ExtOutSig','ExtOutArc','ExtOutWIP']
    let dashname: string;
    this.dataSharingService.currentItemsCount.subscribe(itemsCount => {
      this.itemsCount = itemsCount;
      if(InbArray.includes(this.reportType) && (typeof this.itemsCount != 'undefined')){
        switch(this.reportType){
          case 'IntInbNew': dashname = "new-intinbounds"
            break;
          case 'IntInbAck': dashname = "inProgress-intinbounds"
            break;
          case 'IntInbArc': dashname = "archieved-intinbounds"
            break;
             case 'ExtInbNew': dashname = "new-inbounds" 
            break;
          case 'ExtInbAck': dashname = "inProgress-inbounds"
            break;
          case 'ExtInbArc': dashname = "archieved-inbounds"
            break; 
          default: dashname = 'undefined'
        }
        if(Array.isArray(this.itemsCount.inbounds)){
          this.itemsCount.inbounds.forEach((element)=>{
            element.router == dashname ? this.fullPageNumber = element.Count : null
          })
        } 
      }
      if(OutArray.includes(this.reportType) && (typeof this.itemsCount != 'undefined')){
        switch(this.reportType){
          case 'ExtOutWIP': dashname = "new-outbounds"
            break;
          case 'ExtOutSig': dashname = "inProgress-outbounds"
            break;
          case 'ExtOutArc': dashname = "archieved-outbounds"
            break; 
            case 'IntOutWIP': dashname = "new-intoutbounds" 
            break;
          case 'IntOutSig': dashname = "inProgress-intoutbounds"
            break;
          case 'IntOutArc': dashname = "archieved-intoutbounds" 
            break; 
          default: dashname = 'undefined'
        }
        if(Array.isArray(this.itemsCount.outbounds)){
          this.itemsCount.outbounds.forEach((element)=>{
            element.router == dashname ? this.fullPageNumber = element.Count : null

          })
        } 
      }
    })
  }

  AdvancedSearchButton() {
    this.AdvancedSearch = !this.AdvancedSearch;
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

  SearchDashboard(): void {
    this.getPage(1);
  }

  routeToDetailsPage(correspondenceData: Correspondence) {
    this.setPerformerPermission(correspondenceData);
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

  getCoverDocumentURL(CoverID: String): void {
    this.correspondenceService.getDocumentURL(CoverID)
      .subscribe(documentPreviewURL => this.documentPreviewURL = documentPreviewURL);
  }

  onSearchDashboardButtonClick(selecetedValues: any): void {
    this.SearchFilterData = selecetedValues;
    this.SearchDashboard();
  }
/* ************************************* Correspondence History window *************************************** */
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
