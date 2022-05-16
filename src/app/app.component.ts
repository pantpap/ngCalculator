import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  input: string = '';
  result: string = '';

  constructor() {}

  ngOnInit() {
  }

  pressNum(num: string) {
    if (num == ".") {
      if (this.input != "") {
        const lastNum = this.getLastOperand();
        if (lastNum.lastIndexOf(".") >= 0) return;
      }
    }
    if (num == "0") {
      if (this.input == "") {
        return;
      }
      const PrevKey = this.input[this.input.length - 1];
      if (PrevKey === '/' || PrevKey === '*' || PrevKey === '-' || PrevKey === '+') {
        return;
      }
    }
    this.input += num;
    this.calcAnswer();
  }

  pressOperator(op: string) {
    const lastKey = this.input[this.input.length - 1];
    if (lastKey === '/' || lastKey === '*' || lastKey === '-' || lastKey === '+' || lastKey === 's' || lastKey === 'c') {
      return;
    }
    this.input = this.input + op;
    this.calcAnswer();
  }

  clear() {
    if (this.input != "") {
      this.input = this.input.substr(0, this.input.length - 1);
    }
  }

  allClear() {
    this.result = '';
    this.input = '';
  }

  getAnswer() {
    this.calcAnswer();
    this.input = this.result;
    if (this.input == "0") this.input = "";
  }

  private getLastOperand() {
    let pos: number;
    pos = this.input.toString().lastIndexOf("+");
    if (this.input.toString().lastIndexOf("-") > pos) pos = this.input.lastIndexOf("-");
    if (this.input.toString().lastIndexOf("*") > pos) pos = this.input.lastIndexOf("*");
    if (this.input.toString().lastIndexOf("/") > pos) pos = this.input.lastIndexOf("/");
    if (this.input.toString().lastIndexOf("s") > pos) pos = this.input.lastIndexOf("s");
    if (this.input.toString().lastIndexOf("c") > pos) pos = this.input.lastIndexOf("c");
    return this.input.substr(pos + 1);
  }

  private calcAnswer() {
    let formula = this.input;
    let lastKey = formula[formula.length - 1];
    if (lastKey === '.') {
      formula = formula.substr(0, formula.length - 1);
    }
    if (lastKey === '/' || lastKey === '*' || lastKey === '-' || lastKey === '+' || lastKey === '.' || lastKey === 's' || lastKey === 'c') {
      formula = formula.substr(0, formula.length - 1);
    }
    this.result = this.evaluateExpression(formula);
  }

  private evaluateExpression(expr: any){
    let numbers = []
    let operators: string[] = []
    let index: number = 0
    let lastOperator: boolean = true;

    const characters = expr.split('');
    numbers[index] = '';

    this.splitNumberOperators(characters, operators, lastOperator, index, numbers);
    expr = parseFloat(numbers[0]);
    return this.calculation(operators, expr, numbers);
  }

  private calculation(operators: string[] , expr: any, numbers: string[]) {
    for(let i = 0; i < operators.length; i++ ){
      const num = parseFloat(numbers[i + 1]);
      switch (operators[i]) {
        case "+":
          expr = expr + num;
          break;
        case "-":
          expr = expr - num;
          break;
        case "*":
          expr = expr * num;
          break;
        case "/":
          expr = expr / num;
          break;
        case "s":
          expr = Math.sin(num);
          break;
        case "c":
          expr = Math.cos(num);
          break;
      }
    }
    return expr;
  }

  private splitNumberOperators(characters: string[], operators: string[], lastOperator: boolean, index: number, numbers: string[]){
    for(let c = 0; c < characters.length; c++){
      if(characters[c] === ' '){
        break;
      }
      if(isNaN(parseInt(characters[c])) && characters[c] !== '.' && !lastOperator){
        operators[index] = characters[c];
        index ++;
        numbers[index] = '';
        lastOperator = true;
      } else {
        numbers[index] += characters[c];
        lastOperator = false;
      }
    }
  }

}
