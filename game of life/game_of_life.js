let playground
let grid
let width = 50
let height = 50
let game_of_life
let timer

function init() {
    playground = document.getElementById('playground')
    playground.style.gridTemplateColumns = `repeat(${width},1fr)`;
    playground.style.gridTemplateRows = `repeat(${height},1fr)`;

    grid = Array(width).fill().map(x => [])
    //order is important because no absolute position
    for (let h = 0; h < height; ++h) {
        for (let w = 0; w < width; ++w) {
            let cell = document.createElement('div');
            cell.classList.add('cell')
            //may set absolute column/row
            grid[w][h] = cell;
            playground.appendChild(cell)
        }
    }

    game_of_life = new GameOfLife(width, height)
    render()
    timer = new AnimationInterval(() => {
        game_of_life.nextEpoch()
        render()
    }, 100)
}

class AnimationInterval {
    constructor(action, interval) {
        this.timer = setInterval(() => { this.should_render = true }, interval);
        this.render = action;
        this.renderframe();
    }
    renderframe() {
        requestAnimationFrame(() => this.renderframe())
        if (!this.should_render) return
        this.should_render = false
        this.render()
    }
}

function render() {
    for (let h = 0; h < height; ++h) {
        for (let w = 0; w < width; ++w) {
            grid[w][h].dataset.status = game_of_life.sample(w, h)
        }
    }
}

class GameOfLife {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.initGrid()
    }

    initGrid() {
        this.grid = Array(this.width).fill().map(x => []);
        for (let w = 0; w < this.width; ++w) {
            for (let h = 0; h < this.height; ++h) {
                this.grid[w][h] = Math.random() > 0.5 ? 1 : 0;
            }
        }
    }

    //rewrite this to produce loop effect or something...
    sample(w, h) {
        //clamp to edge = 0
        let a = this.grid[w]
        let b = a == undefined ? undefined : a[h]
        return b == undefined ? 0 : b
    }

    //compute next iteration value of certain grid
    computeNext(w, h) {
        let sum = 0
        for (let dw of [-1, 0, 1])
            for (let dh of [-1, 0, 1])
                sum += this.sample(w + dw, h + dh)
        sum -= this.sample(w, h)
        switch (this.sample(w, h)) {
            case 0:
                return sum == 3 ? 1 : 0
                break;
            case 1:
                return sum < 2 ? 0 :
                    sum <= 3 ? 1 :
                        0
                break;
        }
    }

    nextEpoch() {
        let newGrid = Array(this.width).fill().map(x => []);
        for (let w = 0; w < this.width; ++w) {
            for (let h = 0; h < this.height; ++h) {
                newGrid[w][h] = this.computeNext(w, h)
            }
        }
        this.grid = newGrid;
    }
}