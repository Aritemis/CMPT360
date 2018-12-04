"use strict";

var canvas;
var gl;
var program;

// point array and color array
var pointsArray = [];
var colorsArray = [];

window.onload = function init()
{

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    // add positions and colors of points
    main();

    // Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // push point array and color array in buffers
        //
    //  Load shaders and initialize attribute buffers
    //
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    render();
}

function main()
{
    pointsArray = [];
    colorsArray = [];
    var nx = 500;
    var ny = 500;

    for(var j = 0; j < ny; j++)
    {
      for(var i = 0; i < nx; i++)
      {
        //var y = -1 + (j * 2 * (.0039));
        //var x = -1 + (i * 2 * (.0039));
        var y = -1 + (j * (3 / ny));
        var x = -1 + (i * (6 / nx));
        pointsArray.push(vec3(x, y, 0));
        //pointsArray.push(vec3(i/nx, j/ny, 0));
        //colorsArray.push(vec3(0,0,0));
        colorsArray.push(vec3((i/nx), (j/ny), .2))
        //console.log(vec3(i, j, 0));
        //console.log(vec3((i/nx), (j/ny), .2))
      }
    }
    //console.log(pointsArray);
    //console.log(colorsArray);

}


var render = function()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays( gl.POINTS, 0, pointsArray.length );
}
