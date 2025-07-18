import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { MaterialDesignModule } from '../../../shared/material/material-design.module';
import { FormsModule } from '@angular/forms';
import { HeroService } from '../../../core/hero.service';
import { Subject, takeUntil } from 'rxjs';
import { Hero } from '../../../interfaces/hero.interface';
import { UppercaseDirective } from '../../../shared/directives/uppercase.directive';
import { Router } from '@angular/router';
import { HeroDialogComponent } from '../../../components/heroe-dialog/heroe-dialog';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog';
import { SpinnerService } from '../../../shared/services/spinner.service';

@Component({
  selector: 'app-list',
  imports: [MaterialDesignModule, FormsModule, UppercaseDirective],
  templateUrl: './list.html',
  styleUrl: './list.scss'
})
export class List implements OnInit {
  spinnerSvc = inject(SpinnerService);
  private _matDialog = inject(MatDialog);
  readonly filter = signal('');
  readonly heroes = signal<Hero[]>([]);
  readonly filtered = computed(() =>
    this.heroesSvc.heroes().filter(h => {
      if (!this.filter()) return true;
      const term = this.filter()?.toLowerCase() || '';
      return h.name.toLowerCase().includes(term) || h.alias.toLowerCase().includes(term);
    })
  );
  readonly pageSize = 6;
  readonly currentPage = signal(0);
  readonly paginated = computed(() => {
    const start = this.currentPage() * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });
  readonly totalPages = computed(() =>
    Math.ceil(this.filtered().length / this.pageSize)
  );
  private heroesSvc = inject(HeroService);
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _router = inject(Router);
  /**
   * Detecta cambios en la lista de héroes
   */
  heroesList = effect(() => {
    this.heroes.set(this.filtered());
  })

  /**
   * Spinner effect to show/hide loading bar
   */
  showLoadingBar = effect(() => {
    this.spinnerSvc._showLoadingBar();
  });


  ngOnInit() {
    this.loadHeroes();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }



  /**
   * Load heroes from the service 
   */
  loadHeroes() {
    this.heroesSvc.getHeroes().pipe(takeUntil(this._unsubscribeAll)).subscribe();
  }


  /**
   * Navigate to hero details page
   */
  nextPage() {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  /**
   * Navigate to previous hero details page
   */
  prevPage() {
    if (this.currentPage() > 0) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  /**
   * Navigate to hero details page
   * @param id 
   */
  viewHero(id: number) {
    this._router.navigate(['/heroes/details', id]);
  }


  /**
   *  Open the hero dialog to create or edit a hero
   * @param hero 
   */
  openDialog(hero?: Hero) {
    this._matDialog.open(HeroDialogComponent, {
      data: hero,
      width: '500px',
    }).afterClosed().subscribe((result: any) => {
      if (result === undefined) return;
      if (result.id) {
        this.heroesSvc.updateHero(result).subscribe();
      } else {
        this.heroesSvc.createHero(result).subscribe();
      }

    });
  }


  /**
   * Eliminar un héroe
   * @param heroId 
   * @param heroName 
   */
  deleteHero(heroId: number, heroName: string) {
    this._matDialog
      .open(ConfirmDialogComponent, {
        data: { name: heroName },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.heroesSvc.deleteHero(heroId);
        }
      });
  }

}
