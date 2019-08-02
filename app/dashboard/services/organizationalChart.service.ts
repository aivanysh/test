import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { organizationalChartData } from '../models/organizational-Chart-dm'
import { organizationalChartModel } from '../models/organizational-Chart.model';
import { FCTSDashBoard } from '../../../environments/environment';
import { HttpClient, HttpParams } from "@angular/common/http";
import { CorrResponse } from './correspondence-response.model';
@Injectable({
  providedIn: 'root'
})
export class OrganizationalChartService {
  private CSUrl: string = CSConfig.CSUrl;
  constructor(private httpServices: HttpClient) { }
  getOrganizationalChartDetail(): Observable<organizationalChartModel[]> {
    return of(organizationalChartData);
  }

  // getDocumentPropertiesURL(docid): Observable<DocumentPreview[]> {
  //   let params = new HttpParams().set("docid", docid);
  //   return this.httpServices.get<DocumentPreview[]>(
  //     this.CSUrl +
  //     `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.PropertiesURL}?Format=webreport`,
  //     {
  //       headers: { OTCSTICKET: CSConfig.AuthToken },
  //       params: params
  //     }
  //   );
  // }

  getOrgChartInternal(): Observable<CorrResponse[]> {
    let params = new HttpParams().set("UNITS_SHORT", "true")
      .set("SearchUnits", "")
      .set("SearchUsers", "")
    return this.httpServices.get<CorrResponse[]>(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.OrgChart}?Format=webreport`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }
      }
    );
  }
}
