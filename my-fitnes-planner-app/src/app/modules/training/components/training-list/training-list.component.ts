import { Training } from './../../models/training.model';
import { DataSourceService } from './../../services/data-source.service';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.css'],
})
export class TrainingListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @Input() training: Training;
  displayedColumns: string[] = [
    'index',
    'trainingDate',
    'exerciseName',
    'weight',
    'typeOfTraining',
    'update',
  ];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dts.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.dts.dataSource.paginator = this.paginator;
  }
  constructor(private dts: DataSourceService) {}
  getDataSource() {
    return this.dts.dataSource;
  }
}
