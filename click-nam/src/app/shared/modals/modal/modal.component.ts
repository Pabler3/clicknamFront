import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent {

  @Input() title: string = '';
  @Input() content: string = '';
  @Input() msg:boolean = false;

  constructor(public activeModal: NgbActiveModal){}

  //metodo para cerrar el modal
  closeModal(): void {
    this.activeModal.dismiss('Cross Click');
  }

}
