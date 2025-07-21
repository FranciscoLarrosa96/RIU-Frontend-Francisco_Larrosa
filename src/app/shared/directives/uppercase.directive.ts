import { Directive, HostListener, ElementRef, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]'
})
export class UppercaseDirective {
  constructor(
    private el: ElementRef,
    @Optional() private ngControl: NgControl
  ) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    this.transformToUppercase(event);
  }

  @HostListener('blur', ['$event'])
  onBlur(event: Event): void {
    this.transformToUppercase(event);
  }

  @HostListener('change', ['$event'])
  onChange(event: Event): void {
    this.transformToUppercase(event);
  }

  @HostListener('paste', ['$event'])
  onPaste(event: Event): void {
    // Pequeño delay para que el paste se complete antes de transformar
    setTimeout(() => {
      this.transformToUppercase(event);
    }, 0);
  }

  private transformToUppercase(event: Event): void {
    const input = event.target as HTMLInputElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    const upperCaseValue = input.value.toUpperCase();
    
    // Solo actualizar si el valor cambió para evitar loops infinitos
    if (input.value !== upperCaseValue) {
      input.value = upperCaseValue;
      this.el.nativeElement.value = upperCaseValue;

      // Actualizar el FormControl si existe
      if (this.ngControl && this.ngControl.control) {
        this.ngControl.control.setValue(upperCaseValue, { emitEvent: false });
      }

      // Mantener posición del cursor
      if (start !== null && end !== null) {
        input.setSelectionRange(start, end);
      }
    }
  }
}
