import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Component, Inject} from "@angular/core";

export interface DialogData {
  room_title: string;
  client_name: string;
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './add-room.component.html',
})
export class AddRoomDialog {

  constructor(
    public dialogRef: MatDialogRef<AddRoomDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    // console.log(this.data)
    this.dialogRef.close();
  }

}
