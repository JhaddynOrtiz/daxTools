import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputConverterComponent } from './input-converter.component';

describe('InputConverterComponent', () => {
  let component: InputConverterComponent;
  let fixture: ComponentFixture<InputConverterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputConverterComponent]
    });
    fixture = TestBed.createComponent(InputConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
