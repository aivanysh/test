import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';
import { FCTSDashBoard } from '../environments/environment';

@Injectable()
export class AppLoadConstService {
  private _CSConstants: any;
  private _CSUrl: string = CSConfig.CSUrl;

    getConstants() {
      return this._CSConstants;
    }

    constructor( private _httpServices: HttpClient) {
    }

    Init() {
      return new Promise<void>((resolve, reject) => {
        this.loadGlobalConstants()
        .subscribe(
          response => {
            this._CSConstants = response;
            resolve();
          },
          error => {
            alert(`An error with loading global constants. ` + '\n' +
                    `Error Text - ` + error.statusText + '.\n' +
                    `Error - ` + error.error.error );
          }
        );
      });
    }

    loadGlobalConstants(): Observable<any> {
      const url = this._CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.GetGlobalConst}?Format=webreport`;
      const params = new HttpParams();
        return this._httpServices.get<any>( url, { headers: { OTCSTICKET: CSConfig.AuthToken }, params: params } );
      }
}

 /*  Init() {
    const url = this._CSUrl + `${FCTSDashBoard.WRApiV1}${FCTSDashBoard.GetGlobalConst}?Format=webreport`;
    const params = new HttpParams();

    const getConstants = this._httpServices.get<any>( url, { headers: { OTCSTICKET: CSConfig.AuthToken }, params: params } );

    getConstants
      .subscribe(
        response => {
          this._CSConstants = response;
        },
        errorResponse => {
          alert(`An error with loading global constants. ` + '\n' +
              `Error Text - ` + errorResponse.statusText + '.\n' +
              `Error - ` + errorResponse.error.error );
        }
      );
    return getConstants.toPromise();
  }
 */


