import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparerComponent } from './comparer.component';

describe('ComparerComponent', () => {
  let component: ComparerComponent;
  let fixture: ComponentFixture<ComparerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComparerComponent]
    });
    fixture = TestBed.createComponent(ComparerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
