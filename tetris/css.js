//because animation of border takes too much (unnecessary) CPU (resource)
(function border_animation() {
    let playground = document.getElementById('playground')
    let duration = 10; //sec
    let fps = 30; //much lower than css (can I constraint on css?)

    let delta = 360 / (duration * fps)
    let interval = Math.round(1000 / fps)
    let color = 0

    function animation() {
        color += delta
        if (color >= 360) color -= 360
        let icolor = Math.floor(color)
        playground.style.borderColor = `hsl(${icolor},100%,50%)`
    }

    setInterval(animation, interval)

})()
