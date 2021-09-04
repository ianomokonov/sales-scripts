import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IdNameResponse } from '../../../../_models/responses/id-name.response';
import { ScriptService } from '../../../../_services/back/script.service';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { CreateScriptRequest } from '../../../../_models/requests/create-script.request';

@Component({
  selector: 'app-add-script-or-folder',
  templateUrl: './add-script-or-folder.component.html',
  styleUrls: ['./add-script-or-folder.component.less'],
})
export class AddScriptOrFolderComponent implements OnInit {
  public modalForm: FormGroup;
  private isFolder: boolean = false;
  public folders: IdNameResponse[] = [];
  constructor(
    private scriptService: ScriptService,
    private fb: FormBuilder,
    private modal: DynamicDialogRef,
    private config: DynamicDialogConfig,
  ) {
    this.modalForm = fb.group({
      name: ['', [Validators.required]],
      parentFolderId: [null],
    });
  }

  ngOnInit(): void {
    this.folders = this.config.data.folders;
    this.isFolder = this.config.data.isFolder;
  }

  public addItem() {
    if (isFormInvalid(this.modalForm)) return;
    const item: CreateScriptRequest = this.modalForm.getRawValue();
    if (!item.parentFolderId) delete item.parentFolderId;
    item.isFolder = this.isFolder;
    this.scriptService.addScript(item).subscribe((id) => {
      if (this.isFolder) {
        this.modal.close({ ...item, id });
      } else {
        this.modal.close(id);
      }
    });
  }
}
