import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function ExistSpace(controlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    if (control.errors && !control.errors.existSpace) {
      // return if another validator has already found an error on the matchingControl
      return;
    }
    // set error on Control if validation fails
    if (/\s/g.test(control.value)) {
      control.setErrors({ existSpace: true });
    } else {
      control.setErrors(null);
    }
  };
}

