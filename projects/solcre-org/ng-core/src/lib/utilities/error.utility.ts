import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorModel } from '../api/api-error.model';

export class ErrorUtility {

	//Parse http error
	static parseHttpError(error: HttpErrorResponse): ApiErrorModel {
		let errorMessage: ApiErrorModel = new ApiErrorModel("errors.genericError");

		//Check title
		if (error && error.statusText) {
			switch (error.statusText) {
				case "invalid_grant":
					errorMessage.message = "errors.password";
					break;
				case "Unprocessable Entity":
					//Parse validation messages
					this.parseHttpValidationsError(error, errorMessage);
					break;
				default:
					//Check error .detail
					if (error.error) {
						if (error.error.error_code/* && !this.mustIgnoreErrorCode(error.error.error_code)*/) {
							errorMessage.message = "errors.api." + error.error.error_code;
						} else if (error.error.detail) {
							errorMessage.message = error.error.detail;
						}
					}
					break;
			}
		}
		return errorMessage;
	}

	//Parse apigility validation
	static parseHttpValidationsError(httpError: any, errorMessage: ApiErrorModel): void {
		//Validate error
		if (httpError && httpError.error && httpError.error.validation_messages) {
			let errorCode: string = null;
			let fields: string[] = [];
			let fieldErrors: any = null;

			//Get errors
			for (let field in httpError.error.validation_messages) {
				fieldErrors = httpError.error.validation_messages[field];

				//Check errors
				for (let errorKey in fieldErrors) {
					//Load the first error, we can only display one error at time
					if (!errorCode) {
						errorCode = errorKey;
					}

					//Load field if is the same error
					if (errorCode === errorKey) {
						fields.push(field);
					}
				}
			}

			//Check error code
			if (errorCode) {
				//Load message
				switch (errorCode) {
					case "isEmpty":
						errorMessage.message = "errors.requiredApi";
						break;
					case "stringLengthTooLong":
						errorMessage.message = "errors.toLoongApi";

						break;
				}

				//Load fields
				errorMessage.params = {
					"fields": fields.join(", ")
				};
			}
		}
	}
}