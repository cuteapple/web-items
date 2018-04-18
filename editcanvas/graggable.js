class dragHandler {
    constructor(target, anchor = undefined) {
        this.element = target;
        this.dragging = false;
        this.anchor = anchor ? anchor : target.parentElement;

        console.assert(this.element.style.position == 'absolute', 'target should have style position:absolute')
        console.assert(this.anchor, 'no anchor found')
        if (this.anchor) {
            console.assert(this.anchor.style.position == 'relative', 'anchor should have style position:relative')
        }

        target.addEventListener('pointerdown', (e) => this.pointerDown(e))
        document.addEventListener('pointermove', (e) => this.pointerMove(e))
        document.addEventListener('pointerup', (e) => this.pointerUp(e))
    }

    getRelativePos() {
        let { x, y } = this.element.getClientRects()[0]
        let { x: ax, y: ay } = this.anchor.getClientRects()[0]
        return [x - ax, y - ay]
    }

    setRelativePos(x, y) {
        this.element.style.left = x;
        this.element.style.top = y;
    }

    pointerDown(e) {
        this.dragging = true;
        let [x, y] = this.getRelativePos()
        let [px, py] = [e.clientX, e.clientY]
        this.offset = [x - px, y - py]
        this.startp = [px, py]
    }
    pointerMove(e) {
        if (!this.dragging) return;
        let [px, py] = [e.clientX, e.clientY]
        let [dx, dy] = this.offset
        let [x, y] = [px + dx, py + dy]
        this.setRelativePos(x, y)
    }
    pointerUp(e) {
        try { this.pointerMove(e) }
        finally { this.dragging = false; }
    }
}

