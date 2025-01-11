import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function bothFieldsRequiredValidator(field1: string, field2: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        const control1 = formGroup.get(field1);
        const control2 = formGroup.get(field2);

        if (!control1 || !control2) {
            return null; // Return null if controls are missing
        }

        const isValid = control1.value && control2.value;

        return isValid ? null : { bothFieldsRequired: true };
    };
}
