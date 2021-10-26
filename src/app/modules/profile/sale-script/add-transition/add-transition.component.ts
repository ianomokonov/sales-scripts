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
  public blocks: IdNameResponse[] = [];
  public transitionForm: FormGroup;
  public currentTransition: Transition;
  public isIncomming = false;
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
    const removeDropdown = () => document.querySelector('.p-dropdown-panel')?.remove();

    this.modal.onClose.subscribe(removeDropdown);
    this.modal.onDestroy.subscribe(removeDropdown);

    this.currentTransition = this.config.data?.transition;
    this.isIncomming = this.config.data.isIncomming;
    this.blocks = this.config.data.blocks;
    this.transitionForm = this.fb.group({
      name: [this.currentTransition?.name || null, Validators.required],
      status: [this.currentTransition?.status || TransitionType.Good, Validators.required],
    });

    this.transitionForm.addControl(
      'nextBlockId',
      new FormControl(this.currentTransition?.nextBlockId, Validators.required),
    );
    if (!this.isIncomming) {
      const blockForm = this.fb.group({
        name: [null, Validators.required],
        type: [BlockType.Block, Validators.required],
        description: [null, Validators.required],
      });
      this.transitionForm.addControl('block', blockForm);

      if (!this.blocks?.length) {
        this.activeTabId = 1;
        this.onTabChanged(1);
        return;
      }

      this.onTabChanged(0);
    }
  }

  public onTabChanged(activeIndex: number) {
    const blockForm = this.transitionForm.get('block');
    const nextIdControl = this.transitionForm.get('nextBlockId');

    if (activeIndex === 0) {
      blockForm?.disable({ emitEvent: false });
      nextIdControl?.enable({ emitEvent: false });
      return;
    }

    blockForm?.enable({ emitEvent: false });
    nextIdControl?.disable({ emitEvent: false });
  }

  public delete() {
    this.modal.close({ isDelete: true });
  }

  public saveTransition() {
    if (this.transitionForm.invalid) {
      markInvalidFields(this.transitionForm);
      markInvalidFields(this.blockForm);

      this.toastService.add({
        severity: 'error',
        detail: 'Заполните обязательные поля',
      });
      return;
    }

    const formValue = this.transitionForm.getRawValue();
    if (this.activeTabId === 1) {
      formValue.block.isGroup = formValue.block.type === BlockType.Group;
      delete formValue.block.type;
      delete formValue.nextBlockId;
    } else {
      delete formValue.block;
    }

    this.modal.close(formValue);
  }
}
