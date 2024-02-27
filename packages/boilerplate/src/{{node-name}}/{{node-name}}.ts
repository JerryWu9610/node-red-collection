import { NodeAPI, Node, NodeDef, NodeMessage } from 'node-red';

module.exports = function (RED: NodeAPI) {
  function ExampleNode(this: Node, config: NodeDef) {
    RED.nodes.createNode(this, config);
    this.on('input', (msg: NodeMessage) => {
      msg.payload = (msg.payload as string).toLowerCase();
      this.send(msg);
    });
  }

  RED.nodes.registerType('{{node-name}}', ExampleNode);
};
