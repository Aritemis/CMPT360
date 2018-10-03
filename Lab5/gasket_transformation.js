"use strict";

var canvas;
var gl;

var points = [];
var NumTimesToSubdivide = 0;

var mod = 1;
var T1 = translate( 0.0, mod, 0.0);
var T2 = translate(-mod,-mod, 0.0);
var T3 = translate( mod,-mod, 0.0);

var T = [T1, T2, T3];

var half = [.5, .5];

var CTM = mat4(); // identity matrix
var CTMLoc;

var scale;
var scaled;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

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
    var x = path[0][0];
    var y = (path[0][1] + path[1][1])/2;
    var center = translate(x, y, 0);

    for ( var i = 0; i < T.length; i++ )
    {
      CTM = mult(mult(center, scaled), T[i]);
      gl.uniformMatrix4fv(CTMLoc, false, flatten(CTM));
      gl.drawArrays( gl.TRIANGLES, 0, points.length );
    }
}

function divideTriangle(path, count)
{
    if (count > 0 && count == NumTimesToSubdivide)
    {
      path = points.slice();
      scale = scale = 1 / Math.pow(2, NumTimesToSubdivide);
      scaled = scalem(scale, scale, scale);
    }

    if( count == 0 )
    {
      gl.uniformMatrix4fv(CTMLoc, false, flatten(CTM));
      gl.drawArrays( gl.TRIANGLES, 0, points.length );
    }
    else if ( count == 1 )
    {
        triangle(path);
    }
    else
    {
        count--;
        // Change path and recursively call divideTriangle
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

    var path = [[],[],[]];
    divideTriangle(path, NumTimesToSubdivide);

    requestAnimFrame( render );
}
