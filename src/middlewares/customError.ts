export default class CustomError {
    position = '';
    key = '';
    value = '';
    constructor(position: string, key: string, value: string) {
        this.position = position;
        this.key = key;
        this.value = value;
    }
}
