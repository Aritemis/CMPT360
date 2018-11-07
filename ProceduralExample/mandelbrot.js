"use strict";

//
// Display a Mandelbrot set
//

var canvas;
var gl;

var max = 12;             /* number of interations per point */
var toggle = false;
var colorMode = true;

var program;

//----------------------------------------------------------------------------

onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );


    // Create and initialize a buffer object

    var points = [

    vec4(-1.0, -1.0, 0.0, 1.0),
	vec4(-1.0, 1.0, 0.0, 1.0),
	vec4(1.0, 1.0, 0.0, 1.0),
    vec4(-1.0, -1.0, 0.0, 1.0),
	vec4(1.0, 1.0, 0.0, 1.0),
    vec4(1.0, -1.0, 0.0, 1.0)
];

    // Load shaders and use the resulting shader program

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // set up vertex arrays
    var buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    var vPosition = gl.getAttribLocation( program, "vPosition" );

    gl.enableVertexAttribArray( vPosition );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0,0);
    gl.bufferData( gl.ARRAY_BUFFER,  flatten(points), gl.STATIC_DRAW );

    gl.uniform1i( gl.getUniformLocation(program, "max_iteration"), max);
    document.getElementById( "button1" ).onclick = function () {
        max = document.getElementById('max').value;
        gl.uniform1i( gl.getUniformLocation(program, "max_iteration"), max);
    };

    gl.uniform1i( gl.getUniformLocation(program, "colorMode"), colorMode);
    document.getElementById( "button2" ).onclick = function () {
        colorMode = !colorMode;
        gl.uniform1i( gl.getUniformLocation(program, "colorMode"), colorMode);
    };

    document.getElementById( "button" ).onclick = function () {
        toggle = !toggle;
    };

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.viewport(0, 0, canvas.width, canvas.height);
    render();
}

//----------------------------------------------------------------------------

var now = Date.now();
var then = now;

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    if (toggle){
        now = Date.now();
        if (now - then > 1000){
            max += 1;
            if (max>22) max=1;
            then = now;
        }
    }
    
    gl.uniform1i( gl.getUniformLocation(program, "max_iteration"), max);
    gl.drawArrays( gl.TRIANGLES, 0, 6 );
    requestAnimFrame(render);
}
