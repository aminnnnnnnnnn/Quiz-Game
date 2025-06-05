import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendschallengeComponent } from './friendschallenge.component';

describe('FriendschallengeComponent', () => {
  let component: FriendschallengeComponent;
  let fixture: ComponentFixture<FriendschallengeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendschallengeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FriendschallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
