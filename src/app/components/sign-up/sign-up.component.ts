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
import { UserService } from '../../_services/back/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.less'],
})
export class SignUpComponent {
  public signUpForm: FormGroup;
  public showPassword = false;
  public showPasswordConfirm = false;

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder) {
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
    if (this.signUpForm.invalid) {
      Object.keys(this.signUpForm.controls).forEach((control) => {
        if (this.signUpForm.get(control)?.invalid) {
          this.signUpForm.get(control)?.markAsDirty();
        }
      });
      return;
    }
    const signUpData = this.signUpForm?.getRawValue();
    this.userService.signUp(signUpData).subscribe((user) => {
      if (user) {
        this.router.navigate(['/profile']);
      }
    });
  }

  private checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('passwordConfirm')?.value;
    return pass === confirmPass ? null : { notSame: true };
  };
}