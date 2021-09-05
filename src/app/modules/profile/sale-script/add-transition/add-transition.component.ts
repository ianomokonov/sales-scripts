import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
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
  ) {
    this.addLink = this.config.data.addLink;
    this.transitionForm = this.fb.group({
      name: [null, Validators.required],

      status: [TransitionType.Good, Validators.required],
      block: this.fb.group({
        name: [null, Validators.required],
        type: [BlockType.Block, Validators.required],
        description: [null, Validators.required],
      }),
    });
  }

  public saveTransition() {
    if (this.transitionForm.invalid) {
      markInvalidFields(this.transitionForm);
      markInvalidFields(this.blockForm);
      this.toastService.add({
        severity: 'error',
        detail: 'Заполните обязательные поля',
      });
    }

    const formValue = this.transitionForm.getRawValue();
    console.log(formValue);
  }
}
