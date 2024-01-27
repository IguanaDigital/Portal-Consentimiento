import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDateFormat]'
})
export class DateFormatDirective {

  constructor(private el: ElementRef) { }

  @HostListener('change', ['$event'])
  onChange(event: any) {
    const date = new Date(event.target.value);
    if (!isNaN(date.getTime())) {
      const formattedDate = ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2) + '/' + date.getFullYear();
      this.el.nativeElement.value = formattedDate;
    }
  }
}