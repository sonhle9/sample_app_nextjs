import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-display-text',
  templateUrl: './display-text.component.html',
  styleUrls: ['./display-text.component.scss'],
})
export class DisplayTextComponent implements OnInit {
  @Input() label = '';
  @Input() type = '';

  constructor() {}

  ngOnInit() {}
}
