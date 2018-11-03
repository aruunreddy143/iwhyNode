class Set {
    constructor() {
        this.values = [];
        this.numOfValues = 0;
    }
    add(val) {
        if (!~this.values.indexOf(val)) {
            this.values.push(val);
            this.numOfValues++;
        }
    }
    print() {
        return this.values;
    }
    remove(val) {
        const index = this.values.indexOf(val);
        if (~index) {
            this.values.splice(val, 1)
            this.numOfValues--
        }
    }
    contains(val) {
        return this.values.includes(val)
    }
    union(set) {
        let newSet = new Set();
        set.values.forEach(element => {
            newSet.add(element);
        });
        this.values.forEach(element => {
            newSet.add(element)
        })
        return newSet;
    }
    intersect(set) {
        let newSet = new Set();

        this.values.forEach(element => {
            if (set.contains(element)) {
                newSet.add(element)
            }
        })
        return newSet;
    }

}

let set = new Set();
set.add(1);
set.add(2);
set.add(3);
set.add(4);
set.add(2);
set.print();
set.remove(3);
set.print()
set.contains(3)
let set2 = new Set();
set2.add(10);
set2.add(2);
set2.add(11);
set2.union(set)
console.log(set2.intersect(set))




/*FIFO, ticketing system, first person should be served first*/

class Queue {
    constructor() {
        this.storage = {};
        this.newPosition = 1;
        this.oldPosition = 1;
    }

    enqueue(data) {
        this.storage[this.newPosition] = data;
        this.newPosition++;
    }

    dequeue() {
        let newPos = this.newPosition;
        let oldPos = this.oldPosition;
        let deletedData;
        if (newPos !== oldPos) {
            deletedData = this.storage[oldPos];
            delete this.storage[oldPos];
            this.oldPosition++;
        }
        return deletedData;
    }
    getQueue() {
        return this.storage;
    }
    size() {
        return this.newPosition - this.oldPosition;
    }

}

let queue = new Queue();
queue.enqueue("http://google.com");
queue.enqueue("http://facebook.com");
queue.enqueue("http://test.com");
queue.enqueue("http://w3schools.com");





/*LIFO, browser history Last Input first input*/

class Stack {
    constructor() {
        this.storage = {};
        this.position = -1;
    }
    push(data) {
        this.position++;
        this.storage[this.position] = data;
    }
    pop() {
        if (this.position > -1) {
            let val = this.storage[this.position];
            delete this.storage[this.position];
            this.position--;
            return val;
        }
    }
    top() {
        return this.storage;
    }
}

let st = new Stack();
st.push("http://google.com");
st.push("http://facebook.com");
st.push("http://test.com");
st.push("http://w3schools.com");

console.log(st.pop())