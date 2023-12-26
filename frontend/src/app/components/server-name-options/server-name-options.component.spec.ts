import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerNameOptionsComponent } from './server-name-options.component';

describe('ServerNameOptionsComponent', () => {
  let component: ServerNameOptionsComponent;
  let fixture: ComponentFixture<ServerNameOptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServerNameOptionsComponent]
    });
    fixture = TestBed.createComponent(ServerNameOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
