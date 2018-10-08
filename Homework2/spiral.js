

var gl, program;

var points = [];

var modelViewMatrixLoc;
var modelViewMatrix=mat4();
var indexLoc;

function main()
{

    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    GeneratePoints();

    //  Configure WebGL
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
    // Generate and push points to points[] for rose
    // Your code goes here:




    // Generate and push 1500 points to points[] for spiral
    // Your code goes here:



}


function DrawRoseAndSpiral()
{

    modelViewMatrix=mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniform1i(indexLoc, 0); // set color of spiral as red
    // Call gl.drawArrays( gl.LINE_STRIP, ..) for spiral
    // Your code goes here:



    // Create modelViewMatrix for moving rose
    // Do not forget to reset rose to origin after reaching to the end of spiral
    // Your code goes here:


    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniform1i(indexLoc, 1); // set color of rose as black
    // Call gl.drawArrays( gl.TRIANGLE_FAN, ..) for rose
    // Your code goes here:


}


function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT );

    DrawRoseAndSpiral();

    requestAnimationFrame(render);

}
