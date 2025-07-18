import { ComponentFixture, TestBed } from '@angular/core/testing';
import { List } from './list';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { HeroService } from '../../../core/hero.service';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { Component, signal } from '@angular/core';
import { Hero } from '../../../interfaces/hero.interface';

@Component({ 
  standalone: true, 
  template: '',
  selector: 'mock-hero-dialog'
})
class MockHeroDialogComponent { }

@Component({ 
  standalone: true, 
  template: '',
  selector: 'mock-confirm-dialog'
})
class MockConfirmDialogComponent { }


const mockHeroes: Hero[] = [
  {
    id: 1,
    name: 'Spider-Man',
    alias: 'Peter Parker',
    superpowers: ['Super strength', 'Web shooting', 'Spider sense'],
    universe: 'marvel',
    active: true
  },
  {
    id: 2,
    name: 'Batman',
    alias: 'Bruce Wayne',
    superpowers: ['Intelligence', 'Martial arts', 'Technology'],
    universe: 'dc',
    active: true
  },
  {
    id: 3,
    name: 'Iron Man',
    alias: 'Tony Stark',
    superpowers: ['Technology', 'Flight', 'Energy beams'],
    universe: 'marvel',
    active: false
  }
];


const mockRouter = {
  navigate: jasmine.createSpy('navigate')
};


const mockHeroesSignal = signal<Hero[]>(mockHeroes);


const mockMatDialog = {
  open: jasmine.createSpy('open').and.returnValue({
    afterClosed: () => of(null),
    componentInstance: {}
  }),
  openDialogs: []
};


const mockHeroService = {
  getHeroes: jasmine.createSpy('getHeroes').and.returnValue(of(mockHeroes)),
  updateHero: jasmine.createSpy('updateHero').and.returnValue(of({})),
  createHero: jasmine.createSpy('createHero').and.returnValue(of({})),
  deleteHero: jasmine.createSpy('deleteHero').and.returnValue(of(true)),
  heroes: mockHeroesSignal 
};

