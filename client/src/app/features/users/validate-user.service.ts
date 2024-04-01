import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IUser } from 'src/app/models/user.interfaces';

@Injectable({
    providedIn: 'root'
})
export class ValidateUserService {

    constructor() { }

    loginValidate(formData: NgForm): { hasError: boolean, error: string, verifiedInput: { email: string, password: string } } {
        const userInputTrimmed = Object
            .entries(formData.value)
            .reduce((acc, currentValue) => {
                currentValue[1] = typeof currentValue[1] === 'string'
                    ? currentValue[1].trim()
                    : currentValue[1];

                return Object.assign({ [currentValue[0]]: currentValue[1] }, acc);
            }, {}) as { email: string, password: string };

        const result: { hasError: boolean, error: string, verifiedInput: { email: string, password: string } } = {
            hasError: false,
            error: '',
            verifiedInput: userInputTrimmed
        };

        if (Object.values(result.verifiedInput).some(v => v === '')) {
            result.error = 'All fields are required';

        } else if (/^[\w]+@[\w]+\.[\w]+$/.test(result.verifiedInput.email) === false) {
            result.error = 'The email entered is invalid';

        } else if (result.verifiedInput.password.length < 6) {
            result.error = 'Password must be at least 6 characters long';

        }

        if (result.error) {
            result.hasError = true;
        }

        return result;
    }

    registerValidate(userInput: IUser, repass: string): { hasError: boolean, error: string, verifiedInput: IUser } {
        const userInputTrimmed = Object.entries(userInput)
            .reduce((acc, currentValue) => {
                currentValue[1] = typeof currentValue[1] === 'string'
                    ? currentValue[1].trim()
                    : currentValue[1];

                return Object.assign({ [currentValue[0]]: currentValue[1] }, acc);
            }, {}) as IUser;

        const result: { hasError: boolean, error: string, verifiedInput: IUser } = {
            hasError: false,
            error: '',
            verifiedInput: userInputTrimmed
        };

        if (Object.values(result.verifiedInput).some(v => v === '')) {
            result.error = 'All fields are required';

        } else if (result.verifiedInput.name.length < 2 || result.verifiedInput.name.length > 30) {
            result.error = 'The name must be between 2 and 30 characters';

        } else if (/^[\w]+@[\w]+\.[\w]+$/.test(result.verifiedInput.email) === false) {
            result.error = 'The email entered is invalid';

        } else if (/^\+\d{3}\d{3}\d{3}\d{3}$/.test(result.verifiedInput.phone) === false) {
            result.error = 'Please use the following format +359111222333';

        } else if (result.verifiedInput.address.length < 5 || result.verifiedInput.address.length > 100) {
            result.error = 'The address must be between 5 and 100 characters';

        } else if (result.verifiedInput.password.length < 6) {
            result.error = 'Password must be at least 6 characters long';

        } else if (result.verifiedInput.password != repass) {
            result.error = 'The passwords do not match';
        }

        if (result.error) {
            result.hasError = true;
        }

        return result;
    }
}