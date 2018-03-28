let playground;
let nodes;

function init() {
    nodes = document.querySelectorAll('#playground > div')
    playground = document.getElementById('playground')
    playground.dataset.player = player_round.next().value

    for (let y = 0; y < 3; ++y) {
        for (let x = 0; x < 3; ++x) {
            let node = nodes[y * 3 + x]
            node.dataset.x = x
            node.dataset.y = y
            node.addEventListener('click', () => clicknode(node))
        }
    }
}

let players = ['o', 'x']
let player_round = ((function* player_round() {
    while (true) {
        playground.dataset.player = 'o'
        yield 'o'
        playground.dataset.player = 'x'
        yield 'x'
    }
})())

function clicknode(node) {
    if (node.dataset.holder) {
        //alert('already used')
        console.error('already used')
        return;
    }
    node.dataset.holder = playground.dataset.player
    if (!try_finish())
        player_round.next()
}

let win_test = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

function all(arr, predict) {
    for (let x of arr)
        if (!predict(x))
            return false
    return true
}

function try_finish() {
    for (let player of players) for (let test of win_test) {
        if (all(test, i => nodes[i].dataset.holder == player)) {
            console.log(`${player} wins`)
            for (id of test)
                nodes[id].dataset.win = ''
            return true
        }
    }
    return false
}

