import { UntypedFormGroup, UntypedFormControl, AbstractControl } from '@angular/forms';
import { DateUtility } from './date.utility';

export class FormUtility {

	/**
	 * Returns a form data object
	 * @param json
	 */
	static jsonToFormData(json: any, fd?: FormData, parentKey?: string): FormData {
		fd = fd ? fd : new FormData();

		for (const key in json) {

			const parsedKey: string = parentKey ? parentKey + '[' + key + ']' : key;

			if (json[key] instanceof Array || (json[key] !== null && typeof json[key] === 'object' && !(json[key] instanceof File) && !(json[key] instanceof Blob))) {
				FormUtility.jsonToFormData(json[key], fd, parsedKey);
			} else {
				fd.append(parsedKey, json[key]);
			}
		}
		return fd;
	}

	/**
	 * Find an Blob or File object in json
	 * @param json
	 */
	static needFormData(json: any): boolean {
		let need: boolean = false;
		for (const key in json) {
			if (json[key] instanceof File || json[key] instanceof Blob) {
				need = true;
				break;
			}
		}
		return need;
	}

	/**
	 * Trigger form validations
	 * @param formGroup
	 */
	static validateAllFormFields(formGroup: UntypedFormGroup): void {
		Object.keys(formGroup.controls).forEach((field: string) => {
			const control = formGroup.get(field);
			if (control instanceof UntypedFormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof UntypedFormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}

	static validatePasswordConfirmation(control: AbstractControl): {[key: string]: any}  {
		const equals = control.value ? control.value === control.root.value.password : true;
		return !equals ? {'passwordConfirmationNotEquals': {value: control.value}} : null;
	};

	static validateDate(control: AbstractControl): {[key: string]: any}  {
		return !DateUtility.validate(control.value) ? {'required': {value: control.value}} : null;
	};
}