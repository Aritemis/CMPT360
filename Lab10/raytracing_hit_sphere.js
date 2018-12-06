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
  var nx = 500;
  var ny = 500;
  var lowerLeft = vec2(-1, -1);
  var horizontal = vec2(2, 0);
  var vertical = vec2(0, 2);
  var o = vec2(0, 0);
  for(var j = (ny - 1); j >= 0; j--)
  {
    for(var i = 0; i < nx; i++)
    {
      var u = (i/nx);
      var v = (j/ny);
      var r = new ray(o, add(lowerLeft, add(scale(u, horizontal), scale(v, vertical))));
      var col = colors(r);
      pointsArray.push(r.direction());
      colorsArray.push(col);
    }
  }
}

function colors(r)
{
  var result = vec3(1, 0, 0);
  if(!(hit_sphere(vec2(0, 0), .5, r)))
  {
    result = mix(vec3(1.0, 1.0, 1.0), vec3(.5, .7, 1.0), (.5 * (r.direction()[1] + 1.0)));
  }
  return result;
}

function hit_sphere(center, radius, r)
{
  var oC = subtract(r.origin(), center);
  var dir = r.direction();
  var a = dot(dir, dir);
  var b = 2 * dot(oC, dir);
  var c = dot(oC, oC) - (radius * radius);
  var dis = (b * b - 4 * a * c);
  console.log(dis);
  return dis <= .5;
}

var render = function()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays( gl.POINTS, 0, pointsArray.length );
}
