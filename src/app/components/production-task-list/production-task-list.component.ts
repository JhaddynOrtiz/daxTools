import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridReadyEvent } from 'ag-grid-community';
import { TaskService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-production-task-list',
  templateUrl: './production-task-list.component.html',
  styleUrls: ['./production-task-list.component.css']
})
export class ProductionTaskListComponent {
  private gridApi: any;
  rowData: any[] = [];
  totalData: any;
  paginationPageSize = 20;
  loadingData = false;
  totalPages: any;

  columnDefs = [
    { headerName: 'ID', field: 'id' },
    // ... other columns
  ];

  constructor(private actorTasksService: TaskService) {}

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.loadData(1); // Load the first page by default
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(this.totalData);
  }

  loadData(page: number, offset?: number) {
    this.loadingData = true;
    const limit = this.paginationPageSize;

    this.actorTasksService.getActorTasks(offset ? offset : 0, limit).subscribe(
      (data: any) => {
        const { items, total } = data.data;
        this.rowData = items;
        this.totalData = total;
        this.totalPages = Math.ceil(total / this.paginationPageSize);
        // Set the total number of pages for pagination
        this.gridApi.paginationSetPageSize(this.paginationPageSize);
      },
      error => console.error('Error loading data:', error),
      () => {
        this.loadingData = false;
      }
    );
  }
}
