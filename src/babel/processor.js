const assertions = require('../utils/assertions.js');

let inDefine = false;

class Processor {

  constructor (filename) {
    this.filename = filename;
    this.visitor = this.visitor.bind(this);
  }

  visitor (babel) {
    const t = babel.types;
    const self = this;

    return {
      visitor: {
        StringLiteral (path) {
          if (inDefine && assertions.isDependency(path)) {
            console.log(`Found dependency ${path.node.value} in ${self.filename}`);
          }
        },
        CallExpression: {
          enter (path) {
            if (path.node.callee.name === 'define') {
              inDefine = true;
            }
          },
          exit (path) {
            if (path.node.callee.name === 'define') {
              inDefine = false;
            }
          }
        },
        Identifier (path) {
          if (path.node.name === 'testLib2' && t.isFunctionExpression(path.parent)) {
            path.remove();
          }
        }
      }
    };
  }
}

module.exports = Processor;
