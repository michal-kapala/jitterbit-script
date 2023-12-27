import Scope from "../../runtime/scope";
import { JbBool } from "../../runtime/types";
import { RuntimeVal } from "../../runtime/values";
import { Func, Parameter, Signature } from "../types";

/**
 * The implementation of `Attribute` function.
 * 
 * Creates an attribute for an XML node. See also the `CreateNode` function.
 */
export class Attribute extends Func {
  constructor() {
    super();
    this.name = "Attribute";
    this.module = "xml";
    this.signatures = [
      new Signature("type", [
        new Parameter("string", "attributeName"),
        new Parameter("string", "attributeValue"),
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new Error(`[${this.name}] Evaluation of XML API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `CreateNode` function.
 * 
 * Creates a string representing an XML node.
 * If the target node is the value node of an XML Any node,
 * an XML element corresponding to the `nodeName` and `nodeValue` will be created.
 * 
 * Starting from the third argument, a series of values, attributes,
 * and sub-nodes can be specified. Values are specified directly.
 * Attributes and sub-nodes can be created with the `Attribute` and `CreateNode`
 * functions respectively.
 * 
 * Supports up to 100 subelement calls.
 */
export class CreateNode extends Func {
  constructor() {
    super();
    this.name = "CreateNode";
    this.module = "xml";
    this.signatures = [
      new Signature("type", [
        new Parameter("string", "namespace"),
        new Parameter("string", "nodeName"),
        new Parameter("type", "attributeSubelement"),
        new Parameter("type", "attributeSubelement2", false)
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 3;
    // POD: subelement limit
    this.maxArgs = 100;
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new Error(`[${this.name}] Evaluation of XML API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `GetNodeName` function.
 * 
 * Retrieves the name of a node.
 * This method is typically used to retrieve the name of a node returned by either
 * of the `SelectNodeFromXMLAny` or `SelectSingleNode` functions.
 * 
 * To enter a path to a node into the function for the path parameter,
 * drag and drop the desired XML node folder from the Source Objects tab
 * of the script component palette to the script to insert its qualified path
 * at the location of your cursor, or enter its reference path manually.
 * For more information, see the instructions on inserting source objects.
 */
export class GetNodeName extends Func {
  constructor() {
    super();
    this.name = "GetNodeName";
    this.module = "xml";
    this.signatures = [
      new Signature("string", [
        // the type from the docs is wrong
        new Parameter("string", "path")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new Error(`[${this.name}] Evaluation of XML API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `GetNodeValue` function.
 * 
 * Retrieves the value of a node.
 * This method is typically used to retrieve the value of a node returned by either
 * of the `SelectNodeFromXMLAny` or `SelectSingleNode` functions.
 * 
 * To enter a path to a node into the function for the path parameter,
 * drag and drop the desired XML node folder from the Source Objects tab
 * of the script component palette to the script to insert its qualified path
 * at the location of your cursor, or enter its reference path manually.
 * For more information, see the instructions on inserting source objects.
 */
export class GetNodeValue extends Func {
  constructor() {
    super();
    this.name = "GetNodeValue";
    this.module = "xml";
    this.signatures = [
      new Signature("string", [
        // the type from the docs is wrong
        new Parameter("string", "path")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new Error(`[${this.name}] Evaluation of XML API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `GetXMLString` function.
 * 
 * Returns (when used in a transformation mapping) the corresponding XML string found
 * in the source XML document at the specified path.
 * 
 * To enter a path to a node into the function for the path parameter,
 * drag and drop the desired XML node folder from the Source Objects tab
 * of the script component palette to the script to insert its qualified path
 * at the location of your cursor, or enter its reference path manually.
 * For more information, see the instructions on inserting source objects.
 */
export class GetXMLString extends Func {
  constructor() {
    super();
    this.name = "GetXMLString";
    this.module = "xml";
    this.signatures = [
      new Signature("string", [
        // the type from the docs is wrong
        new Parameter("string", "path"),
        new Parameter("bool", "qualified", false, new JbBool(false))
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 2;
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new Error(`[${this.name}] Evaluation of XML API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `IsNil` function.
 * 
 * Returns (when used in a Formula Builder mapping) if the corresponding XML node has
 * the attribute `xsi:nil` with the value of true (or 1).
 * 
 * To enter a path to a node into the function for the path parameter,
 * drag and drop the desired XML node folder from the Source Objects tab
 * of the script component palette to the script to insert its qualified path
 * at the location of your cursor, or enter its reference path manually.
 * For more information, see the instructions on inserting source objects.
 * 
 * As described in XML Schema, an element may be valid without content
 * if it has the attribute `xsi:nil` with the value `true`.
 */
export class IsNil extends Func {
  constructor() {
    super();
    this.name = "IsNil";
    this.module = "xml";
    this.signatures = [
      new Signature("bool", [
        new Parameter("string", "path")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 1;
    this.maxArgs = 1;
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new Error(`[${this.name}] Evaluation of XML API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `RunXSLT` function.
 * 
 * Supports running XSLT (v1-3) on a number of input XML documents.
 * Takes as input an XSLT stylesheet and one or more XML documents
 * and returns an array of XML documents.
 * 
 * The `xslt` parameter used in this function call must be defined as an activity
 * associated with a file-type endpoint in the current project that returns an XSLT stylesheet.
 * The `xml1...xmlN` parameters used in this function call must be defined
 * as one or more activities associated with file-type endpoints in the current project
 * that return one or more XML documents.
 * These include configured File Share, FTP, HTTP, Local Storage, and Temporary Storage activities.
 * For more information, see the instructions on inserting endpoints.
 * 
 * Supports up to 100 XML document-calls.
 */
export class RunXSLT extends Func {
  constructor() {
    super();
    this.name = "RunXSLT";
    this.module = "xml";
    this.signatures = [
      new Signature("array", [
        new Parameter("string", "xslt"),
        new Parameter("string", "xml1"),
        new Parameter("string", "xml2", false)
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    // POD: XML document limit
    this.maxArgs = 100;
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new Error(`[${this.name}] Evaluation of XML API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `SelectNodeFromXMLAny` function.
 * 
 * Returns the first XML node from a list of XML Any nodes that match the node name.
 * 
 * To enter a path to an array of XML nodes into the function for the `anyNodes` parameter,
 * drag and drop the desired XML node folder from the Source Objects tab
 * of the script component palette to the script to insert its qualified path
 * at the location of your cursor, or enter its reference path manually.
 * For more information, see the instructions on inserting source objects.
 */
export class SelectNodeFromXMLAny extends Func {
  constructor() {
    super();
    this.name = "SelectNodeFromXMLAny";
    this.module = "xml";
    this.signatures = [
      new Signature("type", [
        new Parameter("string", "nodeName"),
        new Parameter("type", "anyNodes")
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 2;
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new Error(`[${this.name}] Evaluation of XML API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `SelectNodes` function.
 * 
 * Runs an XPath query (see the XPath standard, v1-v3) on either an XML fragment or an XML node
 * returned from another function, and returns the results of the query.
 * 
 * If the optional prefixes are used to specify the namespaces of the node in the XPath query,
 * the prefixes must be specified as one or more string arguments after the XPath
 * (see the second example).
 * 
 * To enter a path to a node into the function for the node parameter,
 * drag and drop the desired XML node folder from the Source Objects tab
 * of the script component palette to the script to insert its qualified path
 * at the location of your cursor, or enter its reference path manually.
 * For more information, see the instructions on inserting source objects.
 * 
 * To support HTML characters, set `jitterbit.decode.html.chars` to `true` upstream of this function.
 * This variable is supported with string data when using 10.49 agents and later.
 * 
 * Supports up to 100 XPath argument-calls.
 */
export class SelectNodes extends Func {
  constructor() {
    super();
    this.name = "SelectNodes";
    this.module = "xml";
    this.signatures = [
      new Signature("array", [
        new Parameter("type", "node"),
        new Parameter("string", "xPathQuery"),
        new Parameter("string", "xPathArg1", false)
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 100;
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new Error(`[${this.name}] Evaluation of XML API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `SelectNodesFromXMLAny` function.
 * 
 * Returns an array of all the XML nodes that are matched by an XPath query
 * (see the XPath standard, v1-v3) run against either a path of a value node
 * of an XML Any element or an array of XML nodes.
 * 
 * If the optional prefixes are used to specify the namespaces of the node in the XPath query,
 * the prefixes must be specified as one or more string arguments after the XPath (see the second example).
 * 
 * To enter a path to an array of XML nodes into the function for the anyNodes parameter,
 * drag and drop the desired XML node folder from the Source Objects tab
 * of the script component palette to the script to insert its qualified path
 * at the location of your cursor, or enter its reference path manually.
 * For more information, see the instructions on inserting source objects.
 * 
 * Supports up to 100 XPath argument-calls.
 */
export class SelectNodesFromXMLAny extends Func {
  constructor() {
    super();
    this.name = "SelectNodesFromXMLAny";
    this.module = "xml";
    this.signatures = [
      new Signature("array", [
        new Parameter("string", "xPathQuery"),
        new Parameter("type", "anyNodes"),
        new Parameter("string", "xPathArg1", false)
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 100;
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new Error(`[${this.name}] Evaluation of XML API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}

/**
 * The implementation of `SelectSingleNode` function.
 * 
 * Runs an XPath query (see the XPath standard, v1-v3) on either an XML fragment
 * or an XML node returned from another function, and returns the first node
 * in the results of the query.
 * 
 * If the optional prefixes are used to specify the namespaces of the node in the XPath query,
 * the prefixes must be specified as one or more string arguments after the XPath
 * (see the second example).
 * 
 * To enter a path to a node into the function for the node parameter,
 * drag and drop the desired XML node folder from the Source Objects tab
 * of the script component palette to the script to insert its qualified path
 * at the location of your cursor, or enter its reference path manually.
 * For more information, see the instructions on inserting source objects.
 * 
 * To support HTML characters, set `jitterbit.decode.html.chars` to `true` upstream
 * of this function.
 * This variable is supported with string data when using 10.49 agents and later.
 * 
 * Supports up to 100 XPath argument-calls.
 */
export class SelectSingleNode extends Func {
  constructor() {
    super();
    this.name = "SelectSingleNode";
    this.module = "xml";
    this.signatures = [
      new Signature("array", [
        new Parameter("type", "node"),
        new Parameter("string", "xPath"),
        new Parameter("string", "xPathArg1", false)
      ])
    ];
    this.signature = this.signatures[0];
    this.minArgs = 2;
    this.maxArgs = 100;
  }

  call(args: RuntimeVal[], scope: Scope): never {
    this.chooseSignature(args);
    throw new Error(`[${this.name}] Evaluation of XML API calls is currently unsupported.`);
  }

  protected chooseSignature(args: RuntimeVal[]) {
    this.signature = this.signatures[0];
  }
}
