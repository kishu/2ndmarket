import { Directive } from '@angular/core';
import { AbstractControl, FormGroup, NG_VALIDATORS, Validator, ValidatorFn, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appPasswordValidator]',
  providers: [{provide: NG_VALIDATORS, useExisting: PasswordValidatorDirective, multi: true}]
})
export class PasswordValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors {
    return passwordValidator(control);
  }
}

export const passwordValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password1 = control.get('password1').value;
  const password2 = control.get('password2').value;

  return ( password1 !== password2 ) ? { passwordMismatch: true } : null;
};
