import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionTaskListComponent } from './production-task-list.component';

describe('ProductionTaskListComponent', () => {
  let component: ProductionTaskListComponent;
  let fixture: ComponentFixture<ProductionTaskListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductionTaskListComponent]
    });
    fixture = TestBed.createComponent(ProductionTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
