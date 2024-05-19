import { Component, Input, OnInit } from '@angular/core';
import { Mesa } from '../models/mesa';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-mesa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-mesa.component.html',
  styleUrl: './card-mesa.component.css'
})
export class CardMesaComponent implements OnInit{
  

  @Input() mesa?: Mesa;

  ngOnInit(): void {
    console.log(this.mesa);
  }


}
