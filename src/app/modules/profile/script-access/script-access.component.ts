import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-script-access',
  templateUrl: './script-access.component.html',
  styleUrls: ['./script-access.component.less'],
})
export class ScriptAccessComponent implements OnInit {
  // public userSelectControl: FormControl;

  constructor() {}

  ngOnInit(): void {}

  public searchUser(event: any) {
    console.log(event);
  }
}
