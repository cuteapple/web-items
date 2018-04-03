class controller4 {
    constructor() {
        document.addEventListener('keydown', (ev) => this.handlekey(ev.key))
        // may update some day
        this.left = this.right = this.up = this.down = this.all = () => {/* console.log('no handler')*/ }
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

    static to2D(direction, [right, up] = [1, 1]) {
        switch (direction) {
            case 'left': return [-right, 0]
            case 'right': return [right, 0]
            case 'up': return [0, up]
            case 'down': return [0, -up]
        }
    }
}

class controller4_touch {
    constructor() {
        document.addEventListener('touchstart', (ev) => this.start(ev));
        document.addEventListener('touchmove', (ev) => this.move(ev));
        document.addEventListener('touchend', (ev) => this.end(ev));
        this.p = undefined;
    }

    getp(ev) {
        return [evt.touches[0].clientX, evt.touches[0].clientY]
    }

    start(ev) {
        this.p = getp(ev)
    }

    end(ev) {
        this.p = undefined
    }

    move(ev) {
        if (!this.p) {
            return;
        }

        let [x, y] = getp(ev)
        let [ox, oy] = this.p
        let [dx, dy] = [x - ox, y - oy]

        let rad = Math.atan2(dy, dx)
        let deg = red * 180 / Math.PI

        if(deg > 0)

        if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
            if (xDiff > 0) {
                /* left swipe */
            } else {
                /* right swipe */
            }
        } else {
            if (yDiff > 0) {
                /* up swipe */
            } else {
                /* down swipe */
            }
        }
        /* reset values */
        xDown = null;
        yDown = null;
    };