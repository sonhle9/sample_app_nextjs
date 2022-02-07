import {Component, OnChanges, Input, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {JsonViewer} from '@setel/portal-ui';
import {JsonPrettyViewerProps} from '@setel/portal-ui/dist/components/internal/json-pretty-viewer';
import {JSONValue} from '@setel/portal-ui/dist/components/internal/json-code-viewer';

@Component({
  selector: 'app-json-formatter-viewer',
  template: `<div #jsvRoot></div>`,
})
export class JsonFormatterViewerComponent implements OnChanges, AfterViewInit {
  @ViewChild('jsvRoot') jsvRoot: ElementRef;
  @Input() json: JSONValue;
  @Input() initialExpanded?: boolean;
  @Input() formatDate?: boolean;
  public rootId = 'json-formater-viewer-root';
  private hasViewLoaded = false;

  public ngOnChanges() {
    this.renderComponent();
  }

  public ngAfterViewInit() {
    this.hasViewLoaded = true;
    this.renderComponent();
  }

  private renderComponent() {
    if (!this.hasViewLoaded) {
      return;
    }

    const props: JsonPrettyViewerProps = {
      json: this.json,
      initialExpanded: this.initialExpanded,
      formatDate: this.formatDate,
    };

    ReactDOM.render(React.createElement(JsonViewer, props), this.jsvRoot.nativeElement);
  }
}
