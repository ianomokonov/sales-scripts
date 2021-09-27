import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IdNameResponse } from 'src/app/_models/responses/id-name.response';
import { TransitionType } from 'src/app/_models/transition-type';
import { BlockService } from 'src/app/_services/back/block.service';
import { markInvalidFields } from 'src/app/_utils/formValidCheck';
import { BlockType } from '../add-block/add-block.component';

@Component({
  selector: 'app-add-transition',
  templateUrl: './add-transition.component.html',
  styleUrls: ['./add-transition.component.less'],
})
export class AddTransitionComponent {
  public addLink = false;
  public blocks: IdNameResponse[] = [];
  public transitionForm: FormGroup;
  public statusOptions = [
    { name: 'Хороший', class: 'success', value: TransitionType.Good },
    { name: 'Нормальный', class: 'secondary', value: TransitionType.Normal },
    { name: 'Плохой', class: 'danger', value: TransitionType.Bad },
  ];

  public get blockForm(): FormGroup {
    return this.transitionForm.get('block') as FormGroup;
  }
  constructor(
    public modal: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private fb: FormBuilder,
    private toastService: MessageService,
    private blockService: BlockService,
    private confirmService: ConfirmationService,
  ) {
    this.addLink = this.config.data.addLink;
    this.blocks = this.config.data.blocks;
    this.transitionForm = this.fb.group({
      name: [this.config.data?.transition?.name || null, Validators.required],

      status: [this.config.data?.transition?.status || TransitionType.Good, Validators.required],
    });

    if (this.addLink) {
      this.transitionForm.addControl(
        'nextBlockId',
        new FormControl(this.config.data?.transition?.nextBlockId, Validators.required),
      );
      return;
    }

    this.transitionForm.addControl(
      'block',
      this.fb.group({
        name: [null, Validators.required],
        type: [BlockType.Block, Validators.required],
        description: [null, Validators.required],
      }),
    );
  }

  public delete() {
    this.modal.close({ isDelete: true });
  }

  public saveTransition() {
    if (this.transitionForm.invalid) {
      markInvalidFields(this.transitionForm);
      if (this.blockForm) {
        markInvalidFields(this.blockForm);
      }

      this.toastService.add({
        severity: 'error',
        detail: 'Заполните обязательные поля',
      });
      return;
    }

    const formValue = this.transitionForm.getRawValue();
    if (formValue.block) {
      formValue.block.isGroup = formValue.block.type === BlockType.Group;
      delete formValue.block.type;
    }

    this.modal.close(formValue);
  }
}
