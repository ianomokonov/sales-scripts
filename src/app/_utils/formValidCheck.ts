import { FormGroup } from '@angular/forms';

export function isFormInvalid(form: FormGroup): boolean {
  if (form.invalid) {
    Object.keys(form.controls).forEach((control) => {
      if (form.get(control)?.invalid) {
        form.get(control)?.markAsDirty();
      }
    });
    return true;
  }
  return false;
}
