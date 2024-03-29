import { DashboardShowButtons } from '../dashboard-show-buttons';

export class Correspondence {
  RowNum: number;
  VolumeID: number;
  CorrespondenceDate: string;
  onBehalf: string;
  ReceivedTaskDate: string;
  CorrespondenceDueDate: string;
  DispatchDate: string;
  CorrespondenceSignatureDate: string;
  ResponseDueDate: string;
  PersonalStatusDate: string;
  CorrespondenceFlowType: string;
  CorrFlowType: string;
  CorrespondenceCode: string;
  Priority: number;
  BaseType: number;
  CorrespondenceType2: null;
  ArabicSubject: string;
  EnglishSubject: string;
  SenderDepartment: number;
  SenderDepartmentName: string;
  RecipientDepartment: number;
  RecipientDepartmentName: string;
  ExternalOrganization: number;
  ExternalOrganizationName: string;
  ExternalOrganizationNameAR: string;
  ExternalDepartmentName: string;
  ExternalDepartmentNameAR: string;
  Confidential: number;
  ProjectCode: string;
  BudgetNumber: string;
  TenderNumber: string;
  ContractNumber: string;
  StaffNumber: string;
  CoverID: number;
  DocumentNumber: string;
  SubWork_SubWorkID: number;
  DataID: number;
  Work_WorkID: number;
  SubWorkTask_TaskID: number;
  SubWorkTask_PerformerID: number;
  SubWorkTask_Title: string;
  SubWorkTask_PerformerID_Name: string;
  transID: number;
  transDelegatorID: number;
  transPriority: number;
  transPurpose: number;
  transDueDate: string;
  transStatus: number;
  transType: number;
  transDelegatorID_Name: string;
  transUserID: number;
  transIsReplay: number;
  transHoldSecretaryID: number;
  transIsCC: number;
  BaseType_EN: string;
  BaseType_AR: string;
  CCPurpose: number;
  performer07: number;
  personalStatus: number;
  CountIFOnlyCC: number;
  SubWorkTask_PerformerID_Type: number;
  SubWorkTask_PerformerID_Groups: any;
  countconnections: number;
  lastCommDateDiff: number;
  countcomments: number;
  Path_EN: string;
  Path_AR: string;
  UserColl_Purpose: number;
  ToPurpose: number;
  Status: string;
  FaxDate: string;
  FaxID: number;
  counttasks: number;
  TaskStatus: string;
  CorrespondenceCollaboration: number;
  UserColl_DueDate: string;
  MaxSee: number;
  MaxCoverSee: number;
  Name: string;
  inbox_icons: any;
  inboxCorrespondenceIcon: any;
  ReferenceNumber: string;
  CorrespondenceType_EN: string;
  FromDepartment: string;
  ToDepartment: string;
  Priority_EN: string;
  totalRowCount: number;
  showButtons: DashboardShowButtons;
}

export class RecallStepsInfo {
  ASAprevTask: number;
  CorrespondenceFlowType: string;
  CorrespondencePhase: string;
  CorrID: string;
  TotalRows: number;
  currPerformer: number;
  currTask: number;
  currTask_Title: string;
  initDate: string;
  isASAUser: number;
  isPowerUser: number;
  iterNum: string;
  prevPerformer: number;
  prevTask: number;
  subWorkID: number;
}
