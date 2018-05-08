let playground
let controller = new controller4()
let width = 20
let height = 50

function init() {
}

/**
 * grid-layout based Tetris playround
 */
class Tetris {
    /**
     * create grid-layout based Tetris playground
     * @param {HTMLDivElement} div
     * @param {Number} width
     * @param {Number} height
     */
    constructor(div, width, height) {
        this.div = div
        this.width = width
        this.height = height
        this.generateCenterX = Math.floor(width / 2)
        this.generateCenterY = 1

        div.style.gridTemplateRows = `repeat(${height},1fr)`
        div.style.gridTemplateColumns = `repeat(${width},1fr)`

        /**
         * @type {Block[]}
         */
        this.current = undefined
    }

    newBlock() {}

    /**
     * @returns {boolean}
     */
    moveLeft() { }
    moveRight() { }
    moveDown() { }
    rotate() {}
}

class GridItem {
    constructor(x, y) {
        this.element = document.createElement('div')
        this.x = x
        this.y = y
        playground.appendChild(this.element)
    }

    detech() {
        playground.removeChild(this.element)
    }

    blink() {
        this.element.classList.add('blink')
    }

    set x(value) { this._x = value; this.element.style.gridColumn = value + 1; }
    get x() { return this._x; }
    set y(value) { this._y = value; this.element.style.gridRow = value + 1; }
    get y() { return this._y; }
    set pos(p) { this.x = p[0]; this.y = p[1]; }
    get pos() { return [this.x, this.y] }
}