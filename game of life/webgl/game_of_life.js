let playground
let gl
let grid
let width = 50
let height = 50
let game_of_life
let timer

function init() {
    playground = document.getElementById('playground')
    gl = playground.getContext("webgl2")

    
    


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

