let playground
let body = []
let food
let controller = new controller4()
let velocity = [1, 0]
let x = 1
let y = 1

function hint(text) {
    document.getElementById('hint').innerText = text;
}

let grid_utils = {
    flatten: ([x, y]) => x + y * 3,
    inbound: ([x, y]) => x >= 0 && x < 3 && y >= 0 && y < 3,
    xy: index => [index % 3, Math.floor(index / 3)]
}

function init() {
    playground = document.getElementById('playground')
    body = [...playground.children]

    //install handler
    controller.all = move;
}

function swapTile(a, b) {
    pa = a.parentElement
    pb = b.parentElement
    pa.appendChild(b)
    pb.appendChild(a)
}

function move(direction) {
    let [dx, dy] = controller4.to2D(direction, [1, -1])

    for (let i = 0; i < body.length - 1; ++i) {
        body[i + 1].style.gridColumn = body[i].style.gridColumn
        body[i + 1].style.gridRow = body[i].style.gridRow
    }

    x += dx
    y += dy
    body[0].style.gridColumn = x
    body[0].style.gridRow = y

    return


    let pos = grid_utils.xy(cursor)
    pos[0] += dx
    pos[1] += dy

    if (!grid_utils.inbound(pos)) {
        hint('❌')
        return
    }
    let target = grid_utils.flatten(pos)
    swapTile(grids[cursor].firstChild, grids[target].firstChild)
    cursor = target

    if (test_end()) {
        hint('❌')
    }
    else {
        hint('snake')
    }
}

function test_end() {
}