import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-confirmation-dialogue',
  templateUrl: './confirmation-dialogue.component.html',
  styleUrl: './confirmation-dialogue.component.css'
})
export class ConfirmationDialogueComponent {

  constructor(public dialogueRef: MatDialogRef<ConfirmationDialogueComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogueRef.close();
  }

}
