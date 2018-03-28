let playground;

function init() {
    let nodes = document.querySelectorAll('#playground > div')
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
    player_round.next()
}

function finish() {
}

