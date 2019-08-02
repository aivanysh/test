import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule, MatCheckboxModule, MatNativeDateModule, MatIconModule, MatTreeModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { ChartsModule } from 'ng2-charts';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SideNavigationComponent } from './side-navigation/side-navigation.component';
import { NewInboundComponent } from './external/new-inbound/new-inbound.component';
import { ExternalComponent } from './external/external.component';
import { InternalComponent } from './internal/internal.component';
import { MatSortModule } from '@angular/material/sort';
import { ExternalDashboardComponent } from './external/external-dashboard/external-dashboard.component';
import { MailDetailView } from './base-classes/base-dashboard-full/base-dashboard-full.component';
import { InProgressComponent } from './external/in-progress-inbounds/in-progress.component';
import { AchievedInboundsComponent } from './external/achieved-inbounds/achieved-inbounds.component';
import { NewOutboundComponent } from './external/new-outbound/new-outbound.component';
import { InProgressOutboundComponent } from './external/in-progress-outbound/in-progress-outbound.component';
import { AchievedOutboundComponent } from './external/achieved-outbound/achieved-outbound.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Dashboardfilterattribute } from 'src/app/dashboard/pipes/dashbaordfilterattribute.pipe';
import { DocumentViewerComponent } from '../dashboard/external/documentviewer/documentviewer.component';
import { CorrespondenceDetailComponent } from './external/correspondence-detail/correspondence-detail.component';
import { SearchfilterComponent } from './searchfilter/searchfilter.component';
import { TransferDialogBox } from './external/correspondence-detail/correspondence-transfer-dialog/correspondence-transfer-dialog.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { WorkflowHistoryDialogBox } from './workflow-history/workflow-history.component';
import { InternalDashboardComponent } from './internal/internal-dashboard/internal-dashboard.component';
import { NewIntInboundComponent } from './internal/new-intinbound/new-intinbound.component';
import { InprogressIntComponent } from './internal/in-progress-intinbounds/in-progress-intinbounds.component';
import { AchievedIntInboundComponent } from './internal/achieved-intinbounds/achieved-intinbounds.component';
import { NewIntOutboundComponent } from './internal/new-intoutbound/new-intoutbound.component';
import { InprogressIntOutboundComponent } from './internal/in-progress-intioutbounds/in-progress-intioutbounds.component';
import { AchievedIntOutboundComponent } from './internal/achieved-intoutbounds/achieved-intoutbounds.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

import { CreateCorrespondenceComponent } from './create-correspondence/create-correspondence.component';
import { NewExternalComponent } from './create-correspondence/new-external/new-external.component';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { CompleteDialogComponent } from './complete-dialog/complete-dialog.component';
import { TransferRecallDialogComponent } from './transfer-recall-dialog/transfer-recall-dialog.component';
import { ErrorHandlerFctsService } from './services/error-handler-fcts.service';
import { TransferReplyDialogComponent } from './transfer-reply-dialog/transfer-reply-dialog.component';
import { SafePipe } from './pipes/safe.pipe';
import { BaseDashboardFullComponent } from './base-classes/base-dashboard-full/base-dashboard-full.component';
import { BaseDashboardComponent } from './base-classes/base-dashboard/base-dashboard.component';
import { BaseDashboardActiveComponent } from './base-classes/base-dashboard-active/base-dashboard-active.component';


@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MalihuScrollbarModule.forRoot(),
    MatTooltipModule,
    ChartsModule,
    MatPaginatorModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatSortModule,
    HttpClientModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatTreeModule,
    MatIconModule
  ],
  declarations: [
    DashboardComponent,
    SideNavigationComponent,
    NewInboundComponent,
    NewIntInboundComponent,
    ExternalComponent,
    InternalComponent,
    ExternalDashboardComponent,
    InternalDashboardComponent,
    MailDetailView,
    InProgressComponent,
    InprogressIntComponent,
    AchievedInboundsComponent,
    AchievedIntInboundComponent,
    AchievedIntOutboundComponent,
    NewOutboundComponent,
    NewIntOutboundComponent,
    InProgressOutboundComponent,
    InprogressIntOutboundComponent,
    AchievedOutboundComponent,
    SafePipe,
    Dashboardfilterattribute,
    DocumentViewerComponent,
    CorrespondenceDetailComponent,
    SearchfilterComponent,
    TransferDialogBox,
    WorkflowHistoryDialogBox,
    CreateCorrespondenceComponent,
    NewExternalComponent,
    ConfirmationDialogComponent,
    MessageDialogComponent,
    CompleteDialogComponent,
    TransferRecallDialogComponent,
    TransferReplyDialogComponent,
    BaseDashboardFullComponent,
    BaseDashboardComponent,
    BaseDashboardActiveComponent
  ],
  entryComponents: [
    MailDetailView,
    WorkflowHistoryDialogBox,
    TransferDialogBox,
    ConfirmationDialogComponent,
    MessageDialogComponent,
    CompleteDialogComponent,
    TransferRecallDialogComponent,
    TransferReplyDialogComponent
  ],
  providers: [ErrorHandlerFctsService]
})
export class DashboardModule { }
