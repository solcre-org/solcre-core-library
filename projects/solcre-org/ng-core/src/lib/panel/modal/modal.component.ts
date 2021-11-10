import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ng-solcre-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @Input() state: boolean;

  constructor() { }

  ngOnInit() {
  }

  onCloseModal(){
    this.state = false;
  }

}
