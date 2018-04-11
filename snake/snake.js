let playground
let body = []
let food
let controller = new controller4()
let velocity = [1, 0]

class SnakeBody {
    constructor(x, y, head = false) {
        this.element = document.createElement('div')
        this.element.className = "snake"
        if (head) this.element.classList.add("head")
        playground.appendChild(this.element)

        this.head = head
        this.x = x
        this.y = y
    }

    set x(value) { this.element.style.gridColumn = this._x = value; }
    get x() { return this._x; }
    set y(value) { this.element.style.gridRow = this._y = value; }
    get y() { return this._y; }
    set pos(p) { this.x = p[0]; this.y = p[1]; }
    get pos() { return [this.x, this.y] }
}

function hint(text) {
    document.getElementById('hint').innerText = text;
}

function init() {
    playground = document.getElementById('playground')
    body = [new SnakeBody(10, 10, true), new SnakeBody(9, 10)]

    //install handler
    controller.all = move;
}

function end(message="end") {
    controller.all = () => { }
    hint(message)
}

function move(direction) {
    let [dx, dy] = controller4.to2D(direction, [1, -1])
    let [x, y] = body[0].pos
    x += dx
    y += dy

    let status;
    if (x <= 0 || x > 50 || y <= 0 || y > 50) { end(); return; }



    for (let i = 0; i < body.length - 1; ++i) {
        body[i + 1].pos = body[i].pos
    }

    body[0].x += dx;
    body[0].y += dy;

    return


    let pos = grid_utils.xy(cursor)
    pos[0] += dx
    pos[1] += dy

    if (!grid_utils.inbound(pos)) {
        hint('❌')
        return
    }
    let target = grid_utils.flatten(pos)
    swapTile(grids[cursor].firstChild, grids[target].firstChild)
    cursor = target

    if (test_end()) {
        hint('❌')
    }
    else {
        hint('snake')
    }
}

function test_end() {
}