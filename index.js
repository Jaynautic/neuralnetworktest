class Value {
  constructor(data, children = [], operation='', label='') {
    this.data = data;
    this.grad = 0;
    this.label = label;
    this.children = children;
    this.operation = operation;
  }

    fullBackward() {
        let topo = [];
        let visited = new Set();

        function buildTopo(v) {
            if (!visited.has(v)) {
                visited.add(v);
                for (const child of v.children) {
                    buildTopo(child)
                }
                topo.push(v)
            }
        }
        buildTopo(this)

        for (let node of topo.reverse()) {
            if (node.backward) {
                node.backward();
        }
        }

    }

    neg() {
        const self = this
        const out = self.data * -1
        const z = new Value(
            out,
            [this],
            'neg',
            this.label + 'neg'
            )
    
            z.backward = function() {
                self.grad += z.data * z.grad;
            }
            return z;
    }

    add(x) {
        const self = this
        if (x instanceof Value) {
            x = x;
        } else {
            x = new Value(x)
        }
        const z = new Value(
        this.data + x.data,
        [this, x],
        'add',
        this.label + x.label
        )

        z.backward = function() {
            self.grad += 1 * z.grad;
            x.grad += 1 * z.grad;
        }
        return z;
    }

    sub(x) {
        const self = this
        if (x instanceof Value) {
            x = x;
        } else {
            x = new Value(x)
        }
        const z = new Value(
        this.data - x.data,
        [this, x],
        'sub',
        this.label + x.label
        )

        z.backward = function() {
            self.grad += 1 * z.grad;
            x.grad += 1 * z.grad;
        }
        return z;
    }

    mul(x) {
        const self = this
        if (x instanceof Value) {
            x = x;
        } else {
            x = new Value(x)
        }
        const z = new Value(
        this.data * x.data,
        [this, x],
        'mul',
        this.label + x.label
        )

        z.backward = function() {
            self.grad += x.data * z.grad;
            x.grad += self.data * z.grad;
        }
        return z;
    }

    div(x) {
        const self = this
        if (x instanceof Value) {
            x = x;
        } else {
            x = new Value(x)
        }
        const z = new Value(
        this.data / x.data,
        [this, x],
        'div',
        this.label + x.label
        )

        z.backward = function() {
            self.grad += (1 / (x.data * z.grad));
            x.grad += (1 / (self.data * z.grad));
        }
        return z;
    }

    pow(x) {
        const self = this
        if (x instanceof Value) {
            x = x;
        } else {
            x = new Value(x)
        }
        const z = new Value(
        this.data**x.data,
        [this, x],
        'pow',
        this.label + x.label
        )

        z.backward = function() {
            self.grad += x.data * (self.data**(x.data - 1)) * z.grad;
        }
        return z;
    }

    exp() {
        const self = this
        const out = Math.exp(self.data)
        const z = new Value(
            out,
            [this],
            'exp',
            this.label + 'exp'
            )
    
            z.backward = function() {
                self.grad += z.data * z.grad;
            }
            return z;
    }

    tanh() {
        const self = this
        const out = Math.tanh(this.data)
        const z = new Value(
            out,
            [this],
            'tanh',
            'o'
            )
    
            z.backward = function() {
                self.grad += (1-out*out) * z.grad;
            }
            return z;
    }
}


var x1 = new Value (2.0,[],'', 'x1');
var x2 = new Value (0.0,[],'', 'x2');
var w1 = new Value (-3.0,[],'','w1');
var w2 = new Value (1.0,[],'','w2');
var b = new Value (6.8813735870195432, [],'','b');

var x1w1 = x1.mul(w1);
var x2w2 = x2.mul(w2);
var x1w1x2w2 = x1w1.add(x2w2);

var n = x1w1x2w2.add(b);

var o = n.tanh();

o.grad = 1

o.fullBackward()

console.log(x1.grad, x2.grad, w1.grad, w2.grad, x1w1.grad, b.grad, n.grad, o.grad)
console.log(x1.data, x2.data, w1.data, w2.data, b.data, n.data, o.data)


class Neuron {
    constructor(nin) {
        this.self = this;
        for (const x of nin) {
            x.w = new Value(Math.random())
        }
        this.b = new Value(Math.random())
      }
}

let ghost = new Neuron(10)

console.log(ghost)