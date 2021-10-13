import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Transition } from 'src/app/_entities/transition.entity';
import { IdNameResponse } from 'src/app/_models/responses/id-name.response';
import { TransitionType } from 'src/app/_models/transition-type';
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
  public currentTransition: Transition;
  public activeTabId = 0;
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
  ) {
    this.currentTransition = this.config.data?.transition;
    this.addLink = this.config.data.addLink;
    if (!this.addLink) {
      this.activeTabId = 1;
    }
    this.blocks = this.config.data.blocks;
    this.transitionForm = this.fb.group({
      name: [this.config.data?.transition?.name || null, Validators.required],

      status: [this.config.data?.transition?.status || TransitionType.Good, Validators.required],
    });

    this.transitionForm.addControl(
      'nextBlockId',
      new FormControl(this.config.data?.transition?.nextBlockId, Validators.required),
    );
    if (!this.addLink) {
      this.transitionForm.controls.nextBlockId.disable();
      this.transitionForm.addControl(
        'block',
        this.fb.group({
          name: [null, Validators.required],
          type: [BlockType.Block, Validators.required],
          description: [null, Validators.required],
        }),
      );
    }
  }

  public delete() {
    this.modal.close({ isDelete: true });
  }

  public saveTransition() {
    if (this.currentTransition && this.activeTabId !== 1) {
      this.transitionForm.removeControl('block');
    }
    if (this.transitionForm.invalid) {
      markInvalidFields(this.transitionForm);
      if (this.blockForm && (!this.currentTransition || this.activeTabId === 1)) {
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
