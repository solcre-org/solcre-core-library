import { Component, OnInit } from '@angular/core';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styles: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  isActive: boolean = true;

  constructor(
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.loaderService.onOpen.subscribe(() => {
      //Open
      this.isActive = true;

    })
    this.loaderService.onClose.subscribe(() => {
      //Close
      this.isActive = false;
    })

  }


}
