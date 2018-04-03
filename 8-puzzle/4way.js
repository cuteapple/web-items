class controller4 {
    constructor() {
        document.addEventListener('keydown', (ev) => this.handlekey(ev.key))
        // may update some day
        this.L = this.R = this.U = this.D = this.all = () => { console.log('no handler') }
    }

    handlekey(key) {
        switch (key) {
            case "ArrowLeft":
                this.L()
                break;
            case "ArrowRight":
                this.R()
                break;
            case "ArrowUp":
                this.U()
                break;
            case "ArrowDown":
                this.D()
                break;
            default:
                // do nothing
                return
        }
        this.all()
    }
}

