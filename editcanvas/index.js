
///
/// upload image and render on canvas
/// 

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

let context;

async function onUploadImage() {
    let img = await loadImageAsync();
    let canvas = document.getElementById('canvas')
    canvas.width = img.width
    canvas.height = img.height
    context = canvas.getContext('2d')
    /*
    context.mozImageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.msImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;
    context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height)
    */
    context.drawImage(img, 0, 0)
}


///
/// control points
///

class ControlPoints {
    constructor(template, onto) {
        this.template = template;
        this.onto = onto;
        this.nodes = []
    }
    new() {
        let node = this.template.cloneNode(true)
        let drag = new dragHandler(node, this.onto)
        this.nodes.push(node)
        this.onto.appendChild(node)
    }
    delete(node) {
        let n = this.nodes.find(x => X === node)
        if (!n) {
            console.error({ message: "try to delete unrelated node", this:this,node })
            console.warn({message:""})
            return;
        }
    }
}