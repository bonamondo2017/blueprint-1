import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.css']
})
export class UploadDialogComponent implements OnInit {
  data: any;
  dialogText: string;

  constructor(
    public dialogRef: MdDialogRef<any>
  ) {
    this.data = this.dialogRef._containerInstance.dialogConfig.data;
  }

  ngOnInit() {
    this.dialogText = this.data.dialogText;
  }

}
