var gl, program;

// Define vertices of one branch here
var vertices =
[

//    vec2(0, 0),
//    vec2(-2.2, 10),
//    vec2(-4, -5.5),
//    vec2(-2.5, -6),
//    vec2(-1.6, 3),
//    vec2(-1, 0),
//    vec2(0, 0)

    vec2( 0.0 , 2.0 ),
    vec2( 0.1 , 1.0 ),
    vec2( 0.4 , 1.0 ),
    vec2( 0.0 , 4.0 ),
    vec2(-1.0 ,-0.3 ),
    vec2(-0.5 ,-0.5 ),
    vec2( 0.0 , 2.0 )

];

var CTM;
var CTMLoc;

function main()
{
    //Retrieve <canvas> element
    var canvas = document.getElementById( "gl-canvas" );

    //Get the rendering context for WebGL
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //  Configure WebGL
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.viewport( 0, 0, canvas.width, canvas.height );

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    CTM = mat4(); // Initialize CTM as a identity matrix
    // Connect matrix in html file with CTMLoc.
    CTMLoc = gl.getUniformLocation(program, "matrix");

    //Draw the stars
    render();
};

//Draw the 12 stars
function render()
{
    //Clear <canvas>
    gl.clear( gl.COLOR_BUFFER_BIT );

    // You should transform one branch to form a star, and then transform one star to form a wreath
    // You should not push any exact positions to the array vertices.
    // Instead of that, you should draw this wreath only by transformations.
    // Your code goes here:

    var scale  = 0.08;
    var radius = .8;
    var theta;
    var scaled = scalem( scale, scale, scale );

    for(var i = 1; i < 13; i++)
    {
      theta = (30 * i) * (Math.PI / 180);
      //translated = translate(  0,  radius,  0 );
      a = radius * Math.cos(theta);
      b = radius * Math.sin(theta);
      translateOne = translate( a, b, 0);
      //rotated = rotateZ(theta);
      for(var j = 1; j < 6; j++)
      {
        theta = ( 72 * j );
        // * (Math.PI / 180);
        rotateBranch = rotateZ(theta);

        CTM = mult( mult( translateOne, rotateBranch ), scaled );
        //CTM = mult( mult( mult( rotated, translateOne ), rotateBranch ), scaled );
        //CTM = mult( mult( translateOne, mult( rotated, rotateBranch ) ), scaled );
        //CTM = scaled;


        gl.uniformMatrix4fv(CTMLoc, false, flatten(CTM));
        gl.drawArrays(gl.LINE_STRIP, 0, 7);
      }
    }



    // Pass CTM to CTMLoc
    //gl.uniformMatrix4fv(CTMLoc, false, flatten(CTM));
    // Use 7 vertices to draw one branch
    //gl.drawArrays(gl.LINE_STRIP, 0, 7);
}
