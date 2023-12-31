import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineUsersComponent } from './online-users.component';

describe('OnlineUsersComponent', () => {
  let component: OnlineUsersComponent;
  let fixture: ComponentFixture<OnlineUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OnlineUsersComponent]
    });
    fixture = TestBed.createComponent(OnlineUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
