import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatDmComponent } from './chat-dm.component';

describe('ChatDmComponent', () => {
  let component: ChatDmComponent;
  let fixture: ComponentFixture<ChatDmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatDmComponent]
    });
    fixture = TestBed.createComponent(ChatDmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
