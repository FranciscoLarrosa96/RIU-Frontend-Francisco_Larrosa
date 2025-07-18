import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Detail } from './detail';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroService } from '../../../core/hero.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Hero } from '../../../interfaces/hero.interface';
import { RouterTestingModule } from '@angular/router/testing';


const mockHero: Hero = {
  id: 1,
  name: 'Spider-Man',
  alias: 'Peter Parker',
  superpowers: ['Super strength', 'Web shooting', 'Spider sense'],
  universe: 'marvel',
  active: true
};


const mockActivatedRoute = {
  snapshot: {
    paramMap: {
      get: jasmine.createSpy('get').and.returnValue('1')
    }
  }
};


const mockRouter = {
  navigate: jasmine.createSpy('navigate')
};


const mockHeroService = {
  getHeroById: jasmine.createSpy('getHeroById').and.returnValue(of(mockHero))
};

describe('Detail', () => {
  let component: Detail;
  let fixture: ComponentFixture<Detail>;
  let heroService: jasmine.SpyObj<HeroService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Detail, RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: HeroService, useValue: mockHeroService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Detail);
    component = fixture.componentInstance;
    heroService = TestBed.inject(HeroService) as jasmine.SpyObj<HeroService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute);
    
    
    mockRouter.navigate.calls.reset();
    mockHeroService.getHeroById.calls.reset();
    mockActivatedRoute.snapshot.paramMap.get.calls.reset();
    
    
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('1');
    mockHeroService.getHeroById.and.returnValue(of(mockHero));
  });

  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize hero on ngOnInit', () => {
    component.ngOnInit();
    expect(mockActivatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith('id');
    expect(mockHeroService.getHeroById).toHaveBeenCalledWith(1);
    expect(component.hero).toEqual(mockHero);
  });

 
  it('should navigate to home when hero is not found', () => {
    mockHeroService.getHeroById.and.returnValue(of(undefined));
    
    component.ngOnInit();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should not navigate when hero is found', () => {
    mockHeroService.getHeroById.and.returnValue(of(mockHero));
    
    component.ngOnInit();
    
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

 
  describe('Template rendering', () => {
    beforeEach(() => {
      component.hero = mockHero;
      fixture.detectChanges();
    });

    it('should display hero name', () => {
      const nameElement = fixture.debugElement.query(By.css('h2'));
      expect(nameElement.nativeElement.textContent).toBe('Spider-Man');
    });

    it('should display hero alias', () => {
      const aliasElement = fixture.debugElement.query(By.css('p.italic'));
      expect(aliasElement.nativeElement.textContent).toContain('Peter Parker');
    });

    it('should display hero universe', () => {
      const universeElement = fixture.debugElement.query(By.css('p.uppercase'));
      expect(universeElement.nativeElement.textContent.trim()).toBe('marvel');
    });

    it('should display active status correctly', () => {
      const statusElement = fixture.debugElement.query(By.css('.text-green-600, .text-red-600'));
      expect(statusElement.nativeElement.textContent).toContain('Activo');
      expect(statusElement.nativeElement).toHaveClass('text-green-600');
    });

    it('should display inactive status correctly', () => {
      component.hero = { ...mockHero, active: false };
      fixture.detectChanges();
      
      const statusElement = fixture.debugElement.query(By.css('.text-red-600'));
      expect(statusElement.nativeElement.textContent).toContain('Inactivo');
    });

    it('should display all superpowers', () => {
      const powerElements = fixture.debugElement.queryAll(By.css('li'));
      expect(powerElements.length).toBe(3);
      expect(powerElements[0].nativeElement.textContent).toBe('Super strength');
      expect(powerElements[1].nativeElement.textContent).toBe('Web shooting');
      expect(powerElements[2].nativeElement.textContent).toBe('Spider sense');
    });

    it('should display back button with correct router link', () => {
      const backButton = fixture.debugElement.query(By.css('button[routerLink]'));
      expect(backButton).toBeTruthy();
      expect(backButton.nativeElement.getAttribute('routerLink')).toBe('/');
      expect(backButton.nativeElement.textContent.trim()).toBe('Volver');
    });

    it('should have correct section styling', () => {
      const section = fixture.debugElement.query(By.css('section'));
      expect(section.nativeElement.getAttribute('data-aos')).toBe('zoom-in');
    });
  });

  
  describe('Component behavior', () => {
    it('should handle different hero IDs from route params', () => {
      mockActivatedRoute.snapshot.paramMap.get.and.returnValue('42');
      
      component.ngOnInit();
      
      expect(mockHeroService.getHeroById).toHaveBeenCalledWith(42);
    });

    it('should handle invalid ID from route params', () => {
      mockActivatedRoute.snapshot.paramMap.get.and.returnValue('invalid');
      
      component.ngOnInit();
      
      expect(mockHeroService.getHeroById).toHaveBeenCalledWith(NaN);
    });

    it('should handle null ID from route params', () => {
      mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);
      
      component.ngOnInit();
      
      expect(mockHeroService.getHeroById).toHaveBeenCalledWith(0);
    });
  });

  
  describe('Conditional rendering', () => {
    it('should handle undefined hero in component', () => {
      component.hero = undefined;
      
      expect(component.hero).toBeUndefined();
    });

    it('should render all sections when hero is present', () => {
      component.hero = mockHero;
      fixture.detectChanges();
      
      const nameSection = fixture.debugElement.query(By.css('h2'));
      const aliasSection = fixture.debugElement.query(By.css('p.italic'));
      const universeSection = fixture.debugElement.query(By.css('p.uppercase'));
      const statusSection = fixture.debugElement.query(By.css('.text-green-600, .text-red-600'));
      const powersSection = fixture.debugElement.query(By.css('h3'));
      const backButton = fixture.debugElement.query(By.css('button'));
      
      expect(nameSection).toBeTruthy();
      expect(aliasSection).toBeTruthy();
      expect(universeSection).toBeTruthy();
      expect(statusSection).toBeTruthy();
      expect(powersSection).toBeTruthy();
      expect(backButton).toBeTruthy();
    });
  });
});
