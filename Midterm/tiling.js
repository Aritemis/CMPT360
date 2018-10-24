"use strict";

var canvas;
var gl;

var points = [];

var nRows = 16;
var nColumns = 32;

// connect to html
var colorFlagLoc;
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

// ortho projection
var near = -1;
var far = 1;
var left = 0;
var bottom = -1;

var right = (nColumns - 1);
var ytop = (nRows * 2) - 1;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    points =
    [
        vec2( -1, -1 ),
        vec2(  0,  1 ),
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


    // connect
    colorFlagLoc = gl.getUniformLocation(program, "colorFlag");
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    // button
    document.getElementById( "row_btn" ).onclick = function ()
    {
        nRows = document.getElementById('row_input').value;
        ytop = (Number(nRows) * 2) - 1;
    };
    document.getElementById( "column_btn" ).onclick = function ()
    {
        nColumns = document.getElementById('column_input').value;
        right = (Number(nColumns) - 1);
    };

    render();
};

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );

    projectionMatrix = ortho(left, right, bottom, ytop, near, far);
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );


    for(var row = 0; row < nRows; row++)
    {
      for(var col = 0; col < nColumns; col++)
      {
        var type = (row + col) % 2;
        var translation = translate(col, (row * 2), 0);
        var rotation = rotateZ((type * 180));

        modelViewMatrix = mult(translation, rotation);
        //modelViewMatrix = translation;
        //modelViewMatrix = rotation;

        if(type == 1)
        {
          gl.uniform4fv(colorFlagLoc, flatten(vec4(0.0, (153.0/255.0), (153.0/255.0), 1.0)));
        }
        else
        {
          gl.uniform4fv(colorFlagLoc, flatten(vec4((51.0/255.0), 1.0, 1.0, 1.0)));
        }

        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.drawArrays( gl.TRIANGLES, 0, points.length );
      }
    }

    requestAnimFrame( render );
}
