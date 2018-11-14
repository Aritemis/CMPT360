
var gl, canvas;
var program;

var points = []; //Store the points for the fern
var number_points = 100000; // Number of points

var pattern_type = 0;

var colorValue = 0;
var colorLoc;
var projectionMatrix, projectionMatrix;

var left = -5;
var right = 5;
var bottom = 0;
var ytop = 10;
var near = -1;
var far = 1;

window.onload = function init()
{
	// Retrieve <canvas> element
	canvas = document.getElementById("gl-canvas");

	//Get the rendering context for WebGL
	gl = WebGLUtils.setupWebGL( canvas );
	if (!gl)
	{
		console.log('Fill to get the rendering context for WebGL');
		return;
	};

	//Generate points
	addpoints(pattern_type);

	//Configure WebGL
	gl.clearColor(1.0, 1.0, 1.0, 1.0);

	//Initialize shaders
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

	// Load the data into the GPU
	var vBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

    //Get the storage
    colorLoc = gl.getUniformLocation(program, "color_index");
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

	var menu1 = document.getElementById("menu1");
    menu1.addEventListener("change", function()
		{
				pattern_type = menu1.selectedIndex;
				init();
		})

		var menu2 = document.getElementById("menu2");
			menu2.addEventListener("change", function()
			{
					colorValue = menu2.selectedIndex;
			})

    render();
}

// Generate points
function addpoints(pattern_type)
{
	points = [];

	var previousX = 0.0;
	var previousY = 0.0;

	//points.push(vec2(0,0));

	for(var i = 0; points.length < number_points; i++)
	{
		var constants = getConstants(pattern_type);
		var a = constants[0];
		var b = constants[1];
		var c = constants[2];
		var d = constants[3];
		var e = constants[4];
		var f = constants[5];

		var x = (a * previousX) + (b * previousY) + e;
		var y = (c * previousX) + (d * previousY) + f;

		if(i > 99)
		{
			points.push([x,y]);
		}
		//points.push(vec2(x,y));

		previousX = x;
		previousY = y;
	}
	console.log(points);
}

function getConstants(pattern_type)
{
	var randomValue = Math.random();

	switch(pattern_type)
	{
		case 0:
			if(randomValue <= .1)
			{
				return [ 0.00, 0.00, 0.00, 0.16, 0.00, 0.00];
			}
			else if(randomValue <= .18)
			{
				return [ 0.20,-0.26, 0.23, 0.22, 0.00, 1.60];
			}
			else if(randomValue <= .26)
			{
				return [-0.15, 0.28, 0.26, 0.24, 0.00, 0.44];
			}
			else
			{
				return [ 0.75, 0.04,-0.04, 0.85, 0.00, 1.60];
			}
			break;
		case 2:
			if(randomValue <= .01)
			{
				return [ 0.00, 0.00, 0.00, 0.16, 0.00, 0.00];
			}
			else if(randomValue <= .08)
			{
				return [ 0.20,-0.26, 0.23, 0.22, 0.00, 1.60];
			}
			else if(randomValue <= .15)
			{
				return [-0.15, 0.28, 0.26, 0.24, 0.00, 0.44];
			}
			else
			{
				return [ 0.75, 0.04,-0.04, 0.85, 0.00, 1.60];
			}
			break;
	}
}

//Draw the initial fern
function render()
{
	gl.clear( gl.COLOR_BUFFER_BIT );

  projectionMatrix = ortho(left, right, bottom, ytop, near, far);
  gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

	gl.uniform1i(colorLoc, colorValue);

	//Draw the fern
	gl.drawArrays(gl.POINTS, 0, points.length);


	requestAnimationFrame(render);
}
