import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { scriptsMock } from '../../sale-scripts/scripts.mock';
import { ScriptService } from '../../../../_services/back/script.service';
import { Script } from '../../../../_entities/script.entity';
import { isFormInvalid } from '../../../../_utils/formValidCheck';

@Component({
  selector: 'app-add-folder',
  templateUrl: './add-folder.component.html',
  styleUrls: ['./add-folder.component.less'],
})
export class AddFolderComponent implements OnInit {
  public folderForm: FormGroup;
  public mock = scriptsMock;
  public folders: Script[] = [];
  public select: Script | undefined;
  constructor(
    private scriptService: ScriptService,
    private fb: FormBuilder,
    private modal: DynamicDialogRef,
  ) {
    this.folderForm = fb.group({
      name: ['', [Validators.required]],
      parentFolderId: [null],
    });
  }

  ngOnInit(): void {
    // TODO [ volik25 | 02.09.2021 ]:
    //  Удалить моку и раскомментировать запрос
    //  на сервер после введения бэка в эксплуатацию
    this.folders = this.mock.filter((item) => item.isFolder);
    // this.scriptService.getScripts({ isFolder: true }).subscribe((folders) => {
    //   this.data = folders;
    // });
  }

  public addFolder() {
    if (isFormInvalid(this.folderForm)) return;
    const folder = this.folderForm.getRawValue();
    folder.isFolder = true;
    this.scriptService.addScript(folder).subscribe((id) => {
      folder.id = id;
      this.modal.close(folder);
    });
  }
}