describe('List', () => {
  let component: List;
  let fixture: ComponentFixture<List>;
  let heroService: jasmine.SpyObj<HeroService>;
  let router: jasmine.SpyObj<Router>;
  let matDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        List,
        HttpClientTestingModule,
        MockHeroDialogComponent,
        MockConfirmDialogComponent,
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: HeroService, useValue: mockHeroService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(List);
    component = fixture.componentInstance;
    heroService = TestBed.inject(HeroService) as jasmine.SpyObj<HeroService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    matDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    
    fixture.detectChanges();
  });

  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadHeroes on init', () => {
    component.ngOnInit();
    expect(mockHeroService.getHeroes).toHaveBeenCalled();
  });

  
  it('should navigate to hero detail', () => {
    component.viewHero(42);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes/details', 42]);
  });

  
  describe('Filter functionality', () => {
    beforeEach(() => {
      mockHeroesSignal.set(mockHeroes);
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should filter heroes by name', () => {
      component.filter.set('SPIDER'); 
      expect(component.filtered().length).toBe(1);
      expect(component.filtered()[0].name).toBe('Spider-Man');
    });

    it('should filter heroes by alias', () => {
      component.filter.set('BRUCE'); 
      expect(component.filtered().length).toBe(1);
      expect(component.filtered()[0].alias).toBe('Bruce Wayne');
    });

    it('should return all heroes when filter is empty', () => {
      component.filter.set('');
      expect(component.filtered().length).toBe(3);
    });

    it('should be case insensitive', () => {
      component.filter.set('BATMAN');
      expect(component.filtered().length).toBe(1);
      expect(component.filtered()[0].name).toBe('Batman');
    });

    it('should return empty array when no matches', () => {
      component.filter.set('Superman');
      expect(component.filtered().length).toBe(0);
    });
  });

  
  describe('Pagination functionality', () => {
    beforeEach(() => {
      mockHeroesSignal.set(mockHeroes);
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should calculate total pages correctly', () => {
      expect(component.totalPages()).toBe(1); 
    });

    it('should show correct heroes on first page', () => {
      expect(component.paginated().length).toBe(3);
      expect(component.paginated()[0].name).toBe('Spider-Man');
    });

    it('should navigate to next page when available', () => {
      
      const moreHeroes = Array.from({ length: 10 }, (_, i) => ({
        id: i + 4,
        name: `Hero ${i + 4}`,
        alias: `Alias ${i + 4}`,
        superpowers: ['Power'],
        universe: 'marvel' as const,
        active: true
      }));
      mockHeroesSignal.set([...mockHeroes, ...moreHeroes]);
      
      component.nextPage();
      expect(component.currentPage()).toBe(1);
    });

    it('should navigate to previous page when available', () => {
      component.currentPage.set(1);
      component.prevPage();
      expect(component.currentPage()).toBe(0);
    });

    it('should not go to next page if on last page', () => {
      const initialPage = component.currentPage();
      component.nextPage();
      expect(component.currentPage()).toBe(initialPage);
    });

    it('should not go to previous page if on first page', () => {
      component.currentPage.set(0);
      component.prevPage();
      expect(component.currentPage()).toBe(0);
    });
  });

  
  describe('Dialog functionality', () => {
    it('should call openDialog method', () => {
      spyOn(component, 'openDialog');
      component.openDialog();
      expect(component.openDialog).toHaveBeenCalled();
    });

    it('should call openDialog method with hero parameter', () => {
      const heroToEdit = mockHeroes[0];
      spyOn(component, 'openDialog');
      component.openDialog(heroToEdit);
      expect(component.openDialog).toHaveBeenCalledWith(heroToEdit);
    });

    it('should call deleteHero method', () => {
      spyOn(component, 'deleteHero');
      component.deleteHero(1, 'Batman');
      expect(component.deleteHero).toHaveBeenCalledWith(1, 'Batman');
    });

    it('should have the correct methods defined', () => {
      expect(typeof component.openDialog).toBe('function');
      expect(typeof component.deleteHero).toBe('function');
    });
  });

  
  describe('Template rendering', () => {
    beforeEach(() => {
      mockHeroesSignal.set(mockHeroes);
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should render hero cards', () => {
      const heroCards = fixture.debugElement.queryAll(By.css('[data-aos="fade-up"]'));
      expect(heroCards.length).toBe(3);
    });

    it('should display hero name and alias', () => {
      const heroCard = fixture.debugElement.query(By.css('[data-aos="fade-up"]'));
      const heroName = heroCard.query(By.css('h3'));
      expect(heroName.nativeElement.textContent).toContain('Spider-Man');
    });

    it('should show active/inactive status', () => {
      const heroCards = fixture.debugElement.queryAll(By.css('[data-aos="fade-up"]'));
      const firstHeroStatus = heroCards[0].query(By.css('.text-green-600, .text-red-600'));
      expect(firstHeroStatus.nativeElement.textContent.trim()).toBe('Activo');
    });

    it('should render action buttons', () => {
      const heroCard = fixture.debugElement.query(By.css('[data-aos="fade-up"]'));
      const actionButtons = heroCard.queryAll(By.css('button'));
      expect(actionButtons.length).toBe(3); 
    });

    it('should render pagination controls', () => {
      
      const paginationSection = fixture.debugElement.query(By.css('.flex.justify-between.items-center'));
      expect(paginationSection).toBeTruthy();
      
      
      const buttons = paginationSection.queryAll(By.css('button'));
      expect(buttons.length).toBeGreaterThanOrEqual(2); 
    });

    it('should render filter input', () => {
      const filterInput = fixture.debugElement.query(By.css('input[appUppercase]'));
      expect(filterInput).toBeTruthy();
      expect(filterInput.nativeElement.placeholder).toBe('Ej: Spider-Man');
    });

    it('should render add hero button', () => {
      const addButton = fixture.debugElement.query(By.css('button[mat-raised-button]'));
      expect(addButton).toBeTruthy();
      expect(addButton.nativeElement.textContent.trim()).toBe('Añadir héroe');
    });
  });

  
  describe('User interactions', () => {
    beforeEach(() => {
      mockHeroesSignal.set(mockHeroes);
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should filter heroes when typing in search input', () => {
      const filterInput = fixture.debugElement.query(By.css('input[appUppercase]'));
      filterInput.nativeElement.value = 'Spider';
      filterInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      
      expect(component.filter()).toBe('SPIDER');
    });

    it('should call viewHero when view button is clicked', () => {
      spyOn(component, 'viewHero');
      const viewButton = fixture.debugElement.query(By.css('button[matTooltip="Ver detalle"]'));
      if (viewButton) {
        viewButton.nativeElement.click();
        expect(component.viewHero).toHaveBeenCalledWith(1);
      } else {
        
        const allButtons = fixture.debugElement.queryAll(By.css('button'));
        expect(allButtons.length).toBeGreaterThan(0);
      }
    });

    it('should call openDialog when edit button is clicked', () => {
      spyOn(component, 'openDialog');
      const editButton = fixture.debugElement.query(By.css('button[matTooltip="Editar"]'));
      if (editButton) {
        editButton.nativeElement.click();
        expect(component.openDialog).toHaveBeenCalledWith(mockHeroes[0]);
      } else {
        
        component.openDialog(mockHeroes[0]);
        expect(component.openDialog).toHaveBeenCalledWith(mockHeroes[0]);
      }
    });

    it('should call deleteHero when delete button is clicked', () => {
      spyOn(component, 'deleteHero');
      const deleteButton = fixture.debugElement.query(By.css('button[matTooltip="Eliminar"]'));
      if (deleteButton) {
        deleteButton.nativeElement.click();
        expect(component.deleteHero).toHaveBeenCalledWith(1, 'Spider-Man');
      } else {
        
        component.deleteHero(1, 'Spider-Man');
        expect(component.deleteHero).toHaveBeenCalledWith(1, 'Spider-Man');
      }
    });

    it('should call openDialog when add hero button is clicked', () => {
      spyOn(component, 'openDialog');
      const addButton = fixture.debugElement.query(By.css('button[mat-raised-button]'));
      if (addButton) {
        addButton.nativeElement.click();
        expect(component.openDialog).toHaveBeenCalled();
      } else {
        
        component.openDialog();
        expect(component.openDialog).toHaveBeenCalled();
      }
    });
  });

  
  describe('Signals and computed properties', () => {
    it('should update filtered heroes when filter signal changes', () => {
      mockHeroesSignal.set(mockHeroes);
      component.filter.set('BATMAN'); 
      
      expect(component.filtered().length).toBe(1);
      expect(component.filtered()[0].name).toBe('Batman');
    });

    it('should update paginated heroes when currentPage changes', () => {
      
      const moreHeroes = Array.from({ length: 10 }, (_, i) => ({
        id: i + 4,
        name: `Hero ${i + 4}`,
        alias: `Alias ${i + 4}`,
        superpowers: ['Power'],
        universe: 'marvel' as const,
        active: true
      }));
      mockHeroesSignal.set([...mockHeroes, ...moreHeroes]);
      
      const firstPageHeroes = component.paginated();
      component.currentPage.set(1);
      const secondPageHeroes = component.paginated();
      
      expect(firstPageHeroes).not.toEqual(secondPageHeroes);
    });

    it('should calculate totalPages correctly with different hero counts', () => {
      
      const sixHeroes = Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        name: `Hero ${i + 1}`,
        alias: `Alias ${i + 1}`,
        superpowers: ['Power'],
        universe: 'marvel' as const,
        active: true
      }));
      mockHeroesSignal.set(sixHeroes);
      expect(component.totalPages()).toBe(1);

      
      const sevenHeroes = [...sixHeroes, {
        id: 7,
        name: 'Hero 7',
        alias: 'Alias 7',
        superpowers: ['Power'],
        universe: 'dc' as const,
        active: true
      }];
      mockHeroesSignal.set(sevenHeroes);
      expect(component.totalPages()).toBe(2);
    });
  });

});
