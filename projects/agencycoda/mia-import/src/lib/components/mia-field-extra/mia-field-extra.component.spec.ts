import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiaFieldExtraComponent } from './mia-field-extra.component';

describe('MiaFieldExtraComponent', () => {
  let component: MiaFieldExtraComponent;
  let fixture: ComponentFixture<MiaFieldExtraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiaFieldExtraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiaFieldExtraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
