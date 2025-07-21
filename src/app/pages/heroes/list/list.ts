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
  readonly filtered = computed(() => {
    const filteredHeroes = this.heroesSvc.heroes().filter(h => {
      if (!this.filter()) return true;
      const term = this.filter()?.toLowerCase() || '';
      return h.name.toLowerCase().includes(term) || h.alias.toLowerCase().includes(term);
    });
    
    return filteredHeroes;
  });
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
   * Detecta cuando se muestra la barra de carga
   */
  showLoadingBar = effect(() => {
    this.spinnerSvc._showLoadingBar();
  });

  /**
   * Efecto que resetea la página cuando cambia el filtro
   */
  filterChangeEffect = effect(() => {
    // Observar cambios en el filtro
    const currentFilter = this.filter();
    const totalPages = this.totalPages();
    
    // Si la página actual está fuera de rango, resetear a la primera página
    if (this.currentPage() >= totalPages && totalPages > 0) {
      this.currentPage.set(0);
    }
  });


  ngOnInit() {
    this.loadHeroes();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }



  /**
   * Carga los héroes desde el servicio
   */
  loadHeroes() {
    this.heroesSvc.getHeroes().pipe(takeUntil(this._unsubscribeAll)).subscribe();
  }


  /**
   * Navega a la siguiente página de héroes
   */
  nextPage() {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  /**
   * Navega a la página anterior de héroes
   */
  prevPage() {
    if (this.currentPage() > 0) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  /**
   * Navega a la página de detalles del héroe
   * @param id - ID del héroe a ver
   */
  viewHero(id: number) {
    this._router.navigate(['/heroes/details', id]);
  }


  /**
   *  Abre el diálogo del héroe para crear o editar un héroe
   * @param hero - Héroe a editar (opcional)
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
   * Elimina un héroe
   * @param heroId - ID del héroe a eliminar
   * @param heroName - Nombre del héroe para confirmación
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
