import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { TableModel } from './table.model';
import { TableRowModel } from './table-row.model';
import { FormGroup } from '@angular/forms';
import { DialogModel } from '../panel/dialog/dialog.model';
import { TableHeaderModel } from './table-header.model';
import { TableSortEnum } from './table-sort.enum';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styles: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @Input() tableModel: TableModel;

  @Output() onDelete: EventEmitter<TableRowModel> = new EventEmitter();
  @Output() onUpdate: EventEmitter<TableRowModel> = new EventEmitter();
  @Output() onSort: EventEmitter<any> = new EventEmitter();
  @Output() onExtraActionClick: EventEmitter<any> = new EventEmitter();

  dialog: DialogModel;
  newprimaryForm: FormGroup;
  filteredStatus = '';
  updateGroupForm: FormGroup;
  currentSorting: any = {};
  currentKeySorting: string; // clicked column

  constructor(
  ) { }

  ngOnInit() {
    this.currentSorting = {};

  }

  onDeleteRow(row: TableRowModel) {
    if (row instanceof TableRowModel) {
      this.onDelete.emit(row);
    }
  }

  onConfirmDelete() {
    this.dialog.doConfirm();

  }

  onModifiersRow(row: TableRowModel) {
    if (row instanceof TableRowModel) {
      this.onUpdate.emit(row);
    }
  }

  onSortRows(column: TableHeaderModel) {
    if (column instanceof TableHeaderModel) {
      const current: string = this.currentSorting[column.key];
      this.currentSorting = {}; //Warning! remove the last sort
      //Switch between states   
      if (!current) {
        this.currentSorting[column.key] = TableSortEnum.ASC;
        this.currentKeySorting = column.key
      } else if (current === TableSortEnum.ASC) {
        this.currentSorting[column.key] = TableSortEnum.DESC;
        this.currentKeySorting = column.key
      } else {
        delete this.currentSorting[column.key];
        this.currentKeySorting = null;
      }
      column.sortable = true;
      column.loading = true;
      this.onSort.emit({
        column: column,
        value: this.currentSorting[this.currentKeySorting]
      });
    }
  }

  onExtraActionRow(key: string, row: any) {
    this.onExtraActionClick.emit({ key, row });
  }

}
