import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparerApifyComponent } from './comparer-apify.component';

describe('ComparerApifyComponent', () => {
  let component: ComparerApifyComponent;
  let fixture: ComponentFixture<ComparerApifyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComparerApifyComponent]
    });
    fixture = TestBed.createComponent(ComparerApifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
