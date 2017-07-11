import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MdDialogRef } from '@angular/material';

/*Serices*/
import { CrudService } from './../../services/crud.service';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.css']
})
export class UploadDialogComponent implements OnInit {
  @Output()
  fileUploaded: EventEmitter<any> = new EventEmitter<any>();

  class: string = "dropzone";
  data: any;
  dialogText: string;
  dragAndDropText: string;
  dragOver:boolean = false;
  dropzone: any;
  uploadValue: any = [];
  
  constructor(
    private crud: CrudService,
    public dialogRef: MdDialogRef<any>,
    private http: Http
  ) {
    //this.data = this.dialogRef._containerInstance.dialogConfig.data;
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
  }

  upload = (files) => {
    let formData:FormData = new FormData(),
        file: File = files,
        type;

    for(let lim = files.length, i = 0; i < lim; i++) {
      type = files[i].type.split("/");
      if(type[0] == "image") {
        files[i]['mdIcon'] = "image";
      } else {
        files[i]['mdIcon'] = "attach_file";
      }
      formData.append('file', files[i]);  

      this.uploadValue.push(files[i])
    }
    
    this.crud.upload('laravel', {route: 'medias', objectToCreate: formData});
    console.log(formData['getAll']('file'));
  }
}
