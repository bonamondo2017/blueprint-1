import { Component, Input, OnInit } from '@angular/core';
import { MdDialog, MdDialogClose } from '@angular/material';

/*Components*/
import { UploadDialogComponent } from './../upload-dialog/upload-dialog.component';

@Component({
  selector: 'bonamondo-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  @Input() visual: string;

  constructor(
    public dialog: MdDialog
  ) { }

  ngOnInit() {
  }

  onFileUploaded(data) {
    console.log(data);
  }
  
  upload = () => {
    let dialogRef = this.dialog.open(
      UploadDialogComponent,
      {
        data: {
          dialogText: this.visual['dialogText'],
          dragAndDropText: "Arraste o arquivo para cá"
        },
        height: '380px',
        width: '600px'
      }
    );
  }
}
