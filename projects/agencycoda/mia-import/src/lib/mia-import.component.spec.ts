import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiaImportComponent } from './mia-import.component';

describe('MiaImportComponent', () => {
  let component: MiaImportComponent;
  let fixture: ComponentFixture<MiaImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiaImportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiaImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
