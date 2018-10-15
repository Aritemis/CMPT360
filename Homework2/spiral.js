

var gl, program;

var points = [];

var modelViewMatrixLoc;
var modelViewMatrix = mat4();
var indexLoc;

var flowerLength;
var spiralLength;

var len = 0;

function main()
{

    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    GeneratePoints();

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    indexLoc = gl.getUniformLocation(program, "index");

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

// Generate points for the rose and the spiral track
function GeneratePoints()
{
    flowerLength = 0;
    spiralLength = 0;
    var p = .1;
    var k = 3;

    points.push(vec2(0,0))
    for(var i = 0; i < 2 * (Math.PI); i += .01)
    {
        flowerLength++;
        var x = p * Math.cos(k * i) * Math.cos(i);
        var y = p * Math.cos(k * i) * Math.sin(i);
        points.push(vec2(x,y));
    }

    p = .035;
    for(var i = 0; i < 25; i += .1)
    {
        spiralLength++;
        var x = p * i * Math.cos(i);
        var y = p * i * Math.sin(i);
        points.push(vec2(x,y));
    }





}


function DrawRoseAndSpiral()
{

    modelViewMatrix = mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniform1i(indexLoc, 0); // set color of spiral as red
    // Call gl.drawArrays( gl.LINE_STRIP, ..) for spiral

    gl.drawArrays(gl.LINE_STRIP, flowerLength + 1, spiralLength);



    // Create modelViewMatrix for moving rose
    // Do not forget to reset rose to origin after reaching to the end of spiral
    // Your code goes here:

    p = .035;
    len += .1;
    if(len >= 25)
    {
      len = 0;
    }
    var x = p * len * Math.cos(len);
    var y = p * len * Math.sin(len);
    modelViewMatrix = translate(x, y, 0);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniform1i(indexLoc, 1); // set color of rose as black
    // Call gl.drawArrays( gl.TRIANGLE_FAN, ..) for rose

    gl.drawArrays(gl.TRIANGLE_FAN , 0, flowerLength);


}


function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT );

    DrawRoseAndSpiral();

    requestAnimationFrame(render);

}
