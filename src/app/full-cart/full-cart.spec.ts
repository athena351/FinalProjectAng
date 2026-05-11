import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullCart } from './full-cart';

describe('FullCart', () => {
  let component: FullCart;
  let fixture: ComponentFixture<FullCart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullCart],
    }).compileComponents();

    fixture = TestBed.createComponent(FullCart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
