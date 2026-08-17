import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmationDialogueComponent } from '../confirmation-dialogue/confirmation-dialogue.component';

/**
 * Centralizes the confirm-dialog boilerplate that was previously duplicated across components. Emits `true` when the user confirms, `false`/`undefined` otherwise.
 */
@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  constructor(private dialog: MatDialog) {}

  confirm(message: string, title = 'Please confirm'): Observable<boolean> {
    return this.dialog
      .open(ConfirmationDialogueComponent, {
        width: '320px',
        maxWidth: '90vw',
        data: { message, title },
      })
      .afterClosed();
  }
}
