let playground
let width = 512
let height = 512
let game_of_life

function init() {
    playground = document.getElementById('playground')
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