import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as AOS from 'aos';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  public title = 'RIU-Frontend-Francisco_Larrosa';

  ngOnInit(): void {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });
  }
}
