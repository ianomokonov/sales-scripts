import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../_services/back/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.less'],
})
export class SignUpComponent {
  public signUpForm: FormGroup;
  public passwordError = false;
  public showPassword = false;
  public showPasswordConfirm = false;

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder) {
    this.signUpForm = this.initForm();
  }

  public signUp() {
    if (this.signUpForm.invalid) {
      for (const control in this.signUpForm.controls) {
        if (this.signUpForm.get(control)?.invalid) {
          this.signUpForm.get(control)?.markAsDirty();
        }
      }
      return;
    }
    if (!this.checkPassword()) {
      this.passwordError = true;
      return;
    }
    const signUpData = this.signUpForm?.getRawValue();
    this.userService.addUser(signUpData).subscribe((user) => {
      if (user) {
        this.router.navigate(['/profile']);
      }
    });
  }

  private initForm() {
    return this.fb.group({
      email: new FormControl('', [Validators.email, Validators.required]),
      phone: new FormControl('', [Validators.required]),
      login: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      passwordConfirm: new FormControl('', [Validators.required]),
    });
  }

  private checkPassword() {
    const { password, passwordConfirm } = this.signUpForm.getRawValue();
    return password === passwordConfirm;
  }
}
