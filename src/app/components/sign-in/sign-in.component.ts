import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UserService } from '../../_services/back/user.service';
import { isFormInvalid } from '../../_utils/formValidCheck';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.less'],
})
export class SignInComponent {
  public logInForm: FormGroup;

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
  ) {
    this.logInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  public signIn() {
    if (isFormInvalid(this.logInForm)) return;
    const logData = this.logInForm.getRawValue();
    this.userService.signIn(logData).subscribe(
      (user) => {
        if (user) {
          this.router.navigate(['/profile']);
        }
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
