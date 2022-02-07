import {Component, Input} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {tagValidator} from '../../helpers/common';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent {
  @Input()
  tagsContainer;

  tagForm = this.fb.group({
    tag: ['', tagValidator(this.getTags.bind(this))],
  });

  constructor(private fb: FormBuilder) {}

  getTags() {
    return this.tagsContainer;
  }

  onRemoveTag(tag: string) {
    this.tagsContainer = this.tagsContainer.filter((item) => item !== tag);
  }

  onSubmitTag() {
    this.tagsContainer.push(this.tagForm.value.tag);
    this.tagForm.reset();
  }
}
