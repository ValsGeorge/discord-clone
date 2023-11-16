import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateServerPopupComponent } from './create-server-popup.component';

describe('CreateServerPopupComponent', () => {
  let component: CreateServerPopupComponent;
  let fixture: ComponentFixture<CreateServerPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateServerPopupComponent]
    });
    fixture = TestBed.createComponent(CreateServerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
