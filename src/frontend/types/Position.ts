export default class Position {
  character: number;
  line: number;

  constructor(line: number = 1, character: number = 1) {
    this.line = line;
    this.character = character;
  }

  nextLine(): void {
    this.line++;
    this.character = 1;
  }

  advance(): void {
    this.character++;
  }
}
