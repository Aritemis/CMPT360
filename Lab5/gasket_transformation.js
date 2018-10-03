"use strict";

var canvas;
var gl;

var points = [];
var NumTimesToSubdivide = 3;


var CTM = mat4(); // identity matrix
var CTMLoc;

var toDivide;
//toDivide = ((2 * NumTimesToSubdivide) + (((NumTimesToSubdivide - 2) * 2) * Math.floor(NumTimesToSubdivide / 2)));
toDivide = 2 * NumTimesToSubdivide;

//I'm currently playing with this Nick
if(NumTimesToSubdivide > 2){ toDivide += 2 * (NumTimesToSubdivide) }

var scale = 1 / toDivide;
var scaled = scalem(scale, scale, scale);

var mod = 1;
var T1 = translate( 0.0, mod, 0.0);
var T2 = translate(-mod,-mod, 0.0);
var T3 = translate( mod,-mod, 0.0);

//var T = [T1, T2, T3];


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.
    points =
    [
        vec2(  0,  1 ),
        vec2( -1, -1 ),
        vec2(  1, -1 )
    ];

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    CTMLoc = gl.getUniformLocation(program, "matrix");

    document.getElementById( "btn" ).onclick = function ()
    {
        NumTimesToSubdivide = document.getElementById('input').value;
    };

    render();
};

function triangle(path)
{
    // Draw three triangles.

    var x = path[0][0];
    var y = (path[0][1] + path[1][1])/2;
    var center = translate(x, y, 0);

    CTM = mult(mult(center, scaled), T1);
    gl.uniformMatrix4fv(CTMLoc, false, flatten(CTM));
    gl.drawArrays( gl.TRIANGLES, 0, points.length );

    CTM = mult(mult(center, scaled), T2);
    gl.uniformMatrix4fv(CTMLoc, false, flatten(CTM));
    gl.drawArrays( gl.TRIANGLES, 0, points.length );

    CTM = mult(mult(center, scaled), T3);
    gl.uniformMatrix4fv(CTMLoc, false, flatten(CTM));
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}

function divideTriangle(path, count)
{
    // check for end of recursion
    if ( count == 1 )
    {
        triangle(path);
    }
    else if( count == 0 )
    {
      gl.uniformMatrix4fv(CTMLoc, false, flatten(CTM));
      gl.drawArrays( gl.TRIANGLES, 0, points.length );
    }
    else
    {
        count--;
        // Change path and recursively call divideTriangle
        var half = [.5, .5];
        var ab = mult( add( path[0], path[1] ), half );
        var ac = mult( add( path[0], path[2] ), half );
        var bc = mult( add( path[1], path[2] ), half );
        //call for 3 new triangles
        divideTriangle( [path[0], ab, ac], count );
        divideTriangle( [ab, path[1], bc], count );
        divideTriangle( [ac, bc, path[2]], count );
    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );

    var path = points.slice();
    divideTriangle(path, NumTimesToSubdivide);

    //requestAnimFrame( render );

}
