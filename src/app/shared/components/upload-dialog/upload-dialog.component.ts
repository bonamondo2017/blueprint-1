import { Component, Input, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.css']
})
export class UploadDialogComponent implements OnInit {
  acceptedTypes = {
    'image/png': true,
    'image/jpeg': true,
    'image/gif': true
  };
  data: any;
  dialogText: string;
  dragAndDropText: string;
  fileupload = document.getElementById('upload');
  holder: string;
  holderId = document.getElementById('holder');
  progress = document.getElementById('uploadprogress');
  /*tests = {
    filereader: typeof FileReader != 'undefined',
    dnd: 'draggable' in document.createElement('span'),
    formdata: !!window.FormData,
    progress: "upload" in new XMLHttpRequest
  }*/

  support = {
    filereader: document.getElementById('filereader'),
    formdata: document.getElementById('formdata'),
    progress: document.getElementById('progress')
  };
  tests = {
    filereader: typeof FileReader != 'undefined',
    formdata: true,
    dnd: 'draggable' in document.createElement('span'),
    progress: "upload" in new XMLHttpRequest
  }
  
  constructor(
    public dialogRef: MdDialogRef<any>
  ) {
    this.data = this.dialogRef._containerInstance.dialogConfig.data;
  }

  ngOnInit() {
    this.dialogText = this.data.dialogText;
    this.dragAndDropText = this.data.dragAndDropText;

    if (this.tests.dnd) { 
      
    } else {
      this.fileupload.className = 'hidden';
      this.fileupload.querySelector('input').onchange = function () {
        //readfiles(this.files);
      };
    }
  }

  previewfile = (file) => {
    if (this.tests.filereader === true && this.acceptedTypes[file.type] === true) {
      let reader = new FileReader();
      let that = this;

      reader.onload = function (event) {
        console.log(event);
        /*let image = new Image();
        image.src = event.target.result;
        image.width = 250; // a fake resize
        that.holderId.appendChild(image);*/
      };

      reader.readAsDataURL(file);
    }  else {
      this.holderId.innerHTML += '<p>Uploaded ' + file.name + ' ' + (file.size ? (file.size/1024|0) + 'K' : '');
      console.log(file);
    }
  }

  readfiles = (files) => {
    debugger;
    let formData = this.tests.formdata ? new FormData() : null;
    for (let i = 0; i < files.length; i++) {
      if (this.tests.formdata) formData.append('file', files[i]);
      this.previewfile(files[i]);
    }

    // now post a new XHR request
    if (this.tests.formdata) {
      let that = this;
      let xhr = new XMLHttpRequest();

      xhr.open('POST', '/devnull.php');
      xhr.onload = function() {
        //that.progress.value = that.progress.innerHTML = 100;
      };

      if (this.tests.progress) {
        xhr.upload.onprogress = function (event) {
          if (event.lengthComputable) {
            let complete = (event.loaded / event.total * 100 | 0);
            //that.progress.value = that.progress.innerHTML = complete;
          }
        }
      }

      xhr.send(formData);
    }
  }

  setHolderClass = (boolean) => {
    if(boolean) {
      this.holder = "holder";
      console.log(this.holder);
    } else {
      this.holder = "";
    }
  }

  setOnDrop = (event) => {
    this.holder = "holder";

    console.log(this.holder);
    /*event.preventDefault();

    this.readfiles(event.dataTransfer.files);*/
  }
}
