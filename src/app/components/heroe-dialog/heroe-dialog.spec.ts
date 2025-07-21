import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HeroDialogComponent } from './heroe-dialog';
import { MaterialDesignModule } from '../../shared/material/material-design.module';
import { UppercaseDirective } from '../../shared/directives/uppercase.directive';
import { SpinnerService } from '../../shared/services/spinner.service';
import { Hero } from '../../interfaces/hero.interface';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

describe('HeroDialogComponent', () => {
  let component: HeroDialogComponent;
  let fixture: ComponentFixture<HeroDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<HeroDialogComponent>>;
  let spinnerService: jasmine.SpyObj<SpinnerService>;

  const mockHero: Hero = {
    id: 1,
    name: 'Spider-Man',
    alias: 'Peter Parker',
    universe: 'marvel',
    superpowers: ['Web-slinging', 'Spider-sense'],
    active: true
  };

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    const spinnerServiceSpy = jasmine.createSpyObj('SpinnerService', ['showLoadingBar', 'hideLoadingBar'], {
      _showLoadingBar: jasmine.createSpy().and.returnValue(false)
    });

    await TestBed.configureTestingModule({
      imports: [
        HeroDialogComponent,
        ReactiveFormsModule,
        MaterialDesignModule,
        UppercaseDirective
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: SpinnerService, useValue: spinnerServiceSpy },
        { provide: MAT_DIALOG_DATA, useValue: null }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<HeroDialogComponent>>;
    spinnerService = TestBed.inject(SpinnerService) as jasmine.SpyObj<SpinnerService>;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values when no data provided', () => {
    expect(component.form.value).toEqual({
      id: null,
      name: '',
      alias: '',
      universe: 'marvel',
      superpowers: [],
      active: true
    });
  });

  it('should initialize form with provided data when editing', async () => {
    // Recrear el componente con datos
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [
        HeroDialogComponent,
        ReactiveFormsModule,
        MaterialDesignModule,
        UppercaseDirective
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: SpinnerService, useValue: spinnerService },
        { provide: MAT_DIALOG_DATA, useValue: mockHero }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.form.value.id).toBe(mockHero.id);
    expect(component.form.value.name).toBe(mockHero.name);
    expect(component.form.value.alias).toBe(mockHero.alias);
    expect(component.form.value.universe).toBe(mockHero.universe);
    expect(component.powers).toEqual(mockHero.superpowers);
  });

  it('should have required validators on form fields', () => {
    const nameControl = component.form.get('name');
    const aliasControl = component.form.get('alias');
    const universeControl = component.form.get('universe');

    nameControl?.setValue('');
    aliasControl?.setValue('');
    universeControl?.setValue('');

    expect(nameControl?.hasError('required')).toBe(true);
    expect(aliasControl?.hasError('required')).toBe(true);
    expect(universeControl?.hasError('required')).toBe(true);
  });

  it('should add power to powers array', () => {
    const mockEvent: MatChipInputEvent = {
      value: 'Flight',
      input: document.createElement('input'),
      chipInput: {
        clear: jasmine.createSpy('clear')
      } as any
    };

    component.addPower(mockEvent);

    expect(component.powers).toContain('Flight');
    expect(mockEvent.chipInput.clear).toHaveBeenCalled();
  });

  it('should not add empty or whitespace-only power', () => {
    const mockEvent: MatChipInputEvent = {
      value: '   ',
      input: document.createElement('input'),
      chipInput: {
        clear: jasmine.createSpy('clear')
      } as any
    };

    const initialLength = component.powers.length;
    component.addPower(mockEvent);

    expect(component.powers.length).toBe(initialLength);
    expect(mockEvent.chipInput.clear).toHaveBeenCalled();
  });

  it('should remove power from powers array', () => {
    component.powers = ['Flight', 'Super Strength', 'Heat Vision'];
    
    component.removePower('Super Strength');

    expect(component.powers).toEqual(['Flight', 'Heat Vision']);
  });

  it('should not fail when trying to remove non-existent power', () => {
    component.powers = ['Flight'];
    
    expect(() => component.removePower('Non-existent')).not.toThrow();
    expect(component.powers).toEqual(['Flight']);
  });

  it('should close dialog without data when closeDialog is called', () => {
    component.closeDialog();

    expect(dialogRef.close).toHaveBeenCalledWith();
  });

  it('should save hero when form is valid', () => {
    component.form.patchValue({
      name: 'Batman',
      alias: 'Bruce Wayne',
      universe: 'dc',
      active: true
    });
    component.powers = ['Rich', 'Detective'];

    component.save();

    expect(dialogRef.close).toHaveBeenCalledWith({
      id: null,
      name: 'Batman',
      alias: 'Bruce Wayne',
      universe: 'dc',
      superpowers: ['Rich', 'Detective'],
      active: true
    });
  });

  it('should not save when form is invalid', () => {
    component.form.patchValue({
      name: '', // Required field empty
      alias: 'Bruce Wayne',
      universe: 'dc'
    });

    component.save();

    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should have correct separator key codes', () => {
    expect(component.separatorKeysCodes).toEqual([ENTER, COMMA]);
  });

  it('should access spinner service correctly', () => {
    expect(component.spinnerSvc).toBeTruthy();
    component.spinnerSvc._showLoadingBar();
    expect(spinnerService._showLoadingBar).toHaveBeenCalled();
  });

  it('should display correct title for creating hero', () => {
    component.data = undefined;
    fixture.detectChanges();
    
    const titleElement = fixture.nativeElement.querySelector('h2');
    expect(titleElement?.textContent).toContain('Crear Héroe');
  });

  it('should display correct title for editing hero', async () => {
    // Recrear componente con datos
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [
        HeroDialogComponent,
        ReactiveFormsModule,
        MaterialDesignModule,
        UppercaseDirective
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: SpinnerService, useValue: spinnerService },
        { provide: MAT_DIALOG_DATA, useValue: mockHero }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    const titleElement = fixture.nativeElement.querySelector('h2');
    expect(titleElement?.textContent).toContain('Editar Héroe');
  });
});
