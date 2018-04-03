class controller4 {
    constructor() {
        document.addEventListener('keydown', (ev) => this.handlekey(ev.key))
        // may update some day
        this.left = this.right = this.up = this.down = this.all = () => { console.log('no handler') }
    }

    // may update some day
    addEventListener(ev, handler) {
        this[ev] = handler
    }

    handlekey(key) {
        let handler;
        switch (key) {
            case "ArrowLeft": handler = 'left'; break;
            case "ArrowRight": handler = 'right'; break;
            case "ArrowUp": handler = 'up'; break;
            case "ArrowDown": handler = 'down'; break;
            default: return; // do nothing

        }
        this[handler](handler)
        this.all(handler)
    }
}

