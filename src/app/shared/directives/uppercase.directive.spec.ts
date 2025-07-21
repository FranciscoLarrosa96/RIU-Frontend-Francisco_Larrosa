import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { UppercaseDirective } from './uppercase.directive';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, UppercaseDirective],
  template: `
    <input appUppercase [formControl]="control" data-testid="input-with-directive">
    <input appUppercase data-testid="input-without-formcontrol">
  `
})
class TestComponent {
  control = new FormControl('');
}

describe('UppercaseDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputWithFormControl: DebugElement;
  let inputWithoutFormControl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    inputWithFormControl = fixture.debugElement.query(By.css('[data-testid="input-with-directive"]'));
    inputWithoutFormControl = fixture.debugElement.query(By.css('[data-testid="input-without-formcontrol"]'));
  });

  it('should create directive', () => {
    expect(inputWithFormControl).toBeTruthy();
    expect(inputWithoutFormControl).toBeTruthy();
  });

  it('should transform input to uppercase on input event with FormControl', () => {
    const inputElement = inputWithFormControl.nativeElement as HTMLInputElement;
    
    // Simular escritura
    inputElement.value = 'hello world';
    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    
    expect(inputElement.value).toBe('HELLO WORLD');
    expect(component.control.value).toBe('HELLO WORLD');
  });

  it('should transform input to uppercase on input event without FormControl', () => {
    const inputElement = inputWithoutFormControl.nativeElement as HTMLInputElement;
    
    // Simular escritura
    inputElement.value = 'hello world';
    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    
    expect(inputElement.value).toBe('HELLO WORLD');
  });

  it('should transform input to uppercase on blur event', () => {
    const inputElement = inputWithFormControl.nativeElement as HTMLInputElement;
    
    // Simular escritura y blur
    inputElement.value = 'test blur';
    inputElement.dispatchEvent(new Event('blur', { bubbles: true }));
    
    expect(inputElement.value).toBe('TEST BLUR');
    expect(component.control.value).toBe('TEST BLUR');
  });

  it('should transform input to uppercase on change event', () => {
    const inputElement = inputWithFormControl.nativeElement as HTMLInputElement;
    
    // Simular cambio
    inputElement.value = 'test change';
    inputElement.dispatchEvent(new Event('change', { bubbles: true }));
    
    expect(inputElement.value).toBe('TEST CHANGE');
    expect(component.control.value).toBe('TEST CHANGE');
  });

  it('should handle paste event with timeout', (done) => {
    const inputElement = inputWithFormControl.nativeElement as HTMLInputElement;
    
    // Simular paste
    inputElement.value = 'pasted text';
    inputElement.dispatchEvent(new Event('paste', { bubbles: true }));
    
    // Esperar el timeout
    setTimeout(() => {
      expect(inputElement.value).toBe('PASTED TEXT');
      expect(component.control.value).toBe('PASTED TEXT');
      done();
    }, 10);
  });

  it('should maintain cursor position after transformation', () => {
    const inputElement = inputWithFormControl.nativeElement as HTMLInputElement;
    
    // Establecer valor y posición del cursor
    inputElement.value = 'hello';
    inputElement.setSelectionRange(2, 3);
    
    // Simular input
    inputElement.value = 'hello world';
    inputElement.setSelectionRange(5, 6);
    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    
    expect(inputElement.value).toBe('HELLO WORLD');
    expect(inputElement.selectionStart).toBe(5);
    expect(inputElement.selectionEnd).toBe(6);
  });

  it('should not update if value is already uppercase', () => {
    const inputElement = inputWithFormControl.nativeElement as HTMLInputElement;
    
    // Establecer valor en mayúsculas desde el principio
    inputElement.value = 'ALREADY UPPERCASE';
    
    // Simular input - la directiva debería detectar que ya está en mayúsculas
    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    
    // El valor debe seguir siendo el mismo
    expect(inputElement.value).toBe('ALREADY UPPERCASE');
  });

  it('should handle null selection range gracefully', () => {
    const inputElement = inputWithFormControl.nativeElement as HTMLInputElement;
    
    // Mock getSelection to return null
    Object.defineProperty(inputElement, 'selectionStart', { value: null });
    Object.defineProperty(inputElement, 'selectionEnd', { value: null });
    
    inputElement.value = 'test null selection';
    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    
    expect(inputElement.value).toBe('TEST NULL SELECTION');
    expect(component.control.value).toBe('TEST NULL SELECTION');
  });
});
