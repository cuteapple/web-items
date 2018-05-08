let playground
let controller = new controller4()
let width = 20
let height = 50

/**
 * active (moving) blocks
 * @type {GridItem[]}
 */
let activeBlocks;

/**
 * grid of blocks
 * @type {GridItem[][]}
 */
let grids = Array(width).fill().map(x => [])

function outside_grid(x, y) {
    return x < 0 || x >= width || y < 0 || y >= height
}

function inside_grid(x, y) {
    return !outside_grid()
}

function get_grid(x, y) {
    return inside_grid(x, y) && grids[x][y]
}

function init() {
    playground = document.getElementById('playground')

    //set up grid
    playground.style.gridTemplateRows = `repeat(${height},1fr)`
    playground.style.gridTemplateColumns = `repeat(${width},1fr)`

    //adjust width and height of playground
    //...

    //start game loop
}

/**
 * try move activeBlocks by dx, dy
 * no action if any Block cannot move
 * @param {number} dx
 * @param {number} dy
 */
function TryMove(dx, dy) {
    activeBlocks
        .map(b => [b.x, b.y])
        .every(p => get_grid(...p))
}

class GridItem {
    constructor(x, y, parent) {
        this.element = document.createElement('div')
        this.x = x
        this.y = y
        this.parent = parent
        parent.appendChild(this.element)
    }

    attach() {
        this.parent.appendChild(this.element)
    }

    detech() {
        this.parent.removeChild(this.element)
    }

    set x(value) { this._x = value; this.element.style.gridColumn = value + 1; }
    get x() { return this._x; }
    set y(value) { this._y = value; this.element.style.gridRow = value + 1; }
    get y() { return this._y; }
    set pos(p) { this.x = p[0]; this.y = p[1]; }
    get pos() { return [this.x, this.y] }
}