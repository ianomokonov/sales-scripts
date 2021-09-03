import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { IdNameResponse } from '../../../../_models/responses/id-name.response';
import { ScriptService } from '../../../../_services/back/script.service';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { CreateScriptRequest } from '../../../../_models/requests/create-script.request';

@Component({
  selector: 'app-add-script',
  templateUrl: './add-script.component.html',
  styleUrls: ['./add-script.component.less'],
})
export class AddScriptComponent implements OnInit {
  public scriptForm: FormGroup;
  public folders: IdNameResponse[] = [];
  constructor(
    private scriptService: ScriptService,
    private fb: FormBuilder,
    private modal: DynamicDialogRef,
  ) {
    this.scriptForm = fb.group({
      name: ['', [Validators.required]],
      parentFolderId: [null],
    });
  }

  ngOnInit(): void {
    this.scriptService.getFolders().subscribe((folders) => {
      this.folders = folders;
    });
  }

  public addScript() {
    if (isFormInvalid(this.scriptForm)) return;
    const script: CreateScriptRequest = this.scriptForm.getRawValue();
    if (!script.parentFolderId) delete script.parentFolderId;
    script.isFolder = false;
    this.scriptService.addScript(script).subscribe((id) => {
      this.modal.close(id);
    });
  }
}
