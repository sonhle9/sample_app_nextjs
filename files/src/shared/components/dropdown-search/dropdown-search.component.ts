import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {IDropdownItem} from '../dropdown/dropdown.interface';

@Component({
  selector: 'app-dropdown-search',
  templateUrl: './dropdown-search.component.html',
  styleUrls: ['./dropdown-search.component.scss'],
})
export class DropdownSearchComponent implements OnInit {
  @Input()
  options: IDropdownItem[];
  @Input()
  dropdownPlaceholder;
  @Input()
  inputPlaceholder;

  @Output()
  optionChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  searchChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  handleSearch: EventEmitter<any> = new EventEmitter<any>();

  searchOption;
  searchValue;

  ngOnInit() {
    this.searchOption = this.options[0].value;
  }

  onOptionChanged(e) {
    this.optionChanged.emit(e.source.value);
  }

  onSearchChanged(e) {
    this.optionChanged.emit(e.source.value);
  }

  onSearch() {
    this.handleSearch.emit({searchFilter: this.searchOption, searchValue: this.searchValue});
  }
}
