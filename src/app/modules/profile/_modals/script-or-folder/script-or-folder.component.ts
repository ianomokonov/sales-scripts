import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { IdNameResponse } from '../../../../_models/responses/id-name.response';
import { ScriptService } from '../../../../_services/back/script.service';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { CreateScriptRequest } from '../../../../_models/requests/create-script.request';
import { SaveScriptRequest } from '../../../../_models/requests/save-script.request';
import { ScriptShortView } from '../../../../_models/script-short-view';

@Component({
  selector: 'app-script-or-folder',
  templateUrl: './script-or-folder.component.html',
  styleUrls: ['./script-or-folder.component.less'],
})
export class ScriptOrFolderComponent implements OnInit {
  public modalForm: FormGroup;
  private isFolder: boolean = false;
  public folders: IdNameResponse[] = [];
  private readonly currentFolder: number;
  public editData: ScriptShortView;
  constructor(
    private scriptService: ScriptService,
    private fb: FormBuilder,
    private modal: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private messageService: MessageService,
  ) {
    this.modalForm = fb.group({
      name: ['', [Validators.required]],
      parentFolderId: [null],
    });
    this.editData = this.config.data.edit;
    if (this.editData) {
      this.modalForm.patchValue(this.editData);
    }
    this.currentFolder = Number(this.config.data.currentFolder);
    if (this.currentFolder) this.modalForm.get('parentFolderId')?.setValue(this.currentFolder);
  }

  ngOnInit(): void {
    this.folders = this.config.data.folders;
    this.isFolder = this.config.data.isFolder;
  }

  public itemAction() {
    if (isFormInvalid(this.modalForm)) return;
    if (this.editData) {
      const item: SaveScriptRequest = this.modalForm.getRawValue();
      this.scriptService.updateScript(item, this.editData.id).subscribe(
        (success) => {
          if (success) {
            this.modal.close({ id: this.editData.id, ...item });
          } else {
            this.messageService.add({
              severity: 'error',
              detail: 'Не удалось обновить данные',
            });
          }
        },
        ({ error }) => {
          this.messageService.add({
            severity: 'error',
            detail: error.message,
          });
        },
      );
    } else {
      const item: CreateScriptRequest = this.modalForm.getRawValue();
      if (!item.parentFolderId) delete item.parentFolderId;
      item.isFolder = this.isFolder;
      this.scriptService.addScript(item).subscribe(
        (id) => {
          this.modal.close(id);
        },
        ({ error }) => {
          this.messageService.add({
            severity: 'error',
            detail: error.message,
          });
        },
      );
    }
  }
}
