import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.css']
})
export class UploadDialogComponent implements OnInit {
  @Output()
  uploadEvent: EventEmitter<string> = new EventEmitter<string>();

  class: string = "dropzone";
  data: any;
  dialogText: string;
  dragAndDropText: string;
  dragOver:boolean = false;
  dropzone: any;
  uploadValue: any = [];
  
  constructor(
    public dialogRef: MdDialogRef<any>
  ) {
    this.data = this.dialogRef._containerInstance.dialogConfig.data;
  }

  ngOnInit() {
    this.dialogText = this.data.dialogText;
    this.dragAndDropText = this.data.dragAndDropText;
    this.dropzone = document.getElementById('dropzone');
  }

  onDragLeave = () => {
    this.class = 'dropzone';
  }

  onDragOver = (event) => {
    event.preventDefault();
    if(this.uploadValue.length < 1) {
      this.class = 'dropzone dragover';
    } else {
      this.class = 'dropList';
    }
  }

  onDrop = (event) => {
    event.preventDefault();
    this.class = 'dropList';
    this.upload(event.dataTransfer.files);
  }

  remove = (index) => {
    this.uploadValue.splice(index, 1);

    console.log(this.uploadValue);
  }

  upload = (files) => {
    let type;

    for(let lim = files.length, i = 0; i < lim; i++) {
      type = files[i].type.split("/");
      if(type[0] == "image") {
        files[i]['mdIcon'] = "image";
      } else {
        files[i]['mdIcon'] = "attach_file";
      }

      this.uploadValue.push(files[i])
    }

    console.log(this.uploadValue);
  }
}
