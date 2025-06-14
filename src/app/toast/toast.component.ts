import { Component, Input } from '@angular/core';
import { fadeIn } from 'src/animations';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  animations: [fadeIn]
})
export class ToastComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'info' = 'info';
  visible = true;

  hide() {
    this.visible = false;
  }
}