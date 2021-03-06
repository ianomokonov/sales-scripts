import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ScriptService } from 'src/app/_services/back/script.service';
import { markInvalidFields } from 'src/app/_utils/formValidCheck';

@Component({
  selector: 'app-save-param',
  templateUrl: './save-param.component.html',
  styleUrls: ['./save-param.component.less'],
})
export class SaveParamComponent {
  public paramForm: FormGroup;
  public isEditing = false;

  constructor(
    private fb: FormBuilder,
    public modal: DynamicDialogRef,
    private scriptService: ScriptService,
    private config: DynamicDialogConfig,
    private messageService: MessageService,
  ) {
    this.paramForm = this.fb.group({
      name: [null, Validators.required],
    });

    if (config.data.param) {
      this.isEditing = true;
      this.paramForm.patchValue(this.config.data.param);
    }
  }

  public save() {
    if (this.paramForm.invalid) {
      markInvalidFields(this.paramForm);
      return;
    }

    const formValue = this.paramForm.getRawValue();

    if (!this.isEditing) {
      this.scriptService.addScriptParam(this.config.data.scriptId, formValue.name.trim()).subscribe(
        () => this.modal.close(true),
        (error) => {
          this.messageService.add({
            severity: 'error',
            detail: error.error?.message || 'Ошибка создания переменной скрипта',
          });
        },
      );
      return;
    }

    this.scriptService
      .updateScriptParam(
        { name: formValue.name.trim(), id: this.config.data.param.id },
        this.config.data.scriptId,
      )
      .subscribe(
        () => this.modal.close(true),
        (error) => {
          this.messageService.add({
            severity: 'error',
            detail: error.error?.message || 'Ошибка изменения переменной скрипта',
          });
        },
      );
  }
}
