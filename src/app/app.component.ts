import { Component, ViewChild, ElementRef, Output, EventEmitter  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CreateOrdenComponent } from './components/create-orden/create-orden.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CreateOrdenComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'app-pruebatecnica';
  @ViewChild('myButtonClose') myButtonClose!: ElementRef;

  @Output() eventoPadre = new EventEmitter<any>();

  closeModal(){
    if (this.myButtonClose) {
      (this.myButtonClose.nativeElement as HTMLButtonElement).click();
    }
  }
}
