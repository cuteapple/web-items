/**
 * 4-way (up,left,down,right) controller
 */
class controller4 {
    /**
     * 
     * @param {()=>void} left callback for left event
     * @param {()=>void} right callback for right event
     * @param {()=>void} up callback for up event
     * @param {()=>void} down callback for down event
     * @param {(event_name:'up'|'down'|'left'|'right')=>void} all callback for any previous events, with parameter event_name equal to the event name
     */
    constructor(left,right,up,down,all) {
        document.addEventListener('keydown', (ev) => this.handlekey(ev.key))

        let handlers = { left, right, up, down, all }
        for (let x of Object.keys(handlers)) {

        }
        // empty event handler
        this.left = this.right = this.up = this.down = this.all = () => {/* console.log('no handler')*/ }
    }

    // may update some day
    addEventListener(ev, handler) {
        this[ev] = handler
    }

    /**
     * stop from receive event, but keep all handler
     */
    detach() {
        this.left = this.right = this.up = this.down = this.all = () => {/* console.log('no handler')*/ }
    }

    attach() {
        document.addEventListener('keydown', (ev) => this.handlekey(ev.key))
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

///
/// !! not tested
///

class controller4_touch {
    constructor() {
        document.addEventListener('touchstart', (ev) => this.start(ev));
        document.addEventListener('touchmove', (ev) => this.move(ev));
        document.addEventListener('touchend', (ev) => this.end(ev));
        this.p = undefined;
        this.all = () => { }
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

        //let rad = Math.atan2(dy, dx)
        //let deg = red * 180 / Math.PI

        if (Math.abs(dx) > Math.abs(dy)) {/*most significant*/
            if (dx > 0) {
                handler = 'right'
            } else {
                handler = 'left'
            }
        } else {
            if (yDiff > 0) {
                handler = 'up'
            } else {
                handler = 'down'
            }
        }
        this.all(handler);
        this.end()
    }
}