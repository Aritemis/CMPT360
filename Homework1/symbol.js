

var canvas;
var gl;

var points = [];

var NumberOfPoints_Circle = 48;
var circleLength = NumberOfPoints_Circle + 1;
var NumberOfPoints_Hexagram = 12;
var hexagramLength = NumberOfPoints_Hexagram + 1;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // Call GeneratePoints to push points into points[]
    GeneratePoints();

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

    render();
};

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT)

    // gl.drawArrays(gl.LINE_STRIP, starting_index, number of points)
    // draw outer circle
    gl.drawArrays(gl.LINE_STRIP, 0, circleLength);
    // draw inner hexagram
    gl.drawArrays(gl.LINE_STRIP, circleLength, hexagramLength);

}

// generate points
function GeneratePoints()
{
    var inner_radius = 0.5;    // Radius of the inner circle
    var outer_radius = 1.0;    // Radius of the outer circle
    var incrementCircle = 360 / NumberOfPoints_Circle;
    var incrementHexagram = 360 / NumberOfPoints_Hexagram;

    // Push all points into points[]

    for(var i = 0; i < circleLength; i++)
    {
      theta = (incrementCircle * i) * (Math.PI / 180);
      points.push(vec2(outer_radius * Math.cos(theta), outer_radius * Math.sin(theta)));
    }

    for(var j = 0; j < hexagramLength; j++)
    {
      theta = (incrementHexagram * j) * (Math.PI / 180);
      radius = outer_radius;
      if(j % 2 == 0)
      {
        radius = inner_radius;
      }
      points.push(vec2(radius * Math.cos(theta), radius * Math.sin(theta)));
    }
}
