import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-confirmacion',
  standalone: true,
  imports: [],
  templateUrl: './modal-confirmacion.component.html',
  styleUrl: './modal-confirmacion.component.css'
})
export class ModalConfirmacionComponent {

  @Input() mensaje!: string;
  @Input() title!: string;

  constructor(
    public activeModal: NgbActiveModal
  ){}
}
