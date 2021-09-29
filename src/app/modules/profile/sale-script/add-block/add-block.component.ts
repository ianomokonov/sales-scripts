import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
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
  @Input() public showBtns = false;

  public currentBlock = this.config.data.block;
  public blockType = BlockType;

  constructor(
    private fb: FormBuilder,
    public modal: DynamicDialogRef,
    private toastService: MessageService,
    private config: DynamicDialogConfig,
  ) {}

  public ngOnInit(): void {
    if (!this.blockForm) {
      this.blockForm = this.fb.group({
        name: [this.currentBlock?.name || null, Validators.required],
        type: [this.currentBlock?.type || this.blockType.Block, Validators.required],
        description: [this.currentBlock?.description || null, Validators.required],
      });
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
