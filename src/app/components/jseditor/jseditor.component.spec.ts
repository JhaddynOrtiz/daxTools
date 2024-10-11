import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JseditorComponent } from './jseditor.component';

describe('JseditorComponent', () => {
  let component: JseditorComponent;
  let fixture: ComponentFixture<JseditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JseditorComponent]
    });
    fixture = TestBed.createComponent(JseditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
