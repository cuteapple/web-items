let playground
let body = []
let food
let controller = new controller4()
let velocity = [1, 0]

function init() {
    playground = document.getElementById('playground')
    body = [new SnakeBody(10, 10, true), new SnakeBody(9, 10), new SnakeBody(8, 10)] // playground.children
    controller.all = movekey_handler;
}

function move([dx, dy]) {
    let [x, y] = body[0].pos
    x += dx
    y += dy

    let status;

    //wall
    if (x <= 0 || x > 50 || y <= 0 || y > 50) { end('❌'); return; }

    //food
    if (food) { }


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
    set x(value) { this.element.style.gridColumn = this._x = value; }
    get x() { return this._x; }
    set y(value) { this.element.style.gridRow = this._y = value; }
    get y() { return this._y; }
    set pos(p) { this.x = p[0]; this.y = p[1]; }
    get pos() { return [this.x, this.y] }
}

class SnakeBody extends PlaygroundItem{
    constructor(x, y, head = false) {
        super(x,y)
        this.element.classList.add("snake")
        if (head) this.element.classList.add("head")
        this.head = head
    }
}

class Food extends PlaygroundItem {
    moveToEmpty() {
        //...
        items = [food,...body]
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
    move(velocity)
}