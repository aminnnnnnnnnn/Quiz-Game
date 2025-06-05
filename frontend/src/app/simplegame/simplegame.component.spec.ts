import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimplegameComponent } from './simplegame.component';

describe('SimplegameComponent', () => {
  let component: SimplegameComponent;
  let fixture: ComponentFixture<SimplegameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimplegameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimplegameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
