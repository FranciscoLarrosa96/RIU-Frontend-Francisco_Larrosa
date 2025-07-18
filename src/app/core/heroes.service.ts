import { inject, Injectable, signal } from '@angular/core';
import { Hero } from '../interfaces/hero.interface';
import { map, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class HeroService {
    private http = inject(HttpClient);

    readonly heroes = signal<Hero[]>([]);
    private nextId = 1;


    getHeroes(): Observable<Hero[]> {
        return this.http.get<Hero[]>('/assets/heroes.json').pipe(
            tap(data => {
                this.heroes.set(data);
                this.nextId = Math.max(...data.map(h => h.id)) + 1;
            })
        );
    }


    getHeroById(id: number): Observable<Hero | undefined> {
        return of(this.heroes().find(h => h.id === id));
    }

    createHero(hero: Omit<Hero, 'id'>): Observable<Hero> {
        const newHero: Hero = { ...hero, id: this.nextId++ };
        this.heroes.set([newHero, ...this.heroes()]);
        return of(newHero);
    }

    updateHero(hero: Hero): Observable<Hero> {
        const updated = this.heroes().map(h => h.id === hero.id ? hero : h);
        this.heroes.set(updated);
        return of(hero);
    }

    deleteHero(id: number): Observable<boolean> {
        const filtered = this.heroes().filter(h => h.id !== id);
        this.heroes.set(filtered);
        return of(true);
    }

    filterHeroesByName(name: string): Observable<Hero[]> {
        const filtered = this.heroes().filter(h => h.name.toLowerCase().includes(name.toLowerCase()));
        return of(filtered);
    }
}
