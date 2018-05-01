class GameOfLife {
    /**
     * WebGL frame buffer based game-of-life
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
        let attributes = {
            pos: gl.getAttribLocation(program, 'pos')
        }
        let uniforms = {
            field: gl.getUniformLocation(program, 'field')
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
        /// field
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
        /// new field, render buffer
        ///

        let new_field = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, new_field)
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, width, height, 0, gl.RED, gl.UNSIGNED_BYTE, null)

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

        let fb_new = gl.createFramebuffer()
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb_new)
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, new_field, 0)


        let fb_old = gl.createFramebuffer()
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb_old)
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, field, 0)

        this.gl = gl
        this.field = field
        this.new_field = new_field
        this.program = program
        this.fb_new = fb_new
        this.fb_old = fb_old
        this.attributes = attributes;
        this.uniforms = uniforms;
    }

    nextEpoch() {
        let gl = this.gl
        gl.useProgram(this.program)
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb_new)
        gl.bindFramebuffer(gl.FRAMEBUFFER,null)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.field)
        gl.uniform1i(this.uniforms.field,0)

        //gl.viewport(0, 0, this.width, this.height)
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)

        //gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.fb_new);
        //gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.fb_old);
        //gl.blitFramebuffer(0, 0, this.width, this.height, 0, 0, this.width, this.height, gl.COLOR_BUFFER_BIT, gl.NEAREST);
        //swap field and new_field
    }

    render() {
        //simple pass-thru shader
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

uniform sampler2D field;
out vec4 outColor;

void main() {
    ivec2 coord = ivec2(floor(gl_FragCoord.xy));
    float state = texelFetch(field,coord,0).r;
    
  /* outColor = vec4(state,0,0,0);*/
outColor = vec4(0,1,0,1);
}
`

const vertex_shader_direct_source =
    `#version 300 es
in vec2 pos;
in vec2 texCoord;
out vec2 v_texCoord;

void main() {
  gl_Position = pos;
  v_texCoord = texCoord;
}
`

const fragment_shader_direct_source =
    `#version 300 es

uniform sampler2D field;
in vec2 v_texCoord;
out vec4 outColor;

void main() {
   outColor = vec4(tex2D(),1);
}
`
