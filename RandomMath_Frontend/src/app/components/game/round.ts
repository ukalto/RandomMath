export class Round {
    public number1: number;
    public number2: number;
    public symbol: string;
    public result: number;

    constructor() {
        this.number1 = this.getRandomNumber(0, 999);
        this.number2 = this.getRandomNumber(0, 999);
        this.symbol = this.getRandomSymbol();
        this.calculate();
    }

    getRandomNumber(bound1, bound2): number {
        return Math.floor(Math.random() * bound2) + bound1;
    }

    getRandomSymbol(): string {
        const num = Math.floor(Math.random() * 4);
        switch(num) {
            case 0:
                return '+';
            case 1:
                return '-';
            case 2:
                return '*';
            case 3:
                return '/';
        }
    }

    calculate() {
        switch(this.symbol) {
            case '+':
                this.result = this.number1 + this.number2;
                break;
            case '-':
                this.result = this.number1 - this.number2;
                break;
            case '*':
                this.result = this.number1 * this.number2;
                break;
            case '/':
                this.result = this.number1 / this.number2;
                break;
        }
        this.result = Math.floor(this.result * 10) / 10;
    }
}
