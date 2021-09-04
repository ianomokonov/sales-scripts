import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ScriptService } from '../../../../_services/back/script.service';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { IdNameResponse } from '../../../../_models/responses/id-name.response';
import { CreateScriptRequest } from '../../../../_models/requests/create-script.request';

@Component({
  selector: 'app-add-folder',
  templateUrl: './add-folder.component.html',
  styleUrls: ['./add-folder.component.less'],
})
export class AddFolderComponent implements OnInit {
  public folderForm: FormGroup;
  public folders: IdNameResponse[] = [];
  constructor(
    private scriptService: ScriptService,
    private fb: FormBuilder,
    private modal: DynamicDialogRef,
    private config: DynamicDialogConfig,
  ) {
    this.folderForm = fb.group({
      name: ['', [Validators.required]],
      parentFolderId: [null],
    });
  }

  ngOnInit(): void {
    this.folders = this.config.data;
  }

  public addFolder() {
    if (isFormInvalid(this.folderForm)) return;
    const folder: CreateScriptRequest = this.folderForm.getRawValue();
    if (!folder.parentFolderId) delete folder.parentFolderId;
    folder.isFolder = true;
    this.scriptService.addScript(folder).subscribe((id) => {
      this.modal.close({ ...folder, id });
    });
  }
}
