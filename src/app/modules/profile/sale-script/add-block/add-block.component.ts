import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { isFormInvalid } from 'src/app/_utils/formValidCheck';

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
  public showBtns = false;

  constructor(
    private fb: FormBuilder,
    public modal: DynamicDialogRef,
    private toastService: MessageService,
  ) {}

  public ngOnInit(): void {
    if (!this.blockForm) {
      this.blockForm = this.fb.group({
        name: [null, Validators.required],
        type: [this.blockType.Block, Validators.required],
        description: [null, Validators.required],
      });
      this.showBtns = true;
    }
  }

  public save() {
    if (!this.blockForm || isFormInvalid(this.blockForm)) {
      this.toastService.add({
        severity: 'error',
        detail: 'Заполните обязательные поля',
      });
      return;
    }
    const block = this.blockForm?.getRawValue();
    block.isGroup = block.type === BlockType.Group;
    delete block.type;
    this.modal.close(block);
  }
}
