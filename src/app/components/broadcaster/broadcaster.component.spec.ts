import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcasterComponent } from './broadcaster.component';

describe('BroadcasterComponent', () => {
  let component: BroadcasterComponent;
  let fixture: ComponentFixture<BroadcasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BroadcasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadcasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
