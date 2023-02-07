import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GallerieModalComponent } from './gallerie-modal.component';

describe('GallerieModalComponent', () => {
  let component: GallerieModalComponent;
  let fixture: ComponentFixture<GallerieModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GallerieModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GallerieModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
