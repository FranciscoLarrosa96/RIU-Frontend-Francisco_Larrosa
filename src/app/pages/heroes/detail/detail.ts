import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HeroService } from '../../../core/hero.service';
import { Hero } from '../../../interfaces/hero.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail',
  imports: [CommonModule,RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.scss'
})
export class Detail implements OnInit {
  private route = inject(ActivatedRoute);
  private _router = inject(Router);
  private heroService = inject(HeroService);

  hero?: Hero;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHeroById(id).subscribe(hero => {
      // Lo retorno a la lista si no existe el héroe
      if(!hero){
        this._router.navigate(['/']);
      }
      this.hero = hero;
    });
  }
}
