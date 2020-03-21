import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MockSessionComponent } from './mock-session.component';

describe('MockSessionComponent', () => {
  let component: MockSessionComponent;
  let fixture: ComponentFixture<MockSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MockSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
