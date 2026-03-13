

class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  add(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode; 
      this.tail = newNode;      
    }
    this.size++;
  }

  createCircle(playerArray) {
    const players = [...playerArray]; 
    for (let i = players.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [players[i], players[j]] = [players[j], players[i]];
    }

    players.forEach(player => this.add(player));
    if (this.head && this.tail) {
        this.tail.next = this.head;
        this.head.prev = this.tail;
    }
  }

  remove(item) {
  let current = this.head;
  if (!current) return;

  const itemName = typeof item === 'object' ? item.name : item;
  let foundNode = null;
  let count = 0;

  while (count < this.size) {
    const currentName = typeof current.value === 'object' ? current.value.name : current.value;
    if (currentName === itemName) {
      foundNode = current;
      break;
    }
    current = current.next;
    count++;
  }

  if (!foundNode) return;

  if (this.size === 1) {
    this.head = null;
    this.tail = null;
  } else {
    if (foundNode === this.head) {
      this.head = foundNode.next;
    }
    if (foundNode === this.tail) {
      this.tail = foundNode.prev;
    }
    foundNode.prev.next = foundNode.next;
    foundNode.next.prev = foundNode.prev;
  }
  
  this.size--;
}

  targetOf(value) {
    if (!this.head) return null;
    let current = this.head;
    let count = 0;

    const targetName = typeof value === 'object' ? value.name : value;

    while (count < this.size) {
        const currentName = typeof current.value === 'object' ? current.value.name : current.value;

        if (currentName === targetName) {
            return current.next ? current.next.value : null;
        }
        current = current.next;
        count++;
    }
    return "waaa";
  }

  str() {
    let count = 0;
    let string = "";
    let current = this.head;
    while (count < this.size) {
        string += current.value;
        string += " => ";
        current = current.next;
        count++;
    }
    return string + (this.head ? this.head.value : "END");
  }

  toArray() {
    const result = [];
    if (!this.head) return result;

    let current = this.head;
    let count = 0;

    while (count < this.size) {
        result.push(current.value);
        current = current.next;
        count++;
    }

    return result;
}
}


function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


module.exports = { LinkedList }