import { Injectable } from '@angular/core';
import { Observable, of, throwError, observable } from 'rxjs';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Correspondence, RecallStepsInfo } from './correspondence.model';
import { FCTSDashBoard } from '../../../environments/environment';
import { CorrAttachDocuments } from './corrattachdocuments.model';
import { DocumentPreview } from './documentpreview.model';
import { DashboardFilter, DashboardFilterResponse } from '../models/DashboardFilter';
import { map, tap, catchError } from 'rxjs/operators';
import { DashboardShowButtons } from '../dashboard-show-buttons';
import { AppLoadConstService } from '../../app-load-const.service';

@Injectable({
  providedIn: 'root'
})
export class CorrespondenceService {
  private CSUrl: string = CSConfig.CSUrl;
  private _globalConstants = this.appLoadConstService.getConstants();

  constructor(
    private httpServices: HttpClient,
    private appLoadConstService: AppLoadConstService
  ) { }

  getExternalFullSearch(): Observable<Correspondence[]> {
    return this.httpServices.get<Correspondence[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.ExternalInbNew
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }
      }
    );
  }

  getUserData(): Observable<any[]> {
    return this.httpServices.get<any[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.getUserOverallData
      }?Format=webreport&ProxyUserID=${CSConfig.globaluserid}`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }
      }
    );
  }


  // SearchFilterData: SearchFilters;
  // SearchFilterData = {
  //   ReferenceCode: '',
  //   DocumentNumber: '',
  //   MyAssignments: false,
  //   DispatchDateFrom: '',
  //   DispatchDateTo: '',
  //   Subject: '',
  //   CorrespondencType: { ID: '', EN: '', AR: '' },
  //   ExternalOrganization: '',
  //   ExternalDepartment: '',
  //   RecipientDepartment: { ID: '', EN: '', AR: '' },
  //   SenderDepartment: { ID: '', EN: '', AR: '' },
  //   Priority: { ID: '', EN: '', AR: '' },
  //   BaseType: { ID: '', EN: '', AR: '' },
  //   IDNumber: '',
  //   Personalname: '',
  //   Transferpurpose: '',
  //   Contract: '',
  //   Tender: '',
  //   Mailroom: '',
  //   Budget: '',
  //   Project: '',
  //   Staffnumber: ''
  // }

  getDashboardMain(reportType, startRow, endRow, queryFilters): Observable<Correspondence[]> {
    const params = new HttpParams()
      .set('reportType', reportType)
      .set('startRow', startRow)
      .set('endRow', endRow)
      .set('CorrespondenceCode', queryFilters.ReferenceCode ? queryFilters.ReferenceCode : '')
      .set('ExternalOrganization', queryFilters.ExternalOrganization ? queryFilters.ExternalOrganization : '')
      .set('ExternalDepartment', queryFilters.ExternalDepartment ? queryFilters.ExternalDepartment : '')
      .set('Priority', queryFilters.Priority.ID ? queryFilters.Priority.ID : '')
      .set('ReceivedDateFrom', queryFilters.DispatchDateFrom ? queryFilters.DispatchDateFrom : '')
      .set('ReceivedDateTo', queryFilters.DispatchDateTo ? queryFilters.DispatchDateTo : '')
      .set('FromDep', queryFilters.SenderDepartment.ID ? queryFilters.SenderDepartment.ID : '')
      .set('ToDep', queryFilters.RecipientDepartment.ID ? queryFilters.RecipientDepartment.ID : '')
      .set('BaseType', queryFilters.BaseType.ID ? queryFilters.BaseType.ID : '')
      .set('Subject', queryFilters.Subject ? queryFilters.Subject : '')
      .set('MyAssignments', queryFilters.MyAssignments ? queryFilters.MyAssignments : '')
      .set('DocumentNumber', queryFilters.DocumentNumber ? queryFilters.DocumentNumber : '')
      .set('enableTotalCount', startRow === 1 ? 'true' : 'false');
    return this.httpServices.get<Correspondence[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.DashboardReportMain
      }?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken },
        params: params
      }
    )
    .pipe (
      map (response => {
        return this._transformCorrespondenceData(response, reportType);
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  private _transformCorrespondenceData(correspondenceData: Correspondence[], reportType: string): Correspondence[] {
    for (let index = 0; index < correspondenceData.length; index++) {
      correspondenceData[index].showButtons = new DashboardShowButtons(correspondenceData[index], reportType);
      // console.log(correspondenceData[index]);
    }
    console.log(correspondenceData[0]);
    return correspondenceData;
  }

  getDocumentURL(coverdocumentid): Observable<DocumentPreview[]> {
    const params = new HttpParams().set('coverdocumentid', coverdocumentid);
    return this.httpServices.get<DocumentPreview[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.BravaURL}?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken },
        params: params
      }
    );
  }

  getDashboardFilters(): any {
    return this.httpServices.get<any>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.SearchFilters}?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }
      }
    );
  }

  searchExtOrgName(name): Observable<DashboardFilterResponse> {
    if (name.length >= 3) {
      const params = new HttpParams().set('cpName', name);
      return this.httpServices.get<DashboardFilterResponse>(this.CSUrl +
        `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.ExtOrgNameFilter}?Format=webreport`,
        {
          headers: { OTCSTICKET: CSConfig.AuthToken },
          params: params
        });
    }
    // .pipe(
    // tap((response: DashboardFilterResponse) => {
    //   response.results = response.results
    //     .map(user => new DashboardFilter(user.id, user.name, user.name_ar))
    //   return response;
    // })
    // );
  }

  setPerformerPermission(correspondData): Observable<any> {
    const params = new HttpParams()
      .set( 'locationid', correspondData.DataID )
      .set( 'UserID', CSConfig.globaluserid )
      .set( 'CorrFlowType', correspondData.CorrFlowType )
      .set( 'TaskID', correspondData.SubWorkTask_TaskID )
      .set( 'quickPerm', 'true' );

    return this.httpServices
      .get(
        this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.SetPerformerPermission}?Format=webreport`,
        { headers:
          { OTCSTICKET: CSConfig.AuthToken },
          params: params
        }
      )
      .pipe (
        map (data => {
          console.log('performer permission is set');
          return data;
        }),
        catchError(error => {
          console.log('set Performer permission ERROR => ' + error.message || 'some error with set performer permission');
          return error;
        })
      );
  }

  assignWFStep(correspondData: Correspondence): Observable<any> {
    const url = this.CSUrl + `${FCTSDashBoard.WFApiV2}processes/${correspondData.Work_WorkID}/subprocesses/${correspondData.Work_WorkID}/tasks/${correspondData.SubWorkTask_TaskID}`;
    const body = new HttpParams()
      .set('action', 'accept');

    const options = {
      headers: new HttpHeaders()
          .set( 'Content-Type', 'application/x-www-form-urlencoded' )
          .set( 'OTCSTICKET', CSConfig.AuthToken )
    };
    return this.httpServices
      .put<any[]>(url, body, options)
      .pipe (
        map (data => {
          console.log('DEV: task assigned');
          return data;
        }),
        catchError(error => {
          console.log('DEV: task wasnt assigned');
          return throwError(error);
        })
      );
  }

  checkRecallWF(correspondData: Correspondence): Observable<RecallStepsInfo> {
    const url = this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.CheckWFRecall}?Format=webreport`;
    const params = new HttpParams()
            .set( 'SubWorkID', correspondData.SubWork_SubWorkID.toString() )
            .set( 'UserID', CSConfig.globaluserid )
            .set( 'PowerGroupID', this._globalConstants.FCTS_Dashboard.PowerGroupID )
            .set( 'ASAGroupID', this._globalConstants.FCTS_Dashboard.FCTS_ASA );

    return this.httpServices
      .get<RecallStepsInfo>( url, { headers: { OTCSTICKET: CSConfig.AuthToken }, params: params } )
      .pipe (
        map (response => {
          response.iterNum = '';
          response.CorrID = correspondData.DataID.toString();
          console.log(response);
          return response;
        }),
        catchError(error => {
          console.log(error);
          return throwError(error);
        })
      );

  }

  runRecallWF(stepsInfo: RecallStepsInfo): Observable<any> {
    const flowType = stepsInfo.CorrespondenceFlowType;
    const prevTask = stepsInfo.prevTask;
    let corrPhase = '';
/* start calculation of correspondence phase */
    if (flowType === '1') {
      corrPhase = '4';
    } else if (flowType === '5') {
      const phase1 = [9, 45];
      const phase2 = [13, 15, 17, 18, 21];
      if ( phase1.indexOf(prevTask) !== -1 ) { corrPhase = '1'; } else if ( phase2.indexOf(prevTask) !== -1 ) { corrPhase = '2'; } else { corrPhase = '5'; }
    } else if (flowType === '7') {
      if ( prevTask === 29 || prevTask === 65 ) { corrPhase = '1'; } else { corrPhase = '2'; }
    } else {
      corrPhase = stepsInfo.CorrespondencePhase;
    }
/* end calculation of correspondence phase */

    const url = this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.RunWFRecall}?Format=webreport`;
    const params = new HttpParams()
      .set( 'subWorkID', stepsInfo.subWorkID.toString() )
      .set( 'currStepID', stepsInfo.currTask.toString() )
      .set( 'backStepID', stepsInfo.prevTask.toString() )
      .set( 'corrPhase', corrPhase )
      .set( 'disposition1', 'Recall' );

      return this.httpServices
      .get<any>( url, { headers: { OTCSTICKET: CSConfig.AuthToken }, params: params } )
      .pipe (
        map (data => {
          console.log(data);
          return data;
        }),
        catchError(error => {
          console.log(error);
          return throwError(error);
        })
      );

  }

  setCustomDispositionAudit(stepsInfo: RecallStepsInfo, disposition1: string) {
    const url = this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.SetDipsAudit}?Format=webreport`;
    const params = new HttpParams()
      .set( 'VolumeID', stepsInfo.subWorkID.toString() )
      .set( 'TaskID', stepsInfo.currTask.toString() )
      .set( 'IterNum', stepsInfo.iterNum.toString() )
      .set( 'Disposition1', disposition1 )
      .set( 'fInsertDisp1', 'true');

    return this.httpServices
      .get<any>( url, { headers: { OTCSTICKET: CSConfig.AuthToken }, params: params } )
      .pipe (
        map (response => {
          return response;
        }),
        catchError(error => {
          console.log(error);
          return throwError(error);
        })
      );
  }

  recallMultipleApprove(stepsInfo: RecallStepsInfo): Observable<any> {
    const url = this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.SetStatusMultiApprove}?Format=webreport`;
    const params = new HttpParams()
      .set( 'CorrID', stepsInfo.CorrID.toString() )
      .set( 'fIsDoneRecall', 'true');

    return this.httpServices
      .get<any>( url, { headers: { OTCSTICKET: CSConfig.AuthToken }, params: params } )
      .pipe (
        map (response => {
          console.log(response);
          return response;
        }),
        catchError(error => {
          console.log(error);
          return throwError(error);
        })
      );
  }

  sendRecallNotification(stepsInfo: RecallStepsInfo): Observable<any> {
    const url = this.CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.SendRecallEmail}?Format=webreport`;
    const params = new HttpParams()
      .set( 'SubWorkID', stepsInfo.subWorkID.toString() )
      .set( 'currPerformer', stepsInfo.currPerformer.toString() )
      .set( 'recallUserID', CSConfig.globaluserid );

    const headers = new HttpHeaders()
      .set( 'OTCSTICKET', CSConfig.AuthToken );

    return this.httpServices
      .get<any>( url, { headers: headers, params: params, responseType: 'text' as 'json' } )
      .pipe (
        map (response => {
          console.log(response);
          return response;
        }),
        catchError(error => {
          console.log(error);
          return throwError(error);
        })
      );
  }

  returnDisp1ForAudit(stepsInfo: RecallStepsInfo, disposition1: string) {
    let retDisp1 = disposition1;
    switch (stepsInfo.CorrespondenceFlowType.toString()) {
        case '1':
          break;
        case '5':
          switch (stepsInfo.currTask.toString()) {
            case '15': /* 03 Approve Correspondence */
              if (disposition1 === 'SendOn') { retDisp1 = 'Approve'; }
              break;
            case '18': /* 05 Approve & Sign Correspondence */
              if (disposition1 === 'SendOn') { retDisp1 = 'Approve and Sign'; }
              break;
            default:
              retDisp1 = disposition1;
            break;
          }
          break;
        case '7':
          switch (stepsInfo.currTask.toString()) {
            case '35': /* 03 Approve Correspondence */
              if (disposition1 === 'SendOn') { retDisp1 = 'Approve'; }
              break;
            case '38': /* 05 Approve & Sign Correspondence */
              if (disposition1 === 'SendOn') { retDisp1 = 'Approve&Sign'; }
              break;
            case '3': /* 07 Retrieve Correspondence */
              if (disposition1 === 'SendOn') { retDisp1 = 'Complete'; }
              break;
            default:
              retDisp1 = disposition1;
            break;
          }
          break;
        default:
          retDisp1 = disposition1;
          break;
      }
     return retDisp1;
  }

}
