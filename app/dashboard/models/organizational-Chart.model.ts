export class organizationalChartModel {
  Name: string;
  OUID: number;
  Parent: number;
  Name_AR: string;
  LTID: number;
  OUTID: number;
  Code: number;
  employees_status: string;
  children?: organizationalChartModel[];
  static OUID: any;
}