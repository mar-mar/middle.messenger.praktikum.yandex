export function validateLogin(value: string): boolean {
    //от 3 до 20 символов, латиница, может содержать цифры, но не состоять из них, 
    //без пробелов, без спецсимволов (допустимы дефис и нижнее подчёркивание).
    
    return /^(?=.*[a-zA-Z-_])[\w_-]{3,20}$/.test(value);
}


export function passwordLogin(value: string): boolean {
    //от 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра
    
    return /^(?=.*[A-Z])(?=.*[0-9])[\s\S]{8,40}$/.test(value);
}
