"use strict";


var render, canvas, gl;

var NumTimesToSubdivide = 5;

var points =[];

var divideCurve = function(c, l , r)
{
// divides c into left (l) and right ( r ) curve data
   var mid = mix(c[1], c[2], 0.5);

   l[0] = vec2(c[0]);
   l[1] = mix(c[0], c[1], 0.5 );
   l[2] = mix(l[1], mid, 0.5 );

   r[3] = vec2(c[3]);
   r[2] = mix(c[2], c[3], 0.5 );
   r[1] = mix( mid, r[2], 0.5 );

   r[0] = mix(l[2], r[1], 0.5 );
   l[3] = vec2(r[0]);

   return;
}

var divide = function(p, count)
{
   if ( count > 0 )
   {
        var l = [];
        var r = [];
        divideCurve( p, l, r );

        divide( l, count - 1 );
        divide( r, count - 1 );
    }
    else
    {
        points.push(p[0]);
        points.push(p[3]);
    }
    return;
}

var d = 0.5;
var number_points_on_circle = 4;
var vertices = [];

function generate_vertices(d, number_points_on_circle)
{
    var theta = (2 * Math.PI)/number_points_on_circle;
    for(var i = 0; i < number_points_on_circle; i++)
    {
      var currentTheta = i * theta;
      var point = vec2(Math.cos(currentTheta), Math.sin(currentTheta));
      var q = vec2(-1 * Math.sin(currentTheta), Math.cos(currentTheta));
      vertices.push(subtract(point, scale(d, q)));
      vertices.push(point);
      vertices.push(add(point, scale(d, q)));
    }
    vertices.push(vertices[0]);
    vertices.push(vertices[1]);
}

function addpoints()
{
    // Call divide(vertices.slice(start, end), NumTimesToSubdivide) to draw Bezier curves one by one.
    for(var i = 0; i < number_points_on_circle; i++)
    {
      var index = 1 + (i * 3);
      divide(vertices.slice(index, index + 4), NumTimesToSubdivide);
    }
}

onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    generate_vertices(d, number_points_on_circle);
    addpoints();

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );

    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    document.getElementById("d" ).onclick = function ()
    {
        d = document.getElementById('input1').value;
        points = [];
        vertices = [];
        init();
    };
    document.getElementById( "number" ).onclick = function ()
    {
        number_points_on_circle = document.getElementById('input2').value;
        points = [];
        vertices = [];
        init();
    };

    render();
}

render = function()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawArrays( gl.LINE_STRIP, 0, points.length );
}
