import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { FCTSDashBoard } from '../../../environments/environment';

@Component({
  selector: 'app-external',
  templateUrl: './external.component.html'
})

export class ExternalComponent implements OnInit, AfterViewInit {
  CSUrl: string;
  basehref: String = FCTSDashBoard.BaseHref;
  menuAction = true;
  scrollbarOptions = { axis: 'yx', theme: 'minimal-dark' };

  constructor(private httpService: HttpClient) { }
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
}
