import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmationDialogData {
  message: string;
  title?: string;
}

@Component({
  selector: 'app-confirmation-dialogue',
  templateUrl: './confirmation-dialogue.component.html',
  styleUrl: './confirmation-dialogue.component.css',
})
export class ConfirmationDialogueComponent {
  constructor(
    public dialogueRef: MatDialogRef<ConfirmationDialogueComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {}

  onNoClick(): void {
    this.dialogueRef.close(false);
  }
}
