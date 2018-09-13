"use strict";

var canvas;
var gl;

var NumVertices  = 60;

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];

var thetaLoc;

var rotation_increase = 0.0;
var rotation_onoff = false;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );


    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta");

    //event listeners for buttons

    document.getElementById( "xButton" ).onclick = function ()
    {
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function ()
    {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function ()
    {
        axis = zAxis;
    };
    document.getElementById( "Rotation" ).onclick = function ()
    {
        if(rotation_onoff)
        {
            rotation_increase = 0.0;
            rotation_onoff = false;
        }
        else
        {
            rotation_increase = 2.0;
            rotation_onoff = true;
        }
    };

    render();
}

// build faces
function colorCube()
{
    // Define 10 faces here.
    // Please make sure every face has a different color.

    quad(  0,  1,  3,  2 );
    quad(  4,  6,  9,  7 );
    quad( 10, 11, 13, 12 );

    quad(  1,  0,  4,  5 );
    quad(  3,  2,  7,  8 );
    quad(  6,  4, 10, 11 );
    quad(  9,  7, 12, 13 );

    quad( 12,  2,  0, 10 );
    quad(  8,  3,  1,  5 );
    quad( 13,  9,  6, 11 );

}

// vertices and colors
function quad(a, b, c, d)
{
    var vertices =
    [
      vec4( 0.0,  0.0,  0.0, 1.0 ),
      vec4( 0.2,  0.0,  0.0, 1.0 ),
      vec4( 0.0,  0.0, -0.2, 1.0 ),
      vec4( 0.2,  0.0, -0.2, 1.0 ),

      vec4( 0.0, -0.8,  0.0, 1.0 ),
      vec4( 0.2, -0.8,  0.0, 1.0 ),
      vec4( 0.6, -0.8,  0.0, 1.0 ),
      vec4( 0.0, -0.8, -0.2, 1.0 ),
      vec4( 0.2, -0.8, -0.2, 1.0 ),
      vec4( 0.6, -0.8, -0.2, 1.0 ),

      vec4( 0.0, -1.0,  0.0, 1.0 ),
      vec4( 0.6, -1.0,  0.0, 1.0 ),
      vec4( 0.0, -1.0, -0.2, 1.0 ),
      vec4( 0.6, -1.0, -0.2, 1.0 )
    ];

    var vertexColors =
    [
        // Define 14 different colors here
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 0.5, 0.5, 1.0 ],
        [ 0.5, 0.5, 0.5, 1.0 ],
        [ 0.5, 0.0, 0.0, 1.0 ],
        [ 0.5, 0.5, 0.0, 1.0 ],
        [ 0.0, 0.5, 0.0, 1.0 ],
        [ 0.0, 0.0, 0.5, 1.0 ],
        [ 0.5, 0.0, 0.5, 1.0 ]

    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i )
    {
        points.push( vertices[indices[i]] );

        //for interpolated colored faces
        //colors.push( vertexColors[indices[i]] );

        //for solid colored faces
        colors.push(vertexColors[a]);

    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[axis] += rotation_increase;
    gl.uniform3fv(thetaLoc, theta);

    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    requestAnimFrame( render );
}
