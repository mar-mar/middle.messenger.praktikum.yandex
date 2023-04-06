enum ERRORS {
    loginError = `Логин должен содержать от 3 до 20 символов: латиницу, может содержать цифры, но не состоять из них, 
без пробелов, без спецсимволов (допустимы - и _).`,
    passwordError = "Пароль должен содержать от 8 до 40 символов. Обязательно хотя бы одна заглавная буква и цифра",
    nameError = "латиница или кириллица, первая буква должна быть заглавной, без пробелов и без цифр, нет спецсимволов (допустим только дефис)",
    emailError = `латиница, может включать цифры и спецсимволы вроде дефиса, обязательно должна быть «собака» (@) и 
точка после неё, но перед точкой обязательно должны быть буквы`,
    phoneError = "от 10 до 15 символов, состоит из цифр, может начинается с плюса",
    messageError = "Не должно быть пустым",
    passwordDiffError = "Пароли должны совпадать",
    chatNameError = "Имя чата не должно быть пустым и должно содержать не более 50 символов",
    filterNameError = "Фильтр может содержать только буквы, пробел и дефис",
    filterLoginError = "Фильтр может содержать только буквы (латиница), цифры, дефис и нижнее подчёркивание"
}


export function validateLogin(value: string): string {
    //от 3 до 20 символов, латиница, может содержать цифры, но не состоять из них, 
    //без пробелов, без спецсимволов (допустимы дефис и нижнее подчёркивание).
    
    return /^(?=.*[a-zA-Z-_])[\w_-]{3,20}$/.test(value) ? "" : ERRORS.loginError;
}

export function validateFilterLogin(value: string): string {
    return /^[a-zA-Z-_\d]*$/.test(value) ? "" : ERRORS.filterLoginError;
}


export function validatePassword(value: string): string {
    //от 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра
    
    return /^(?=.*[A-Z])(?=.*[0-9])[\s\S]{8,40}$/.test(value) ? "" : ERRORS.passwordError;
}

export function validateCopyPassword(value: string, copyValue: string) {
    if (copyValue !== value) {
        return ERRORS.passwordDiffError;
    }
    return "";
}

export function validateName(value: string): string {
    //латиница или кириллица, первая буква должна быть заглавной, без пробелов и без цифр, нет спецсимволов (допустим только дефис).

    return /^[A-ZА-ЯЁ]+[a-zA-Zа-яА-ЯёЁ-]*$/.test(value) ? "" : ERRORS.nameError;
}

export function validateFilterName(value: string): string {
    return /^[a-zA-Zа-яА-ЯёЁ-\s]*$/.test(value) ? "" : ERRORS.filterNameError;
}

export function validateEmail(value: string): string {
    // латиница, может включать цифры и спецсимволы вроде дефиса, обязательно должна быть «собака» (@) и 
    // точка после неё, но перед точкой обязательно должны быть буквы.
    return /^[\w!#$%&'*+\/=?^_`{|}~-]+@(?=.*[a-z].*\.)\w+\.\w+$/.test(value) ? "" : ERRORS.emailError;
}

export function validatePhone(value: string): string {
    //от 10 до 15 символов, состоит из цифр, может начинается с плюса.

    return /^[\+]?\d{10,15}$/.test(value) ? "" : ERRORS.phoneError;
}

export function validateMessage(value: string): string {
    //не должно быть пустым

    return value ? "" : ERRORS.messageError;
}

export function validateChatName(value: string): string {
    
    return (value && value.length <= 50) ? "" : ERRORS.chatNameError;
}

