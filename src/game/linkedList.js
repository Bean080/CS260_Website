class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

export class LinkedList {
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

   createCircle(map) {
    const players = Array.from(map.keys());
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

    const found = (node) => {
        if (node === this.head && node === this.tail) {
            this.head = null;
            this.tail = null;
        } else if (node === this.head) {
            this.head = node.next;
            this.head.prev = this.tail;
            this.tail.next = this.head;
        } else if (node === this.tail) {
            this.tail = node.prev;
            this.tail.next = this.head;
            this.head.prev = this.tail;
        } else {
            node.prev.next = node.next;
            node.next.prev = node.prev;
        }
        this.size--;
    };

    let count = 0;
    while (count < this.size) {
        if (current.value === item) {
            found(current);
            return current.value;
        }
        current = current.next;
        count++;
    }
  }

  targetOf(value) {
    if (!this.head) return null;
    let current = this.head;
    let count = 0;
    while (count < this.size) {
        if (current.value === value) {
            return current.next.value;
        }
        current = current.next;
        count++;
    }
    return null;
  }

  str() {
    let count = 0;
    let string = "";
    let current = this.head
    while (count < this.size) {
        string += current.value;
        string += " => ";
        current = current.next;
        count++;
    }
  return string;
  }
}
