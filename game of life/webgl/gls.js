/**
 * Create a simple webgl program contains vertex and fragment shader
 * @param {WebGLRenderingContext} gl
 * @param {string} vertex_shader_source
 * @param {string} fragment_shader_source
 */
function CreateSimpleProgram(gl, vertex_shader_source, fragment_shader_source) {

    let vs = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vs, vertex_shader_source)
    gl.compileShader(vs)
    console.log(gl.getShaderInfoLog(vs));

    let fs = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fs, fragment_shader_source)
    gl.compileShader(fs)
    console.log(gl.getShaderInfoLog(fs));

    let program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    console.log(gl.getProgramInfoLog(program));

    //clean up shaders (the programe is still valid)
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    gl.detachShader(program, vs)
    gl.detachShader(program, fs)

    return program
}

/**
 * WebGL frame buffer based game-of-life
 */
class GameOfLife {
    /**
     * @param {WebGLRenderingContext} gl
     * @param {Number} width
     * @param {Number} height
     */
    constructor(gl, width, height) {
        this.width = width;
        this.height = height;

        ///
        /// program
        ///

        let program = CreateSimpleProgram(gl, vertex_shader_source, fragment_shader_source)

        let attributes = {
            pos: gl.getAttribLocation(program, 'pos')
        }
        let uniforms = {
            field: gl.getUniformLocation(program, 'field'),
            transition: gl.getUniformLocation(program, 'transition')
        }

        ///
        /// vertex
        ///

        let vao = gl.createVertexArray()
        gl.bindVertexArray(vao)

        let buffer_pos = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer_pos)
        let pos = [].concat([-1, -1], [1, -1], [1, 1], [-1, 1])
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(attributes.pos)
        gl.vertexAttribPointer(attributes.pos, 2, gl.FLOAT, false, 0, 0)

        ///
        /// field (with random data)
        ///

        let field_data = new Uint8Array(width * height);
        field_data = field_data.map(x => Math.random() > 0.5 ? 255 : 0)

        let field = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, field)
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, width, height, 0, gl.RED, gl.UNSIGNED_BYTE, field_data)

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

        ///
        /// new field (empty)
        ///

        let new_field = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, new_field)
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, width, height, 0, gl.RED, gl.UNSIGNED_BYTE, null)

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

        ///
        /// frame buffers
        ///

        let fb_new = gl.createFramebuffer()
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb_new)
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, new_field, 0)

        let fb_old = gl.createFramebuffer()
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb_old)
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, field, 0)

        ///
        /// transition table
        ///
        /*
        let transition_table = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, new_field)
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, 2, 9, 0, gl.RED, gl.UNSIGNED_BYTE,
            new Uint8Array([
                0, 0,
                0, 0,
                0, 255,
                255, 255,
                0, 0,
                0, 0,
                0, 0,
                0, 0,
                0, 0
            ])
        )
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

        */
        this.gl = gl
        this.program = program

        this.field = field
        this.new_field = new_field
        this.fb_new = fb_new
        this.fb_old = fb_old
        //this.transition_table = transition_table

        this.attributes = attributes;
        this.uniforms = uniforms;
        this.vao = vao

        this.initRenderProgram()
    }

    nextEpoch() {
        let gl = this.gl
        gl.useProgram(this.program)
        gl.bindVertexArray(this.vao)

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.field)
        gl.uniform1i(this.uniforms.field, 0)

        //gl.activeTexture(gl.TEXTURE1)
        //gl.bindTexture(gl.TEXTURE_2D, this.transition_table)
        //gl.uniform1i(this.uniforms.transition, 1)

        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.fb_new)
        gl.viewport(0, 0, this.width, this.height)

        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)

        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.fb_new);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.fb_old);
        gl.blitFramebuffer(0, 0, this.width, this.height, 0, 0, this.width, this.height, gl.COLOR_BUFFER_BIT, gl.NEAREST);

        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
    }

    initRenderProgram() {
        let gl = this.gl
        let program = CreateSimpleProgram(gl, render_vertex_shader_source, render_fragment_shader_source)
        let u_field = gl.getUniformLocation(program, 'field')

        let vao = gl.createVertexArray()
        gl.bindVertexArray(vao)

        //pos attribute
        {
            let apos = gl.getAttribLocation(program, 'pos')
            let buffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);//full
            gl.enableVertexAttribArray(apos)
            gl.vertexAttribPointer(apos, 2, gl.FLOAT, false, 0, 0)
        }

        //texCoord attribute
        {
            let atex = gl.getAttribLocation(program, 'texCoord')
            let buffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), gl.STATIC_DRAW);//full
            gl.enableVertexAttribArray(atex)
            gl.vertexAttribPointer(atex, 2, gl.FLOAT, false, 0, 0)
        }

        this.renderProgram = {
            program,
            vao,
            u_field
        };
    }


    render() {
        let gl = this.gl
        let { program, vao, u_field } = this.renderProgram

        gl.useProgram(program)
        gl.bindVertexArray(vao)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.field)
        gl.uniform1i(u_field, 0)

        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null)
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
    }
}

const vertex_shader_source =
    `#version 300 es
in vec2 pos;

void main() {
  gl_Position = vec4(pos,0,1);
}

`

const fragment_shader_source =
    `#version 300 es

precision mediump float;
precision mediump int;

uniform sampler2D field;
uniform sampler2D transition; /*(current state, surrounding active) => next state */
out vec4 outColor;

void main() {
    ivec2 coord = ivec2(floor(gl_FragCoord.xy));
    int state = int(round(
        texelFetch(field,coord+ivec2(-1,-1),0).r
        +texelFetch(field,coord+ivec2(-1,0),0).r
        +texelFetch(field,coord+ivec2(-1,1),0).r
        +texelFetch(field,coord+ivec2(0,-1),0).r
        +texelFetch(field,coord+ivec2(0,1),0).r
        +texelFetch(field,coord+ivec2(1,-1),0).r
        +texelFetch(field,coord+ivec2(1,0),0).r
        +texelFetch(field,coord+ivec2(1,1),0).r
    ));

    int this_state = int(round(texelFetch(field,coord,0).r));
    //float next_state = texelFetch(transition, ivec2(this_state,state),0).r;
    //next_state = 0.0f;
    float next_state = float(state)/8.0f;
    outColor = vec4(next_state,0,0,1);
}
`


const render_vertex_shader_source =
    `#version 300 es
in vec2 pos;
in vec2 texCoord;
out vec2 v_texCoord;

void main() {
  gl_Position = vec4(pos,0,1);
  v_texCoord = texCoord;
}
`
//or multi target render?
const render_fragment_shader_source =
    `#version 300 es

precision mediump float;
uniform sampler2D field;
in vec2 v_texCoord;
out vec4 outColor;

void main() {
    float state = texture(field, v_texCoord).r;
    outColor = vec4(state,state,state,1);
}
`