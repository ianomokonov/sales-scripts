import { FormGroup } from '@angular/forms';

export function markInvalidFields(form: FormGroup) {
  if (!form) {
    return;
  }
  Object.keys(form.controls).forEach((control) => {
    if (form.get(control)?.invalid) {
      form.get(control)?.markAsDirty();
    }
  });
}

export function isFormInvalid(form: FormGroup): boolean {
  if (form?.invalid) {
    markInvalidFields(form);
    return true;
  }
  return false;
}
