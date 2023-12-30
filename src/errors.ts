/**
 * Named exceptions, e.g. thrown by `RaiseError` function.
 */
export class NamedError extends Error {
  constructor(message: string, src?: string) {
    super();
    if(src !== undefined)
      this.name = src;
    this.message =  message;
  }
}
