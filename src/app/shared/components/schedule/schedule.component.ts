import { Component, Input, OnInit } from '@angular/core';
import { MdDialog, MdDialogClose } from '@angular/material';

/*Components*/
import { ScheduleDialogComponent } from './../schedule-dialog/schedule-dialog.component';

@Component({
  selector: 'bonamondo-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  @Input() view: string;

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
      ScheduleDialogComponent,
      {
        data: {
          dialogText: this.view['dialogText'],
          dragAndDropText: "Arraste o arquivo para cá"
        },
        height: '380px',
        width: '600px'
      }
    );
  }
}
