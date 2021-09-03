import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export enum BlockType {
  Block = 1,
  Group,
}

@Component({
  selector: 'app-add-block',
  templateUrl: './add-block.component.html',
  styleUrls: ['./add-block.component.less'],
})
export class AddBlockComponent implements OnInit {
  @Input() public blockForm: FormGroup | undefined;

  public blockType = BlockType;

  constructor(private fb: FormBuilder) {}

  public ngOnInit(): void {
    if (!this.blockForm) {
      this.blockForm = this.fb.group({
        name: [null, Validators.required],
        type: [this.blockType.Block, Validators.required],
        description: [null, Validators.required],
      });
    }
  }
}
