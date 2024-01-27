import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDateInput]'
})
export class DateInputDirective {
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Delete'];
  private regex: RegExp = new RegExp(/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(\d{4})$/);

  @Output() dateCompleted = new EventEmitter<string>();

  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1 ||
    (event.keyCode >= 48 && event.keyCode <= 57) ||
    (event.keyCode >= 96 && event.keyCode <= 105)) {
  return;
}

    const current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 47) {
      event.preventDefault();
    } else {
      let next: string = current.slice(0, position) + event.key + current.slice(position);
      let parts = next.split('/');

      if (parts.length > 3 || (parts.length === 3 && parts[2].length > 4) || (parts.length > 1 && (parts[0].length > 2 || parts[1].length > 2))) {
        event.preventDefault();
      }
    }
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    const input = this.el.nativeElement;
    const value = input.value;
    let parts = value.split('/').filter(part => part !== '');
    let formattedDate = '';

    for (let i = 0; i < parts.length; i++) {
      if (i === 0) {
        formattedDate += parts[i].length < 2 ? parts[i] : parts[i].slice(0, 2) + '/';
      } else if (i === 1) {
        formattedDate += parts[i].length < 2 ? parts[i] : parts[i].slice(0, 2) + '/';
      } else if (i === 2) {
        formattedDate += parts[i].slice(0, 4);
      }
    }

    input.value = formattedDate;

    if (this.regex.test(input.value)) {
      this.dateCompleted.emit(input.value);
    }
  }
}