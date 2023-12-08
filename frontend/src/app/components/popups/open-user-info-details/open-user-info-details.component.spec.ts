import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenUserInfoDetailsComponent } from './open-user-info-details.component';

describe('OpenUserInfoDetailsComponent', () => {
  let component: OpenUserInfoDetailsComponent;
  let fixture: ComponentFixture<OpenUserInfoDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpenUserInfoDetailsComponent]
    });
    fixture = TestBed.createComponent(OpenUserInfoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
