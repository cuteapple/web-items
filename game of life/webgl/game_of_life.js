let playground
let width = 50
let height = 50
let game_of_life

function init() {
    playground = document.getElementById('playground')
    let gl = playground.getContext("webgl2")
    game_of_life = new GameOfLife(gl, width,height)

    /*
    timer = new AnimationInterval(() => {
        game_of_life.nextEpoch()
        game_of_life.render()
    }, 100)*/
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