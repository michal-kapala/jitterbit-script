import { UnimplementedError } from "../../errors";
import Scope from "../../runtime/scope";
import { RuntimeVal } from "../../runtime/values";
import { Func, Parameter, Signature } from "../types";

/**
 * The implementation of `DiffAdd` function.
 * 
 * Requests the added records as input for the next transformation that is run.
 */
export class DiffAdd extends Func {
  constructor() {
    super();
    this.name = "DiffAdd";
    this.module = "diff";
    this.signatures = [
      new Signature("void", [])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
  }
  
  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `DiffComplete` function.
 * 
 * Flags the diff process as complete.
 * This method is to be called when the diff process completes successfully;
 * otherwise, the diff process will be left in an inconsistent state.
 * In that case, the next time the diff operation runs, no records will be processed.
 */
export class DiffComplete extends Func {
  constructor() {
    super();
    this.name = "DiffComplete";
    this.module = "diff";
    this.signatures = [
      new Signature("void", [])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
  }
  
  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `DiffDelete` function.
 * 
 * Requests the deleted records as input for the next transformation that is run.
 */
export class DiffDelete extends Func {
  constructor() {
    super();
    this.name = "DiffDelete";
    this.module = "diff";
    this.signatures = [
      new Signature("void", [])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
  }
  
  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `DiffKeyList` function.
 * 
 * Sets the list of keys to be used for uniquely identifying a record in the diff source.
 * This method is typically called in conjunction with the `InitializeDiff` function.
 * 
 * Supports up to 100-argument calls.
 */
export class DiffKeyList extends Func {
  constructor() {
    super();
    this.name = "DiffKeyList";
    this.module = "diff";
    this.signatures = [
      new Signature("void", [
        new Parameter("string", "k1"),
        new Parameter("string", "k2", false),
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 100;
  }
  
  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `DiffNode` function.
 * 
 * For hierarchical sources, this specifies the node to be used as
 * the repeating node that the diff is performed on.
 */
export class DiffNode extends Func {
  constructor() {
    super();
    this.name = "DiffNode";
    this.module = "diff";
    this.signatures = [
      new Signature("void", [new Parameter("string", "nodeName")])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }
  
  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `DiffUpdate` function.
 * 
 * Requests the updated records as input for the next transformation that is run.
 */
export class DiffUpdate extends Func {
  constructor() {
    super();
    this.name = "DiffUpdate";
    this.module = "diff";
    this.signatures = [
      new Signature("void", [])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 0;
    this.maxArgs = 0;
  }
  
  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `InitializeDiff` function.
 * 
 * Initializes a new diff session.
 * 
 * The string passed as the `diffId` must be different from all other diff identifiers
 * used on the system but it has to be the same each time the operation runs.
 * If a diff session is already running, a call to this method will fail.
 * To clear an old diff session (such as in the case of a system failure),
 * call the function `ResetDiff` once.
 * 
 * This method is typically called in the pre-source script of the first operation
 * that implements a diff/synchronization.
 */
export class InitializeDiff extends Func {
  constructor() {
    super();
    this.name = "InitializeDiff";
    this.module = "diff";
    this.signatures = [
      new Signature("void", [new Parameter("string", "diffId")])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }
  
  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `OrderedDiffKeyList` function.
 * 
 * Sets the list of keys used for uniquely identifying a record in the source and specifies
 * the key's record order as either ascending (`true`) or descending (`false`).
 * 
 * Use this method (instead of the `DiffKeyList` function) in cases where
 * the source records are guaranteed to be in a specific order.
 * 
 * Diff processing is more efficient if the source fields are ordered the same way each time.
 * In those cases, no chunk size will be used and memory use will not be an issue.
 * This method is typically called in conjunction with the `InitializeDiff` function.
 * 
 * Supports up to 100-argument calls.
 */
export class OrderedDiffKeyList extends Func {
  constructor() {
    super();
    this.name = "OrderedDiffKeyList";
    this.module = "diff";
    this.signatures = [
      new Signature("void", [
        new Parameter("string", "k1"),
        new Parameter("bool", "isAscending1"),
        new Parameter("string", "k2", false),
        new Parameter("bool", "isAscending2", false),
      ])
    ];
    this.signature = this.signatures[0];
    // TODO: the type checker should validate arg parity
    this.minArgs = 2;
    this.maxArgs = 100;
  }
  
  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `ResetDiff` function.
 * 
 * Resets an existing diff session.
 * 
 * The `action` parameter (either 0 or 1) specifies how the diff session is to be reset:
 * 
 * `0` (Reset): Completely forgets the latest snapshot and starts over from the beginning.
 * This will force the system to treat all entries as "added".
 * 
 * `1` (Purge): Removes any files left over from a previous diff session.This does not reset
 * the latest snapshot;it only clears stale files left from old, failed, or canceled diff sessions.
 * 
 * This method is typically called when something has been changed in an existing diff process
 * or if a diff process has failed and left in an inconsistent state.
 * It should not be called during normal diff processing.
 * If no diff session is present for this `diff_id`, no action is performed.
 */
export class ResetDiff extends Func {
  constructor() {
    super();
    this.name = "ResetDiff";
    this.module = "diff";
    this.signatures = [
      new Signature("void", [
        new Parameter("string", "diffId"),
        new Parameter("number", "action")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
  }
  
  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `SetDiffChunkSize` function.
 * 
 * Sets the chunk size (in bytes) used while diffing.
 * 
 * A larger chunk size will make the system use more memory but it will process the diff faster.
 * The default is 50000 bytes; if you have sufficient memory, you can increase this number.
 * 
 * This method is typically called in conjunction with the `InitializeDiff` function.
 */
export class SetDiffChunkSize extends Func {
  constructor() {
    super();
    this.name = "SetDiffChunkSize";
    this.module = "diff";
    this.signatures = [
      new Signature("void", [new Parameter("number", "chunkSize")])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }
  
  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new UnimplementedError(`[${this.name}] Evaluation of ${this.module} API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}
