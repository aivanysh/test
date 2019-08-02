import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { FCTSDashBoard } from '../../../environments/environment';
import { DataSharingService } from "../services/data-sharing.service";
@Component({
  selector: 'app-external',
  templateUrl: './external.component.html'
})

export class ExternalComponent implements OnInit, AfterViewInit {
  CSUrl: string;
  basehref: String = FCTSDashBoard.BaseHref;
  menuAction = true;
  scrollbarOptions = { axis: 'yx', theme: 'minimal-dark' };
  itemsCount: any;


  constructor( private httpService: HttpClient
              ,private _dataSharingService: DataSharingService) { }
  menuItems: string[];

  ngOnInit() {
    this.httpService.get(`${FCTSDashBoard.BaseHref}assets/Data/menu.json`).subscribe(
      data => {
        this.menuItems = data as string[];
      },
      (err: HttpErrorResponse) => { }
    );
  }
  ngAfterViewInit() {
    this.CSUrl = CSConfig.CSUrl;
    this.httpService
      .get(
      this.CSUrl +
      `${FCTSDashBoard.WRApiV1}${
      FCTSDashBoard.getMenuCountExt
      }?Format=webreport&ProxyUserID=${CSConfig.globaluserid}`,
      {
        headers: { OTCSTICKET: CSConfig.AuthToken }
      }
      )
      .subscribe(
      data => {
        this.menuItems = data as string[];
        this.itemsCount = data;
        this.itemsCountShare();
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
      }
      );

  }
  menuActionButton() {
    this.menuAction = !this.menuAction;
    console.log(this.menuAction);
  }

  /***************Items count share data************* */
  itemsCountShare() {
    if((Array.isArray(this.itemsCount) && this.itemsCount.length)){
      this._dataSharingService.changeItemsCount(this.itemsCount[0]);
    }
  }
}

