import * as ValidateController from "../controllers/ValidateController";

export function validateLogin(value: string): string {

    return ValidateController.validateLogin(value);
}


export function validatePassword(value: string): string {

    return ValidateController.validatePassword(value);
}

export function validateCopyPassword(value: string, copyValue: string) {

    return ValidateController.validateCopyPassword(value, copyValue);
}

export function validateName(value: string): string {

    return ValidateController.validateName(value);
}

export function validateEmail(value: string): string {

    return ValidateController.validateEmail(value);
}

export function validatePhone(value: string): string {

    return ValidateController.validatePhone(value);
}

export function validateMessage(value: string): string {

    return ValidateController.validateMessage(value);
}
