import { ArrayType } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { GallerieModalComponent } from '../galleries/gallerie-modal/gallerie-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalServiceService {
  private   modals: GallerieModalComponent[] =[];

  constructor() { }

  add(modal: GallerieModalComponent) {
    // ensure component has a unique id attribute
    if (!modal.id || this.modals.find(x => x.id === modal.id)) {
        throw new Error('modal must have a unique id attribute');
    }

    // add modal to array of active modals
    this.modals.push(modal);
}

remove(modal: GallerieModalComponent) {
    // remove modal from array of active modals
    this.modals = this.modals.filter(x => x === modal);
}

open(id: string) {
    // open modal specified by id
    const modal = this.modals.find(x => x.id === id);

    if (!modal) {
        throw new Error(`modal '${id}' not found`);
    }
    //console.log(modal);
    modal.open();
}

close() {
    // close the modal that is currently open
    const modal = this.modals.find(x => x.isOpen);
    modal?.close();
}

}
