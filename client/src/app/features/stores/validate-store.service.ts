import { Injectable } from '@angular/core';
import { IStore } from 'src/app/models/store.interfaces';

@Injectable({
    providedIn: 'root'
})
export class ValidateStoreService {

    constructor() { }

    validate(storeData: IStore): { hasError: boolean, error: string, verifiedInput: IStore } {
        const storeDataTrimmed = Object
            .entries(storeData)
            .reduce((acc, currentValue) => {
                currentValue[1] = typeof currentValue[1] === 'string'
                    ? currentValue[1].trim()
                    : currentValue[1];

                return Object.assign({ [currentValue[0]]: currentValue[1] }, acc);
            }, {}) as IStore;

        const result: { hasError: boolean, error: string, verifiedInput: IStore } = {
            hasError: false,
            error: '',
            verifiedInput: storeDataTrimmed
        };

        if (Object.values(result.verifiedInput).some(v => v === '')) {
            result.error = 'All fields are required';

        } else if (result.verifiedInput.name.length < 2 || result.verifiedInput.name.length > 50) {
            result.error = 'The name must be between 2 and 50 characters';

        } else if (result.verifiedInput.category.length < 2 || result.verifiedInput.category.length > 50) {
            result.error = 'Category must be between 2 and 50 characters';

        } else if (result.verifiedInput.description.length < 5 || result.verifiedInput.description.length > 200) {
            result.error = 'The description must be between 5 and 200 characters';

        } else if (/^https?:\/\/[^ ]+$/.test(result.verifiedInput.image) === false) {
            result.error = 'Image must be a link starting with http:// or https://';

        }

        if (result.error) {
            result.hasError = true;
        }

        return result;
    }

    validateImagePath(imagePath: string): string {
        return /^https?:\/\/[^ ]+$/.test(imagePath) ? imagePath : '';
    }
}