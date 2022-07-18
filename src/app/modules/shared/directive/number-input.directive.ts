import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNumberInput]',
})
export class NumberInputDirective {
  @Input() minValue: number;
  @Input() maxValue: number;

  constructor(private _el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const e = event;
    const initalValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');

    if (initalValue == 0) {
      this._el.nativeElement.value = '';
      return;
    }
    if (initalValue < this.minValue) {
      this._el.nativeElement.value = this.minValue;
    }
    if (initalValue > this.maxValue) {
      this._el.nativeElement.value = this.maxValue;
    }
  }
}
