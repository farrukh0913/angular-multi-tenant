import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private messageService: MessageService) {}

  /**
   * Displays a warning message with a default "Warning" summary.
   * @param msg - The warning message to display.
   */
  showWarn = (msg: string) => {
    this.messageService.add({
      key: 'tst',
      severity: 'warn',
      summary: 'Warning',
      detail: msg,
    });
  };

  /**
   * Displays an error message with an optional custom summary.
   * @param msg - The error message to display.
   * @param summary - (Optional) Custom summary for the error message.
   */
  showError = (msg: string, summary?: string) => {
    this.messageService.add({
      key: 'tst',
      severity: 'error',
      summary: summary ? summary : 'Error',
      detail: msg,
    });
  };

  /**
   * Displays a success message with a custom summary.
   * @param msg - The success message to display.
   */
  showSuccess = (msg: string) => {
    this.messageService.add({
      key: 'tst',
      severity: 'success',
      summary: 'Success',
      detail: msg,
    });
  };

  /**
   * Displays an informational message with a default "Info" summary.
   * @param msg - The information message to display.
   */
  showInfo = (msg: string) => {
    this.messageService.add({
      key: 'tst',
      severity: 'info',
      summary: 'Info',
      detail: msg,
    });
  };
}
