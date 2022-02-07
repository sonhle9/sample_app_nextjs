import {Component, ElementRef, HostListener, Input, Output, EventEmitter} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileUploadComponent,
      multi: true,
    },
  ],
})
export class FileUploadComponent implements ControlValueAccessor {
  @Input()
  progress;
  onChange: (file: File) => void;

  @Input()
  type: string;

  @Output()
  fileLoad: EventEmitter<any> = new EventEmitter<any>();

  file: File | null = null;
  private inputAvailable = true;

  @HostListener('change', ['$event.target.files'])
  emitFiles(event: FileList) {
    const file = event && event.item(0);
    this.onChange(file);
    this.file = file;
    this.file.hasOwnProperty('name');
    if (this.fileLoad !== null) {
      this.fileLoad.emit(true);
    }
    this.inputAvailable = false;
  }

  constructor(private host: ElementRef<HTMLInputElement>) {}

  writeValue() {
    // clear file input
    this.host.nativeElement.value = '';
    this.file = null;
    this.inputAvailable = false;
  }

  makeInputAvailable() {
    this.inputAvailable = true;
  }

  getFileType(): string {
    return this.type;
  }

  registerOnChange(fn: (file: File) => void) {
    this.onChange = fn;
  }

  registerOnTouched() {}

  isFileAvailable(): boolean {
    return this.inputAvailable;
  }
}
