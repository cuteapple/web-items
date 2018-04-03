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
    for (let i = 0; i < 9; ++i) {
        let tile = document.createElement('img')
        tile.className = 'tile'
        tile.src = `img/${i}.png`
        tile.dataset.n = i;
        tiles.push(tile)
    }
    tiles[0].classList.add('cursor')

    ///grids
    for (let i = 0; i < 9; ++i) {
        grids[i].dataset.n = i;
        grids[i].appendChild(tiles[i])
    }

    //links
    flatten = ([x, y]) => x + y * 3
    inbound = ([x, y]) => x >= 0 && x < 3 && y >= 0 && y < 3

    for (let x = 0; x < 3; ++x)
        for (let y = 0; y < 3; ++y) {
            candidate = [
                [x - 1, y],
                [x + 1, y],
                [x, y + 1],
                [x, y - 1]
            ]
            link[flatten([x, y])] = candidate.filter(inbound).map(flatten)
        }
}

function clicknode(node) {
    "TODO: try move"
}

function keydown() {
    "TODO: try move"
}

function try_finish() {
    let finish = tiles.every(x => x.dataset.n == x.parentElement.dataset.n)
    return finish
}