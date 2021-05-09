import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiaImportModalComponent } from './mia-import-modal.component';

describe('MiaImportModalComponent', () => {
  let component: MiaImportModalComponent;
  let fixture: ComponentFixture<MiaImportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiaImportModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiaImportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
