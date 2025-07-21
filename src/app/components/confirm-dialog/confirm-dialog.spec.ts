import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  const mockData = { name: 'Spider-Man' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ConfirmDialogComponent,
        MatDialogModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive data correctly', () => {
    expect(component.data).toEqual(mockData);
    expect(component.data.name).toBe('Spider-Man');
  });

  it('should display hero name in template', () => {
    const compiled = fixture.nativeElement;
    const heroNameElement = compiled.querySelector('strong');
    
    expect(heroNameElement?.textContent).toContain('Spider-Man');
  });

  it('should display confirmation title', () => {
    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('h2');
    
    expect(titleElement?.textContent).toContain('¿Estás seguro?');
  });

  it('should display confirmation message', () => {
    const compiled = fixture.nativeElement;
    const messageElement = compiled.querySelector('mat-dialog-content p');
    
    expect(messageElement?.textContent).toContain('¿Querés eliminar a');
    expect(messageElement?.textContent).toContain('Spider-Man');
  });

  it('should have cancel button', () => {
    const compiled = fixture.nativeElement;
    const cancelButton = compiled.querySelector('button[mat-stroked-button]');
    
    expect(cancelButton).toBeTruthy();
    expect(cancelButton?.textContent?.trim()).toBe('Cancelar');
  });

  it('should have delete button', () => {
    const compiled = fixture.nativeElement;
    const deleteButton = compiled.querySelector('button[color="warn"]');
    
    expect(deleteButton).toBeTruthy();
    expect(deleteButton?.textContent?.trim()).toBe('Eliminar');
  });

  it('should have mat-dialog-close directive on cancel button', () => {
    const compiled = fixture.nativeElement;
    const cancelButton = compiled.querySelector('button[mat-dialog-close]');
    
    expect(cancelButton).toBeTruthy();
  });

  it('should have delete button with correct color', () => {
    const compiled = fixture.nativeElement;
    const deleteButton = compiled.querySelector('button[color="warn"]');
    
    expect(deleteButton).toBeTruthy();
    expect(deleteButton.textContent?.trim()).toBe('Eliminar');
  });

  it('should handle data with different hero names', () => {
    component.data = { name: 'Batman' };
    fixture.detectChanges();
    
    const heroNameElement = fixture.nativeElement.querySelector('strong');
    expect(heroNameElement?.textContent).toContain('Batman');
  });

  it('should handle empty name gracefully', () => {
    component.data = { name: '' };
    fixture.detectChanges();
    
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
