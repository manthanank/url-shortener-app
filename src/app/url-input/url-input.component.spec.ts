import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlInputComponent } from './url-input.component';

describe('UrlInputComponent', () => {
  let component: UrlInputComponent;
  let fixture: ComponentFixture<UrlInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UrlInputComponent]
    });
    fixture = TestBed.createComponent(UrlInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
