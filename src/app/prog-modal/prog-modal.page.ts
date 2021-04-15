import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-prog-modal',
  templateUrl: './prog-modal.page.html',
  styleUrls: ['./prog-modal.page.scss'],
})
export class ProgModalPage implements OnInit {
  @Input() firstName: string;
  @Input() lastName: string;
  @Input() middleInitial: string;
  constructor() { }

  ngOnInit() {
  }

}
