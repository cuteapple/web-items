class GameOfLife {
    constructor(gl, width, height) {
        this.width = width;
        this.height = height;
        //this.initShaders()

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

        let vao = gl.createVertexArray()
        gl.bindVertexArray(vao)

        let buffer_pos = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer_pos)
        let pos = [].concat([0, 0], [width, 0], [width, height], [0, height])
        gl.bufferData(gl.ARRAY_BUFFER, new Uint16Array(pos), gl.STATIC_DRAW);

        for (let a of attributes)
            gl.enableVertexAttribArray(a)

        gl.vertexAttribPointer(attributes.pos, 2, gl.UNSIGNED_SHORT, false, 0, 0)

        let field = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, field)

        let field_data = new Uint8Array(width * height);
        field_data = field_data.map(x => Math.random() > 0.5 ? 511 : 0)//255?
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, width, height, 0, gl.R8, gl.UNSIGNED_BYTE, field_data)

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

        let new_field = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, new_field)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, width, height, 0, gl.R8, gl.UNSIGNED_BYTE, null)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

        let fb = gl.createFramebuffer()
        gl.bindBuffer(gl.FRAMEBUFFER, fb)
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, field, 0)

        let textureLocation = 0
        gl.uniform1i(uniforms.field, 0)

        this.field = field
        this.new_field = new_field
        this.program = program
        this.fb = fb
        this.textureLocation = textureLocation
    }

    nextEpoch() {
        gl.useProgram(this.program)
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.field)
        gl.viewport(this.width, this.height)

        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4 * 2)//?

        gl.bindFramebuffer(GL_READ_FRAMEBUFFER, src);
        gl.bindFramebuffer(GL_DRAW_FRAMEBUFFER, dst);
        gl.blitFramebuffer(src_left, src_bottom, src_right, src_top, 0, 0, dst_width, dst_height, mask, GL_NEAREST);
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
    
   outColor = vec4(state,0,0,0);
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
