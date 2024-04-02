import { Injectable } from '@angular/core';
import { IProduct } from 'src/app/models/product.interfaces';

@Injectable({
    providedIn: 'root'
})
export class ValidateProductService {

    constructor() { }

    validate(productData: IProduct): { hasError: boolean, error: string, verifiedInput: IProduct } {
        const productDataTrimmed = Object
            .entries(productData)
            .reduce((acc, currentValue) => {
                currentValue[1] = typeof currentValue[1] === 'string'
                    ? currentValue[1].trim()
                    : currentValue[1];

                return Object.assign({ [currentValue[0]]: currentValue[1] }, acc);
            }, {}) as IProduct;

        const result: { hasError: boolean, error: string, verifiedInput: IProduct } = {
            hasError: false,
            error: '',
            verifiedInput: productDataTrimmed
        };

        if (Object.values(result.verifiedInput).some(v => v === '')) {
            result.error = 'All fields are required';

        } else if (result.verifiedInput.name.length < 3 || result.verifiedInput.name.length > 100) {
            result.error = 'The name of the toy must be between 3 and 100 characters';

        } else if (result.verifiedInput.description.length < 2 || result.verifiedInput.description.length > 70) {
            result.error = 'The description must be between 2 and 70 characters';

        } else if (isNaN(Number(result.verifiedInput.price)) || Number(result.verifiedInput.price) < 0) {
            result.error = 'Please enter a correct price'

        } else if (result.verifiedInput.material.length < 3 || result.verifiedInput.material.length > 20) {
            result.error = 'The material it is made of must be between 3 and 20 characters';

        } else if (/^https?:\/\/[^ ]+$/.test(result.verifiedInput.image) === false) {
            result.error = 'Image must be a link starting with http:// or https://'
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
