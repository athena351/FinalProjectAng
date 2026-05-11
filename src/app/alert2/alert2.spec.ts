import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Alert2 } from './alert2';

describe('Alert2', () => {
  let component: Alert2;
  let fixture: ComponentFixture<Alert2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alert2],
    }).compileComponents();

    fixture = TestBed.createComponent(Alert2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
