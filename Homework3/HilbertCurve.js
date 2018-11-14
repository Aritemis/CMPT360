"use strict";

var canvas;
var gl;

var points = [];

// Initial value of depth, type, and start.
var depth = 1;
var type = "A"
var start = vec2(0,0);

var projectionMatrix, projectionMatrixLoc;

var left = -.1;
var right = 1;
var bottom = -.1;
var ytop = 1;
var near = -1;
var far = 1;

function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //  Initialize our data
    points = [];
    points.push(start);
    console.log(start);
    addpoints(start, type, depth);
    console.log(points);

    //  Configure WebGL
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

    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );


    document.getElementById( "btn" ).onclick = function ()
    {
        depth = Number(document.getElementById('input').value);
        reset_init(depth, type);
    };

    var menu1 = document.getElementById("menu1");
    menu1.addEventListener("change", function()
    {
        switch (menu1.selectedIndex)
        {
			       case 0:
                type = "A";
                reset_init(depth, type);
                break;
			       case 1:
				        type = "B";
                reset_init(depth, type);
                break;
            case 2:
				        type = "C";
                reset_init(depth, type);
                break;
            case 3:
				        type = "D";
                reset_init(depth, type);
                break;
        }
	})

    render();
};

function reset_init(depth, type)
{
  // Reset right, ytop, and start based on depth and type.
  var bounds = 1;

  for(var i = 1; i < depth; i++)
  {
    bounds = (2 * bounds) + 1;
  }

  right = bounds;
  ytop = bounds;

  switch (type)
  {
    case "A": case "B":
      start = vec2(0,0);
      break;
    case "C": case "D":
      start = vec2(bounds,bounds);
      break;
  }

  init();
}

// Draw a line from start by one unit in the direction.
// direction is left, right, downward, and upward.
function draw_line(start, direction)
{
    console.log();
    console.log(start);
    switch (direction)
    {
      case "upward":
        start = vec2(start[0], start[1] + 1);
        break;

      case "downward":
        start = vec2(start[0], start[1] - 1);
        break;

      case "left":
        start = vec2(start[0] - 1, start[1]);
        break;

      case "right":
        start = vec2(start[0] + 1, start[1]);
        break;
    }
    console.log(start);
    points.push(start);
    return start;
}

// Draw a single primitive by calling draw_line from start at depth 1.
// type is A, B, C, and D.
function draw_primitive(start, type)
{
    switch(type)
    {
      case "A":
        start = draw_line(start, "upward");
        start = draw_line(start, "right");
        start = draw_line(start, "downward");
        break;
      case "B":
        start = draw_line(start, "right");
        start = draw_line(start, "upward");
        start = draw_line(start, "left");
        break;
      case "C":
        start = draw_line(start, "left");
        start = draw_line(start, "downward");
        start = draw_line(start, "right");
        break;
      case "D":
        start = draw_line(start, "downward");
        start = draw_line(start, "left");
        start = draw_line(start, "upward");
        break;
    }
    return start;
}

// Use formulas to recursively call itself based on type A, B, C, or D to draw curves at lower depth.
// Call draw_primitive if depth is 1.
// Call draw_line when it is needed.
function addpoints(start, type, depth)
{
  if(depth == 1)
  {
    start = draw_primitive(start, type);
  }
  else
  {
    switch (type)
    {
      case "A":
        start = addpoints(start, "B", depth - 1);
        start = draw_line(start, "upward");
        start = addpoints(start, "A", depth - 1);
        start = draw_line(start, "right");
        start = addpoints(start, "A", depth - 1);
        start = draw_line(start, "downward");
        start = addpoints(start, "C", depth - 1);
        break;
      case "B":
        start = addpoints(start, "A", depth - 1);
        start = draw_line(start, "right");
        start = addpoints(start, "B", depth - 1);
        start = draw_line(start, "upward");
        start = addpoints(start, "B", depth - 1);
        start = draw_line(start, "left");
        start = addpoints(start, "D", depth - 1);
        break;
      case "C":
        start = addpoints(start, "D", depth - 1);
        start = draw_line(start, "left");
        start = addpoints(start, "C", depth - 1);
        start = draw_line(start, "downward");
        start = addpoints(start, "C", depth - 1);
        start = draw_line(start, "right");
        start = addpoints(start, "A", depth - 1);
        break;
      case "D":
        start = addpoints(start, "C", depth - 1);
        start = draw_line(start, "downward");
        start = addpoints(start, "D", depth - 1);
        start = draw_line(start, "left");
        start = addpoints(start, "D", depth - 1);
        start = draw_line(start, "upward");
        start = addpoints(start, "B", depth - 1);
        break;
    }
  }
  return start;
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );

    projectionMatrix = ortho(left, right, bottom, ytop, near, far);
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    gl.drawArrays( gl.LINE_STRIP, 0, points.length );
}
