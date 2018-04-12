let playground
let body = []
let foods = []
let controller = new controller4()
let velocity = [1, 0]
let width = 4
let height = 4

let playground_util = {
    in: (x, y) => x >= 0 && x < width && y >= 0 && y < height,
}

function init() {
    playground = document.getElementById('playground')
    playground.style.gridTemplateColumns = `repeat(${width},1fr)`;
    playground.style.gridTemplateRows = `repeat(${height},1fr)`;
    body = [new SnakeBody(0, 0, true), new SnakeBody(0, 1), new SnakeBody(0, 2), new Food(0, 3)] // playground.children
    controller.all = movekey_handler;
}

function move(dx, dy) {
    let [x, y] = body[0].pos
    x += dx
    y += dy

    let status;

    //wall
    if (!playground_util.in(x, y)) { end('❌'); return; }

    //food
    //if (food) { }


    for (let i = body.length - 1; i > 0; --i) {
        body[i].pos = body[i - 1].pos
    }

    body[0].x += dx;
    body[0].y += dy;
}

class PlaygroundItem {
    constructor(x, y) {
        this.element = document.createElement('div')
        this.x = x
        this.y = y
        playground.appendChild(this.element)
    }
    set x(value) { this._x = value; this.element.style.gridColumn = value + 1; }
    get x() { return this._x; }
    set y(value) { this._y = value; this.element.style.gridRow = value + 1; }
    get y() { return this._y; }
    set pos(p) { this.x = p[0]; this.y = p[1]; }
    get pos() { return [this.x, this.y] }
}

class SnakeBody extends PlaygroundItem {
    constructor(x, y, head = false) {
        super(x, y)
        this.element.classList.add("snake")
        if (head) this.element.classList.add("head")
        this.head = head
    }
}

class Food extends PlaygroundItem {
    constructor(x, y) {
        super(x, y)
        this.element.classList.add("food")
    }
}

function randomEmptyGrid() {
    let map = []
    for (let x = 0; x < width; ++x) {
        map[x] = []
    }

    for (let s of body) {
        let [x, y] = s.pos
        map[x][y] = true
    }

    for (let s of foods) {
        let [x, y] = s.pos
        map[x][y] = true
    }

    let fill = body.length + foods.length;
    let empty = width * height - fill;

    let n = Math.floor(Math.random() * empty) + 1
    for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
            if (!map[x][y]) {
                --n;
                if (n == 0) return [x, y]
            }
        }
    }
}

function hint(text) {
    document.getElementById('hint').innerText = text;
}

function end(message = "end") {
    controller.all = () => { }
    hint(message)
}

function movekey_handler(direction) {
    velocity = controller4.to2D(direction, [1, -1])
    move(...velocity)
}