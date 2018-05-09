/**
 * @typedef {'left'|'right'|'up'|'down'|'all'} event_names
 */

/**
 * 4-way (up,left,down,right) controller
 */
class controller4 {
    /**
     * initilize controller with optionally event handler
     * @param {(event_name:'left')=>void} left callback for left event
     * @param {(event_name:'right')=>void} right callback for right event
     * @param {(event_name:'up')=>void} up callback for up event
     * @param {(event_name:'down')=>void} down callback for down event
     * @param {(event_name:event_names)=>void} all callback for any previous events, with parameter event_name equal to the event name
     */
    constructor(left, right, up, down, all) {
        document.addEventListener('keydown', (event)=>this.handlekey(event.key))

        let noop = this.noop = () => { /*console.log('no handler')*/ }

        this.left = left || noop
        this.right = right || noop
        this.up = up || noop
        this.down = down || noop
        this.all = all || noop
    }
    /**
     * replace existed handler
     * @param {event_names} event
     * @param {(event_name:event_names)=>void} handler
     */
    replaceHandler(event, handler) {
        this[event] = handler
    }

    /**
     * detach all handler
     */
    detach_all() {
        this.left = this.right = this.up = this.down = this.all = this.noop
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