let playground;
let grids;
let tiles = [];
let link = [];

function hint(text) {
    document.getElementById('hint').innerText = text;
}

function init() {
    playground = document.getElementById('playground')
    grids = [...playground.children]

    /// tiles
    for (let i = 0; i <= 9; ++i) {
        let tile = document.createElement('img')
        tile.className = 'tile'
        tile.src = `img/${i}.png`
        tile.dataset.n = i;
        tiles.push(tile)
    }

    ///grids
    for (let i = 0; i < 9; ++i) {
        grids[i].dataset.n = i;
        grids[i].appendChild(tiles[i])
    }

    "TODO: init nodes"
}

function clicknode(node) {
    "TODO: try move"
}

function keydown() {
    "TODO: try move"
}

function try_finish() {
    "TODO: check order(?) or each block check itself(?) custom element "
}