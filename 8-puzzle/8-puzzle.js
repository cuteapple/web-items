let playground;
let grids;
let tiles;
let links;
let controller = new controller4()

function hint(text) {
    document.getElementById('hint').innerText = text;
}

function init() {
    playground = document.getElementById('playground')

    /// tiles
    tiles = []
    for (let i = 0; i < 9; ++i) {
        let tile = document.createElement('img')
        tile.className = 'tile'
        tile.src = `img/${i}.png`
        tile.dataset.n = i;
        tiles.push(tile)
    }
    tiles[0].classList.add('cursor')

    

    //links
    links = []
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
            links[flatten([x, y])] = candidate.filter(inbound).map(flatten)
        }


    let randomSelect = (arr) => arr[Math.floor(Math.random() * arr.length)]

    //shuffle
    let replace = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    let pos = 0
    for (let i = 0; i < 1000; ++i) {
        let next_pos = randomSelect(links[pos]);
        [replace[pos], replace[next_pos]] = [replace[next_pos], replace[pos]]
        pos = next_pos
    }

    ///grids
    grids = [...playground.children]
    for (let i = 0; i < 9; ++i) {
        grids[i].dataset.n = i;
        grids[i].appendChild(tiles[replace[i]])
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