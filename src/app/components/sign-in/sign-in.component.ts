import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../_services/back/user.service';
import { isFormInvalid } from '../../_utils/formValidCheck';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.less'],
})
export class SignInComponent {
  public logInForm: FormGroup;

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder) {
    this.logInForm = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  public signIn() {
    if (isFormInvalid(this.logInForm)) return;
    const logData = this.logInForm?.getRawValue();
    this.userService.signIn(logData).subscribe((user) => {
      if (user) {
        this.router.navigate(['/profile']);
      }
    });
  }
}
