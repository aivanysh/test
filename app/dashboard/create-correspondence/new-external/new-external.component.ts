import { Component, OnInit } from '@angular/core';
import { CorrespondenceDetail } from 'src/app/dashboard/services/correspondence-details.model';
import { CorrespondenceDetailsService } from 'src/app/dashboard/services/correspondence-details.service';
import { OrganizationalChartService } from 'src/app/dashboard/services/organizationalChart.service';
import { organizationalChartModel } from 'src/app/dashboard/models/organizational-Chart.model';
import { Location } from '@angular/common'
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree'
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FCTSDashBoard } from '../../../../environments/environment';

enum CheckBoxType { APPLY_FOR_JOB, MODIFY_A_JOB, NONE };

@Component({
  selector: 'app-new-external',
  templateUrl: './new-external.component.html'
})


export class NewExternalComponent implements OnInit {

  basehref: String = FCTSDashBoard.BaseHref;
  CSUrl: String = FCTSDashBoard.CSUrl;


  // Get Folder Folder for Correspondence Initiation

  //Get Organization chart
  organizationalChartData: organizationalChartModel[];
  showEmplChartData: organizationalChartModel;
  showOrgChartData: organizationalChartModel;
  treeControl = new NestedTreeControl<organizationalChartModel>(node => node.children);
  dataSource = new MatTreeNestedDataSource<organizationalChartModel>();
  showEmployees = false;


  correspondenceDetailsData: CorrespondenceDetail[];
  expandedRightAction: boolean = true;
  expandedAction: boolean = true;


  recipientControl = new FormControl();
  recipientFilteredOptions: Observable<any[]>;
  departmentDetailsData: string[];
  ngOnInit() {

    this.getOrganizationalChartDetail();
    this.organizationalChart();




    // this.getCorrespondenceDetails();
    this.recipientFilteredOptions = this.recipientControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  getEmplDetail(organizationalChartData: organizationalChartModel): void {
    this.showEmplChartData = organizationalChartData;
    console.log(this.showEmplChartData.OUID);
  }
  getOrgSelectDetail(organizationalChartData: organizationalChartModel) {
    this.showOrgChartData = organizationalChartData;
    console.log(organizationalChartData);
    console.log(this.showOrgChartData.OUID);
  }
  addRecipient() {
  }
  addHero(organizationalChartSearch: string) {
    organizationalChartSearch;
    console.log(organizationalChartSearch);
  }
  value = '';
  getSearchValue(value: string) {
    this.value = value;
    console.log(this.value);
  }
  //autocomplect data statur... after to service
  options: any[] = ['Ashghal', 'Assets Affairs', 'Building Affairs', 'Committees', 'Engineering', 'Legal', 'Ministry of Municipality'];
  private _filter(value: any): any[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(optiont => optiont.toLowerCase().indexOf(filterValue) === 0);
  }
  organizationalChart() {
    this.dataSource.data = this.organizationalChartData;
  }
  constructor(private correspondenceSenderDetailsService: CorrespondenceDetailsService, private _location: Location, private organizationalChartService: OrganizationalChartService) { }
  // getCorrespondenceDetails(): void {
  //   this.correspondenceSenderDetailsService.getCorrRecord()
  //     .subscribe(correspondenceDetailsData => this.correspondenceDetailsData = correspondenceDetailsData);
  // }
  getOrganizationalChartDetail(): void {
    // this.organizationalChartService.getOrgChartInternal()
    //   .subscribe(OrgChartResponse => {
    //     let myMap = new Map();
    //     for (let obj of OrgChartResponse.myRows) {

    //     }
    //     this.organizationalChartData = organizationalChartData

    //   });
  }

  expandeActionRightButton() {
    this.expandedRightAction = !this.expandedRightAction;
  }
  expandeActionLeftButton() {
    this.expandedAction = !this.expandedAction;
  }
  backNavigation() {
    this._location.back()
  }
  hasChild = (_number: number, node: organizationalChartModel) => !!node.children && node.children.length > 0;

  currentlyChecked: organizationalChartModel
  selectSinglCheckbox(organizationalChartData: organizationalChartModel) {
    // If the checkbox was already checked, clear the currentlyChecked variable
    // this.currentlyChecked = organizationalChartData;
    if (this.currentlyChecked === organizationalChartData) {
      this.currentlyChecked;
      console.log(this.currentlyChecked);
      return;

    }
    console.log(this.currentlyChecked);
    this.currentlyChecked = organizationalChartData;
  }
}