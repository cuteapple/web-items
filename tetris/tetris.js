let playground
let controller = new controller4()
let width = 20
let height = 50
/** micro seconds to fall down one block */
let fall_interval = 300
let fall_timer

/**
 * active (moving) blocks
 * @type {GridItem[]}
 */
let activeBlocks;

/**
 * grid of blocks
 * @type {GridItem[]}
 */
let grids = []

function outside_grid(x, y) {
    return x < 0 || x >= width || y < 0 || y >= height
}

function inside_grid(x, y) {
    return !outside_grid(x, y)
}

function get_grid(x, y) {
    return inside_grid(x, y) && grids[x + y * width]
}

function set_grid(x, y, block) {
    return inside_grid(x, y) && (grids[x + y * width] = block)
}

function init() {
    playground = document.getElementById('playground')

    //set up grid
    playground.style.gridTemplateRows = `repeat(${height},1fr)`
    playground.style.gridTemplateColumns = `repeat(${width},1fr)`

    //adjust width and height of playground
    //...

    //start game loop
    controller.left = () => TryMove(-1, 0)
    controller.up = () => TryRotate()
    controller.right = () => TryMove(1, 0)
    controller.down = () => Down()
    fall_timer = setInterval(MoveDownOrNewOrEnd, fall_interval)
    activeBlocks = GenerateBlocks(RandomTetris(), Math.floor(width / 2 - 1), 0)
}

function MoveDownOrNewOrEnd() {
    let success = TryMove(0, 1)
    if (success) return true

    if (activeBlocks.find(x => x.y < 1)) {
        End()
        return false
    }
    activeBlocks.forEach(x => set_grid(x.x, x.y, x))
    activeBlocks = GenerateBlocks(RandomTetris(), Math.floor(Math.random(width / 3) + width / 2 - 1), 0)
    return false
}

function End() {
    clearInterval(fall_timer)
    controller.detech_all()
}

function TryRotate() {
    let xs = activeBlocks.map(x => x.x)
    let ys = activeBlocks.map(x => x.y)
    let cx = Math.floor(xs.reduce((a, b) => a + b) / xs.length)
    let cy = Math.floor(ys.reduce((a, b) => a + b) / ys.length)
    let deltas = activeBlocks.map(x => ({ dx: x.x - cx, dy: x.y - cy }))
    let new_pos = deltas.map(p => [Math.floor(cx + p[0]), Math.floor(cy - p[0]) )

    for (let block of activeBlocks) {
        let dx = block.x - cx
        let dy = block.y - cy
        let x = Math.floor(cx + dy)
        let y = Math.floor(cy - dx)
    }


    console.warn('not impl')
}

let down = false;
function Down() {
    if (down) return
    down = true;
    clearInterval(fall_timer)
    requestAnimationFrame(_Down)
}

function _Down() {
    if (MoveDownOrNewOrEnd()) {
        requestAnimationFrame(_Down)
        return
    }

    down = false;
    fall_timer = setInterval(MoveDownOrNewOrEnd, fall_interval)
}

/**
 * try move activeBlocks by dx, dy
 * no action if any Block cannot move
 * @param {number} dx
 * @param {number} dy
 */
function TryMove(dx, dy) {

    // check for overlap after move
    if (!activeBlocks
        .map(b => [b.x + dx, b.y + dy])
        .every(p => inside_grid(...p) && !get_grid(...p))
    ) { return false }

    //no overlap, move
    activeBlocks.forEach(x => { x.x += dx, x.y += dy })
    return true
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


/**
 * generate blocks onto *x* and *y*, regardless of existed blocks
 * @param {tetris_template} template template for new blocks
 * @param {number} x upperleft-x 
 * @param {number} y upperleft-y
 * @param {string} color css color string or false value for random color
 * @returns {GridItem[]}
 */
function GenerateBlocks(template, x, y, color) {
    color = color || `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`

    let blocks = template.map(([dx, dy]) => new GridItem(x + dx, y + dy, playground))
    blocks.forEach(b => b.element.style.backgroundColor = color)
    return blocks
}

/** @typedef {number[][]} tetris_template */

/**
 * template of tetris
 * @enum {tetris_template}
 */
const tetris_blocks = {
    'L': [[0, 0], [0, 1], [0, 2], [1, 2]],
    'T': [[0, 0], [1, 0], [2, 0], [1, 1]],
    'O': [[0, 0], [0, 1], [1, 0], [1, 1]],
    'I': [[0, 0], [0, 1], [0, 2], [0, 3]],
}

function RandomTetris() {
    return tetris_blocks['LTOI'[Math.floor(Math.random() * 4)]]
}