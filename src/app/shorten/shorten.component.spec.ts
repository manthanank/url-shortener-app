import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortenComponent } from './shorten.component';

describe('ShortenComponent', () => {
  let component: ShortenComponent;
  let fixture: ComponentFixture<ShortenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShortenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShortenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
