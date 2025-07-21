import { TestBed } from '@angular/core/testing';
import { SpinnerService } from './spinner.service';

describe('SpinnerService', () => {
  let service: SpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with loading bar hidden', () => {
    expect(service._showLoadingBar()).toBe(false);
  });

  it('should show loading bar when showLoadingBar is called', () => {
    service.showLoadingBar();
    expect(service._showLoadingBar()).toBe(true);
  });

  it('should hide loading bar when hideLoadingBar is called', () => {
    // Primero mostramos el loading bar
    service.showLoadingBar();
    expect(service._showLoadingBar()).toBe(true);
    
    // Luego lo ocultamos
    service.hideLoadingBar();
    expect(service._showLoadingBar()).toBe(false);
  });

  it('should toggle loading bar state correctly', () => {
    // Estado inicial
    expect(service._showLoadingBar()).toBe(false);
    
    // Mostrar
    service.showLoadingBar();
    expect(service._showLoadingBar()).toBe(true);
    
    // Ocultar
    service.hideLoadingBar();
    expect(service._showLoadingBar()).toBe(false);
    
    // Mostrar nuevamente
    service.showLoadingBar();
    expect(service._showLoadingBar()).toBe(true);
  });

  it('should keep loading bar shown if showLoadingBar called multiple times', () => {
    service.showLoadingBar();
    service.showLoadingBar();
    service.showLoadingBar();
    
    expect(service._showLoadingBar()).toBe(true);
  });

  it('should keep loading bar hidden if hideLoadingBar called multiple times', () => {
    service.hideLoadingBar();
    service.hideLoadingBar();
    service.hideLoadingBar();
    
    expect(service._showLoadingBar()).toBe(false);
  });
});
