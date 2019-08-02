import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CorrResponse } from '../services/correspondence-response.model';
import { Correspondence } from '../services/correspondence.model';
import { FCTSDashBoard } from '../../../environments/environment';
import { CorrespondenceShareService } from 'src/app/dashboard/services/correspondence-share.service';
import { StatusRequest, SetStatusRow } from 'src/app/dashboard/models/Shared.model';

@Component({
  selector: 'app-complete-dialog',
  templateUrl: './complete-dialog.component.html'
})

export class CompleteDialogComponent implements OnInit {
  comment = '';
  err: string;
  constructor(
    public dialogRef: MatDialogRef<CompleteDialogComponent>,
    private _correspondenceShareService: CorrespondenceShareService,
    @Inject(MAT_DIALOG_DATA) public corrData: any,

  ) { }

  onNoClick(): void {
    this.dialogRef.close('Cancel');
  }

  sendStatus(status: string): void {
    let CompleteRequestFinal: StatusRequest = new StatusRequest;
    if (this.comment.trim().length < 10 ) {
      this.err = 'Comment should be more than 10 characters';
    } else {
      CompleteRequestFinal = this._correspondenceShareService.buildObject(this.corrData.data, '1', this.corrData.callplace, this.comment);
      this.err = '';
      this._correspondenceShareService.setTransferToStatus(CompleteRequestFinal).subscribe();
      this.dialogRef.close('Reload');
    }
  }

  ngOnInit() {

  }

}
