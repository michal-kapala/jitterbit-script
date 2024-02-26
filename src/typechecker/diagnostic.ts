import { Position } from "../frontend/types";

/**
 * Diagnostic information emitted by Jitterbit typechecker.
 */
export default class Diagnostic {
  start: Position;
  end: Position;
  msg: string;
  error: boolean;

  constructor(start: Position, end: Position, msg: string, error = true) {
    this.start = start;
    this.end = end;
    this.msg = msg;
    this.error = error;
  }
}
