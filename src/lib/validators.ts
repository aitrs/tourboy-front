export class ValidatorPerformer {
    private _required: boolean = false;
    private _pattern?: RegExp;

    constructor(required: boolean, pattern: RegExp) {
        if (required) {
            this._required = required;
        } else {
            this._pattern = pattern;
        }
    }

    perform<T>(value: T): boolean {
        let v = `${value}`;
        if (this._required) {
            if (value) {
                return (v !== '');
            } else {
                return false;
            }
        } else {
            if (!value) {
                return true;
            } else if (v === '') {
                return true;
            } else if (this._pattern) {
                const matches = v.match(this._pattern);
                return matches ? matches.length > 0 : false;
            }
            else return true;
        }
    }
}

export class Validators {
    static get Required() {
        return new ValidatorPerformer(true, /_/);
    }

    static Pattern(p: RegExp) {
        return new ValidatorPerformer(false, p);
    }

    static get Email() {
        return this.Pattern(/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/);
    }
}