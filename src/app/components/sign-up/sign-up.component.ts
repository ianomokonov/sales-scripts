import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from '../../_services/back/user.service';
import { isFormInvalid } from '../../_utils/formValidCheck';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.less'],
})
export class SignUpComponent {
  public signUpForm: FormGroup;
  public showPassword = false;
  public showPasswordConfirm = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
  ) {
    this.signUpForm = this.fb.group(
      {
        email: ['', [Validators.email, Validators.required]],
        login: ['', [Validators.required]],
        phone: [''],
        password: ['', [Validators.required]],
        passwordConfirm: [''],
      },
      { validators: this.checkPasswords },
    );
  }

  public signUp() {
    if (isFormInvalid(this.signUpForm)) return;
    const signUpData = this.signUpForm?.getRawValue();
    this.userService.signUp(signUpData).subscribe(
      (user) => {
        if (user) {
          this.router.navigate(['/profile']);
        }
      },
      ({ error }) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Что-то пошло не так...',
          detail: error.message,
        });
      },
    );
  }

  private checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('passwordConfirm')?.value;
    return pass === confirmPass ? null : { notSame: true };
  };
}
