import {Component, Input, OnChanges} from '@angular/core';
import {camelToSentenceCase} from 'src/shared/helpers/format-text';
import {omit} from 'lodash';
import moment from 'moment';

export interface Segment {
  key: string;
  value: any;
  type: undefined | string;
  description: string;
  expanded: boolean;
}

@Component({
  selector: 'app-json-viewer',
  templateUrl: './json-viewer.component.html',
  styleUrls: ['./json-viewer.component.scss'],
})
export class JsonViewerComponent implements OnChanges {
  @Input() json: any;
  @Input() expanded = false;
  @Input() currentLevel = 0;
  @Input() withHeading = true;
  /**
   * Fields to be displayed first
   */
  @Input() importantFields: string[] = [];
  /**
   * Fields to be formatted with DD MMM YYYY - hh:mmA
   */
  @Input() dateTimeFields: string[] = [];

  private cleanOnChange = true;

  segments: Segment[] = [];

  ngOnChanges() {
    if (this.cleanOnChange) {
      this.segments = [];
    }

    if (Array.isArray(this.json)) {
      this.json.forEach((item, index) => this.segments.push(this.parseKeyValue(index + 1, item)));
    } else if (typeof this.json === 'object') {
      if (this.importantFields.length) {
        this.importantFields.forEach((key) => {
          this.segments.push(this.parseKeyValue(key, this.json[key]));
        });
        Object.keys(omit(this.json, this.importantFields)).forEach((key) => {
          this.segments.push(this.parseKeyValue(key, this.json[key]));
        });
      } else {
        Object.keys(this.json).forEach((key) => {
          this.segments.push(this.parseKeyValue(key, this.json[key]));
        });
      }
    } else {
      this.segments.push(this.parseKeyValue(`(${typeof this.json})`, this.json));
    }
  }

  isExpandable(segment: Segment) {
    return segment.type === 'object' || (segment.type === 'array' && segment.value.length > 0);
  }

  toggle(segment: Segment) {
    if (this.isExpandable(segment)) {
      segment.expanded = !segment.expanded;
    }
  }

  private parseKeyValue(key: any, value: any): Segment {
    const segment: Segment = {
      key: camelToSentenceCase(key),
      value,
      type: undefined,
      description:
        this.dateTimeFields.includes(key) && typeof value === 'string'
          ? moment(value).format('DD MMM YYYY - hh:mm A')
          : '' + value,
      expanded: this.expanded,
    };

    switch (typeof segment.value) {
      case 'number': {
        segment.type = 'number';
        break;
      }
      case 'boolean': {
        segment.type = 'boolean';
        break;
      }
      case 'function': {
        segment.type = 'function';
        break;
      }
      case 'string': {
        segment.type = 'string';
        break;
      }
      case 'undefined': {
        segment.type = 'undefined';
        segment.description = '-';
        break;
      }
      case 'object': {
        // yea, null is object
        if (segment.value === null) {
          segment.type = 'null';
          segment.description = '-';
        } else if (Array.isArray(segment.value)) {
          segment.type = 'array';
          segment.description = `(${segment.value.length} ${
            segment.value.length > 1 ? 'records' : 'record'
          }) ${JSON.stringify(segment.value)}`;
        } else if (segment.value instanceof Date) {
          segment.type = 'date';
        } else {
          segment.type = 'object';
          segment.description = JSON.stringify(segment.value);
        }
        break;
      }
    }

    return segment;
  }
}
