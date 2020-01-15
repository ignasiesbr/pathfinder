class PriorityQueue {
  constructor() {
    this.heapArray = [[0, 0]];
    this.currentSize = 0;
  }

  printHeap() {
    console.log(this.heapArray);
  }

  percDown(i) {
    while (i * 2 <= this.currentSize) {
      let mc = this.minChild(i);
      if (this.heapArray[i][0] > this.heapArray[mc][0]) {
        let tmp = this.heapArray[i];
        this.heapArray[i] = this.heapArray[mc];
        this.heapArray[mc] = tmp;
      }
      i = mc;
    }
  }

  minChild(i) {
    if (i * 2 > this.currentSize) {
      return -1;
    } else {
      if (i * 2 + 1 > this.currentSize) {
        return i * 2;
      } else {
        if (this.heapArray[i * 2][0] < this.heapArray[i * 2 + 1][0]) {
          return i * 2;
        } else {
          return i * 2 + 1;
        }
      }
    }
  }

  percUp(i) {
    while (Math.floor(i / 2) > 0) {
      if (this.heapArray[i][0] < this.heapArray[Math.floor(i / 2)][0]) {
        let tmp = this.heapArray[Math.floor(i / 2)];
        this.heapArray[Math.floor(i / 2)] = this.heapArray[i];
        this.heapArray[i] = tmp;
      }
      i = Math.floor(i / 2);
    }
  }

  add(k) {
    this.heapArray.push(k);
    this.currentSize += 1;
    this.percUp(this.currentSize);
  }

  delMin() {
    let retval = this.heapArray[1][1];
    this.heapArray[1] = this.heapArray[this.currentSize];
    this.currentSize = this.currentSize - 1;
    this.heapArray.pop();
    this.percDown(1);
    return retval;
  }

  isEmpty() {
    return this.currentSize === 0;
  }

  decreaseKey(val, amt) {
    // console.log(val);
    let done = false;
    let i = 1;
    let mKey = 0;
    while (!done && i <= this.currentSize) {
      // console.log(this.heapArray[i][1]);
      if (this.heapArray[i][1].getValue() === val.getValue()) {
        // console.log("gets to decreasekye");
        done = true;
        mKey = i;
      } else {
        i = i + 1;
      }
    }
    if (mKey > 0) {
      this.heapArray[mKey] = [amt, this.heapArray[mKey][1]];
      this.percUp(mKey);
    }
  }
}

export default PriorityQueue;
