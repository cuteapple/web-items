async function readAsDataURLAsync(file) {
    return new Promise((res, rej) => {
        let reader = new FileReader()
        reader.onload = () => res(reader.result)
        //what to handle error?
        reader.readAsDataURL(file)
    })
}

async function createImageAsync(src) {
    return new Promise(res => {
        let img = new Image()
        img.onload = () => res(img)
        img.src = src
    })
}

//return : Image object
async function loadImageAsync() {
    let input = document.getElementById('imgfile');
    if (!input) { throw "Um, couldn't find the imgfile element." }
    else if (!input.files) { throw "This browser doesn't seem to support the 'files' property of file inputs." }
    else if (!input.files[0]) { throw "Please select a file before clicking 'Load'" }
    let file = input.files[0]
    let data = await readAsDataURLAsync(file)
    let img = await createImageAsync(data)
    return img
}

async function onUploadImage() {
    let img = await loadImageAsync();
    let canvas = document.getElementById('canvas')
    canvas.width = img.width
    canvas.height = img.height
    let ctx = canvas.getContext('2d')
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    //ctx.drawImage(img, 0, 0)
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height)
}
