import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServersSidePanelComponent } from './servers-side-panel.component';

describe('ServersSidePanelComponent', () => {
  let component: ServersSidePanelComponent;
  let fixture: ComponentFixture<ServersSidePanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServersSidePanelComponent]
    });
    fixture = TestBed.createComponent(ServersSidePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
