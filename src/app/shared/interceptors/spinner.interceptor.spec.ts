import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { SpinnerService } from '../services/spinner.service';
import { spinnerInterceptor } from './spinner.interceptor';

describe('SpinnerInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let spinnerService: jasmine.SpyObj<SpinnerService>;

  beforeEach(() => {
    const spinnerServiceSpy = jasmine.createSpyObj('SpinnerService', ['showLoadingBar', 'hideLoadingBar']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([spinnerInterceptor])),
        provideHttpClientTesting(),
        { provide: SpinnerService, useValue: spinnerServiceSpy }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    spinnerService = TestBed.inject(SpinnerService) as jasmine.SpyObj<SpinnerService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should show loading bar when request starts', () => {
    const testUrl = '/test';
    
    httpClient.get(testUrl).subscribe();
    
    // Verificar que se llamó showLoadingBar inmediatamente
    expect(spinnerService.showLoadingBar).toHaveBeenCalled();
    
    // Responder al request
    const req = httpMock.expectOne(testUrl);
    req.flush({});
  });

  it('should hide loading bar when request completes successfully', (done) => {
    const testUrl = '/test';
    
    httpClient.get(testUrl).subscribe({
      next: () => {
        // Verificar que se llamó hideLoadingBar después del delay
        setTimeout(() => {
          expect(spinnerService.hideLoadingBar).toHaveBeenCalled();
          done();
        }, 1800); // Un poco más que el delay del interceptor (1700ms)
      }
    });
    
    expect(spinnerService.showLoadingBar).toHaveBeenCalled();
    
    const req = httpMock.expectOne(testUrl);
    req.flush({ data: 'test' });
  });

  it('should hide loading bar when request fails', (done) => {
    const testUrl = '/test';
    
    httpClient.get(testUrl).subscribe({
      error: () => {
        // Verificar que se llamó hideLoadingBar incluso en error
        setTimeout(() => {
          expect(spinnerService.hideLoadingBar).toHaveBeenCalled();
          done();
        }, 1800);
      }
    });
    
    expect(spinnerService.showLoadingBar).toHaveBeenCalled();
    
    const req = httpMock.expectOne(testUrl);
    req.flush('Error occurred', { status: 500, statusText: 'Server Error' });
  });

  it('should call showLoadingBar and hideLoadingBar for multiple requests', () => {
    const testUrl1 = '/test1';
    const testUrl2 = '/test2';
    
    // Primera request
    httpClient.get(testUrl1).subscribe();
    expect(spinnerService.showLoadingBar).toHaveBeenCalledTimes(1);
    
    // Segunda request
    httpClient.get(testUrl2).subscribe();
    expect(spinnerService.showLoadingBar).toHaveBeenCalledTimes(2);
    
    // Responder a ambas requests
    const req1 = httpMock.expectOne(testUrl1);
    const req2 = httpMock.expectOne(testUrl2);
    
    req1.flush({});
    req2.flush({});
  });

  it('should apply delay to requests', (done) => {
    const testUrl = '/test';
    const startTime = Date.now();
    
    httpClient.get(testUrl).subscribe(() => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Verificar que el delay fue aplicado (al menos 1700ms)
      expect(duration).toBeGreaterThanOrEqual(1700);
      done();
    });
    
    const req = httpMock.expectOne(testUrl);
    req.flush({ data: 'test' });
  });

  it('should intercept different HTTP methods', () => {
    const testUrl = '/test';
    
    // GET request
    httpClient.get(testUrl).subscribe();
    expect(spinnerService.showLoadingBar).toHaveBeenCalledTimes(1);
    
    // POST request
    httpClient.post(testUrl, {}).subscribe();
    expect(spinnerService.showLoadingBar).toHaveBeenCalledTimes(2);
    
    // PUT request
    httpClient.put(testUrl, {}).subscribe();
    expect(spinnerService.showLoadingBar).toHaveBeenCalledTimes(3);
    
    // DELETE request
    httpClient.delete(testUrl).subscribe();
    expect(spinnerService.showLoadingBar).toHaveBeenCalledTimes(4);
    
    // Responder a todas las requests
    const requests = httpMock.match(() => true);
    requests.forEach(req => req.flush({}));
  });
});
