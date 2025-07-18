import { inject, Injectable, signal } from '@angular/core';
import { Hero } from '../interfaces/hero.interface';
import { delay, finalize, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SpinnerService } from '../shared/services/spinner.service';


@Injectable({ providedIn: 'root' })
export class HeroService {
    private http = inject(HttpClient);
    private _spinnerSvc = inject(SpinnerService);
    readonly heroes = signal<Hero[]>([]);
    private nextId = 1;


    getHeroes(): Observable<Hero[]> {
        return this.http.get<Hero[]>('/assets/heroes.json').pipe(
            tap(data => {
                this.heroes.set(data);
                this.nextId = Math.max(...data.map(h => h.id)) + 1;
            }),
        );
    }


    getHeroById(id: number): Observable<Hero | undefined> {
        return of(this.heroes().find(h => h.id === id));
    }

    createHero(hero: Omit<Hero, 'id'>): Observable<Hero> {
        // show spinner when creating a hero
        this._spinnerSvc.showLoadingBar();
        const newHero: Hero = { ...hero, id: this.nextId++ };
        this.heroes.set([newHero, ...this.heroes()]);
        return of(newHero).pipe(
            delay(1700), // Simulate server delay
            finalize(() => {
                this._spinnerSvc.hideLoadingBar();
            })
        );
    }

    updateHero(hero: Hero): Observable<Hero> {
        // show spinner when creating a hero
        this._spinnerSvc.showLoadingBar();
        const updated = this.heroes().map(h => h.id === hero.id ? hero : h);
        this.heroes.set(updated);
        return of(hero)
            .pipe(
                delay(1000), // Simulate server delay
                finalize(() => {
                    this._spinnerSvc.hideLoadingBar();
                })
            );
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
