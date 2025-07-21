import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { HeroService } from './hero.service';
import { Hero } from '../interfaces/hero.interface';

describe('HeroService', () => {
    let service: HeroService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [HeroService, provideHttpClient(), provideHttpClientTesting()]
        });

        service = TestBed.inject(HeroService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify(); // Verifica que no haya requests colgados
    });

    it('debería instanciar el servicio', () => {
        expect(service).toBeTruthy();
    });

    it('debería obtener héroes (getHeroes)', () => {
        const mockHeroes: Hero[] = [
            { id: 1, name: 'Peter Parker', alias: 'Spider-Man', universe: 'marvel', superpowers: ['Telarañas'], active: true },
            { id: 2, name: 'Clark Kent', alias: 'Superman', universe: 'dc', superpowers: ['Vuelo'], active: true }
        ];

        service.getHeroes().subscribe((heroes) => {
            expect(heroes.length).toBe(2);
            expect(heroes).toEqual(mockHeroes);
        });

        const req = httpMock.expectOne('/assets/heroes.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockHeroes);
    });

    it('debería crear un nuevo héroe (createHero)', () => {
        const mockHero: Omit<Hero, 'id'> = {
            name: 'Bruce Wayne',
            alias: 'Batman',
            universe: 'dc',
            superpowers: ['Dinero', 'Detective'],
            active: true
        };

        const createdHero: Hero = { ...mockHero, id: 1 };

        service.createHero(mockHero).subscribe((hero: Hero) => {
            expect(hero).toEqual(createdHero);
            expect(hero.id).toBe(1);
        });

        // Verificar que se agregó al signal
        expect(service.heroes().length).toBe(1);
        expect(service.heroes()[0]).toEqual(createdHero);
    });

    it('debería obtener un héroe por ID (getHeroById)', () => {
        const mockHeroes: Hero[] = [
            { id: 1, name: 'Peter Parker', alias: 'Spider-Man', universe: 'marvel', superpowers: ['Telarañas'], active: true },
            { id: 2, name: 'Clark Kent', alias: 'Superman', universe: 'dc', superpowers: ['Vuelo'], active: true }
        ];

        // Primero cargamos los héroes
        service.getHeroes().subscribe();
        const req = httpMock.expectOne('/assets/heroes.json');
        req.flush(mockHeroes);

        // Luego buscamos uno específico
        service.getHeroById(1).subscribe((hero) => {
            expect(hero).toEqual(mockHeroes[0]);
        });
    });

    it('debería retornar undefined para un ID inexistente (getHeroById)', () => {
        const mockHeroes: Hero[] = [
            { id: 1, name: 'Peter Parker', alias: 'Spider-Man', universe: 'marvel', superpowers: ['Telarañas'], active: true }
        ];

        // Primero cargamos los héroes
        service.getHeroes().subscribe();
        const req = httpMock.expectOne('/assets/heroes.json');
        req.flush(mockHeroes);

        // Buscamos un ID que no existe
        service.getHeroById(999).subscribe((hero) => {
            expect(hero).toBeUndefined();
        });
    });

    it('debería actualizar un héroe existente (updateHero)', () => {
        const mockHeroes: Hero[] = [
            { id: 1, name: 'Peter Parker', alias: 'Spider-Man', universe: 'marvel', superpowers: ['Telarañas'], active: true },
            { id: 2, name: 'Clark Kent', alias: 'Superman', universe: 'dc', superpowers: ['Vuelo'], active: true }
        ];

        // Primero cargamos los héroes
        service.getHeroes().subscribe();
        const req = httpMock.expectOne('/assets/heroes.json');
        req.flush(mockHeroes);

        const updatedHero: Hero = {
            id: 1,
            name: 'Peter Benjamin Parker',
            alias: 'Spider-Man',
            universe: 'marvel',
            superpowers: ['Telarañas', 'Sentido arácnido'],
            active: true
        };

        service.updateHero(updatedHero).subscribe((hero) => {
            expect(hero).toEqual(updatedHero);
        });

        // Verificamos que se actualizó en el signal
        expect(service.heroes()[0]).toEqual(updatedHero);
    });

    it('debería eliminar un héroe (deleteHero)', () => {
        const mockHeroes: Hero[] = [
            { id: 1, name: 'Peter Parker', alias: 'Spider-Man', universe: 'marvel', superpowers: ['Telarañas'], active: true },
            { id: 2, name: 'Clark Kent', alias: 'Superman', universe: 'dc', superpowers: ['Vuelo'], active: true }
        ];

        // Primero cargamos los héroes
        service.getHeroes().subscribe();
        const req = httpMock.expectOne('/assets/heroes.json');
        req.flush(mockHeroes);

        service.deleteHero(1).subscribe((result) => {
            expect(result).toBe(true);
        });

        // Verificamos que se eliminó del signal
        expect(service.heroes().length).toBe(1);
        expect(service.heroes()[0].id).toBe(2);
    });

    it('debería filtrar héroes por nombre (filterHeroesByName)', () => {
        const mockHeroes: Hero[] = [
            { id: 1, name: 'Peter Parker', alias: 'Spider-Man', universe: 'marvel', superpowers: ['Telarañas'], active: true },
            { id: 2, name: 'Clark Kent', alias: 'Superman', universe: 'dc', superpowers: ['Vuelo'], active: true },
            { id: 3, name: 'Bruce Wayne', alias: 'Batman', universe: 'dc', superpowers: ['Dinero'], active: true }
        ];

        // Primero cargamos los héroes
        service.getHeroes().subscribe();
        const req = httpMock.expectOne('/assets/heroes.json');
        req.flush(mockHeroes);

        // Filtramos por "peter"
        service.filterHeroesByName('peter').subscribe((heroes) => {
            expect(heroes.length).toBe(1);
            expect(heroes[0].name).toBe('Peter Parker');
        });

        // Filtramos por "clark" (case insensitive)
        service.filterHeroesByName('CLARK').subscribe((heroes) => {
            expect(heroes.length).toBe(1);
            expect(heroes[0].name).toBe('Clark Kent');
        });
    });

    it('debería retornar array vacío cuando no encuentra coincidencias en filtro (filterHeroesByName)', () => {
        const mockHeroes: Hero[] = [
            { id: 1, name: 'Peter Parker', alias: 'Spider-Man', universe: 'marvel', superpowers: ['Telarañas'], active: true }
        ];

        // Primero cargamos los héroes
        service.getHeroes().subscribe();
        const req = httpMock.expectOne('/assets/heroes.json');
        req.flush(mockHeroes);

        service.filterHeroesByName('inexistente').subscribe((heroes) => {
            expect(heroes.length).toBe(0);
        });
    });

    it('debería actualizar el signal heroes después de getHeroes', () => {
        const mockHeroes: Hero[] = [
            { id: 1, name: 'Peter Parker', alias: 'Spider-Man', universe: 'marvel', superpowers: ['Telarañas'], active: true },
            { id: 2, name: 'Clark Kent', alias: 'Superman', universe: 'dc', superpowers: ['Vuelo'], active: true }
        ];

        expect(service.heroes().length).toBe(0); // Inicialmente vacío

        service.getHeroes().subscribe();
        const req = httpMock.expectOne('/assets/heroes.json');
        req.flush(mockHeroes);

        expect(service.heroes().length).toBe(2);
        expect(service.heroes()).toEqual(mockHeroes);
    });

    it('debería calcular correctamente el nextId después de cargar héroes', () => {
        const mockHeroes: Hero[] = [
            { id: 5, name: 'Peter Parker', alias: 'Spider-Man', universe: 'marvel', superpowers: ['Telarañas'], active: true },
            { id: 10, name: 'Clark Kent', alias: 'Superman', universe: 'dc', superpowers: ['Vuelo'], active: true }
        ];

        service.getHeroes().subscribe();
        const req = httpMock.expectOne('/assets/heroes.json');
        req.flush(mockHeroes);

        // Creamos un nuevo héroe para verificar que el ID es correcto
        const newHero: Omit<Hero, 'id'> = {
            name: 'Bruce Wayne',
            alias: 'Batman',
            universe: 'dc',
            superpowers: ['Dinero'],
            active: true
        };

        service.createHero(newHero).subscribe((hero) => {
            expect(hero.id).toBe(11); // Debería ser max(5,10) + 1 = 11
            expect(hero.name).toBe('Bruce Wayne');
            expect(hero.alias).toBe('Batman');
        });

        // Verificar que se agregó correctamente al signal
        expect(service.heroes().length).toBe(3);
    });
});
