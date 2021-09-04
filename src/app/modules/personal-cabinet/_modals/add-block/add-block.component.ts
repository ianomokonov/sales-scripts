import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { isFormInvalid } from 'src/app/_utils/formValidCheck';

@Component({
  selector: 'app-add-block',
  templateUrl: './add-block.component.html',
  styleUrls: ['./add-block.component.less'],
})
export class AddBlockComponent {
  public modalForm: FormGroup;

  constructor(private fb: FormBuilder, private modal: DynamicDialogRef) {
    this.modalForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
    });
  }

  public addBlock() {
    if (isFormInvalid(this.modalForm)) return;
    // ??
    this.modal.close();
  }
}
