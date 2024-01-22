/**
 * Runtime exceptions, e.g. thrown by `RaiseError` function.
 */
export class RuntimeError extends Error {
  constructor(message: string, src?: string) {
    super();
    if(src !== undefined)
      this.name = src;
    this.message =  message;
  }
}

/**
 * Indicates that the functionality has not been implemented yet.
 */
export class UnimplementedError extends RuntimeError {}
