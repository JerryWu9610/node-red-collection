import { NodeAPI, Node, NodeDef, NodeMessage } from 'node-red';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

export default function (RED: NodeAPI): void {
  function ValidateJSONNode(this: Node, config: ValidateJSONNodeDef) {
    RED.nodes.createNode(this, config);
    const ajv = new Ajv({ allErrors: true });
    addFormats(ajv);
    this.on('input', (msg: NodeMessage) => {
      const validate = ajv.compile(JSON.parse(config.schema));
      const valid = validate(msg.payload);
      if (valid) {
        this.send(pass(msg));
      } else {
        this.send(fail(msg, validate.errors?.map((err) => `${err.schemaPath}: ${err.message}`) || []));
      }
    });
  }

  RED.nodes.registerType('validate JSON', ValidateJSONNode);
}

function pass(msg: NodeMessage): OutputMsgs {
  return [msg, null];
}
function fail(msg: NodeMessage, errors: string[]): OutputMsgs {
  msg.payload = { errors };
  return [null, msg as FailedOutputMsg];
}

type ValidateJSONNodeDef = {
  schema: string;
} & NodeDef;

type OutputMsgs = [PassedOutputMsg | null, FailedOutputMsg | null];
type PassedOutputMsg = {
  payload?: any;
};
type FailedOutputMsg = {
  payload: {
    errors: string[];
  };
};
