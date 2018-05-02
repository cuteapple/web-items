let playground

let scwidth = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

let scheight = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

const pixel_per_unit = 3
let width = Math.floor(scwidth / pixel_per_unit)
let height = Math.floor(scheight / pixel_per_unit)

let game_of_life

function init() {
    playground = document.getElementById('playground')
    playground.style.width = `${scwidth}px`;
    playground.style.height = `${scheight}px`; // full client area
    playground.width = width;
    playground.height = height;
    let gl = playground.getContext("webgl2")
    game_of_life = new GameOfLife(gl, width,height)

    
    timer = new AnimationInterval(() => {
        game_of_life.nextEpoch()
        game_of_life.render()
    }, 16)
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