import { Component, ViewEncapsulation, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { ModalServiceService } from 'src/app/services/modal-service.service';

@Component({
  selector: 'jw-modal',
  templateUrl: './gallerie-modal.component.html',
  styleUrls: ['./gallerie-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GallerieModalComponent implements OnInit, OnDestroy {
  @Input() id?: string;
  isOpen = false;
  private element: any;

  constructor(private modalService: ModalServiceService, private el: ElementRef) {
    this.element = el.nativeElement;
  }
  ngOnInit() {
    // add self (this modal instance) to the modal service so it can be opened from any component
    this.modalService.add(this);

    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.element);

    // close modal on background click
    this.element.addEventListener('click', (el: any) => {
        if (el.target.className === 'jw-modal') {
            this.close();
        }
    });
  }

  ngOnDestroy() {
    // remove self from modal service
    this.modalService.remove(this);

    // remove modal element from html
    this.element.remove();
  }

  open() {
      this.element.style.display = 'block';
      document.body.classList.add('jw-modal-open');
      this.isOpen = true;
  }

  close() {
      this.element.style.display = 'none';
      document.body.classList.remove('jw-modal-open');
      this.isOpen = false;
  }

}
