import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../_services/back/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.less'],
})
export class SignInComponent {
  public logInForm: FormGroup;

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder) {
    this.logInForm = this.initForm();
  }

  public signIn() {
    const logData = this.logInForm?.getRawValue();
    this.userService.logIn(logData).subscribe((user) => {
      if (user) {
        this.router.navigate(['/profile']);
      }
    });
  }

  private initForm() {
    return this.fb.group({
      login: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }
}
