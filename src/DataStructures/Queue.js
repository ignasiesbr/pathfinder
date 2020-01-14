
class Queue {
    constructor() {
        this.queue = []
    };

    add(item) {
        this.queue.push(item);
    }

    remove(){
        return this.queue.shift();
    }

    isEmpty() {
        return this.queue.length === 0;
    }
    
}

export default Queue;
