import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export default class Validation {
  static match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);

      if (checkControl?.errors && !checkControl.errors.matching) {
        return null;
      }

      if (control?.value !== checkControl?.value) {
        controls.get(checkControlName)?.setErrors({ matching: true });
        return { matching: true };
      } else {
        controls.get(checkControlName)?.setErrors(null);
        return null;
      }
    };
  }

  static notBlank(control: AbstractControl): ValidationErrors | null {
    if (!!control?.value) {
      // console.log(typeof control.value);
      if (control.value.trim().length === 0) {
        return { required: true };
      }
      return null;
    }
    return { required: true };
  }
}
