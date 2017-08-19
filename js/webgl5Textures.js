
//
// <reference path="libs/jquery-1.9.1/jquery-1.9.1.j" />
// <reference path="libs/three.js.r58/three.js" />
// <reference path="libs/three.js.r58/controls/OrbitControls.js" />
// <reference path="libs/three.js.r59/loaders/ColladaLoader.js" />
// <reference path="libs/requestAnimationFrame/RequestAnimationFrame.js" />
// <reference path="js/babylon.max.js" />
// <reference path="js/cannon.max.js" />
// <reference path="js/glMatrix-0.9.5.min.js" />


document.addEventListener("DOMContentLoaded", start);

function start() {


    var canvas = document.getElementById("renderCanvas");
    var gl = canvas.getContext("webgl");


    var triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    var vertices = [
    -0.5, -0.5, -0.5,
     0.5, -0.5, -0.5,
     0.5, 0.5, -0.5,
     0.5, 0.5, -0.5,
    -0.5, 0.5, -0.5,
    -0.5, -0.5, -0.5,

    -0.5, -0.5, 0.5,
     0.5, -0.5, 0.5,
     0.5, 0.5, 0.5,
     0.5, 0.5, 0.5,
    -0.5, 0.5, 0.5,
    -0.5, -0.5, 0.5,

    -0.5, 0.5, 0.5,
    -0.5, 0.5, -0.5,
    -0.5, -0.5, -0.5,
    -0.5, -0.5, -0.5,
    -0.5, -0.5, 0.5,
    -0.5, 0.5, 0.5,

     0.5, 0.5, 0.5,
     0.5, 0.5, -0.5,
     0.5, -0.5, -0.5,
     0.5, -0.5, -0.5,
     0.5, -0.5, 0.5,
     0.5, 0.5, 0.5,

    -0.5, -0.5, -0.5,
     0.5, -0.5, -0.5,
     0.5, -0.5, 0.5,
     0.5, -0.5, 0.5,
    -0.5, -0.5, 0.5,
    -0.5, -0.5, -0.5,

    -0.5, 0.5, -0.5,
     0.5, 0.5, -0.5,
     0.5, 0.5, 0.5,
     0.5, 0.5, 0.5,
    -0.5, 0.5, 0.5,
    -0.5, 0.5, -0.5
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


    var faceColors = [
        [1.0, 0.0, 0.0, 1.0], // Front face
        [0.0, 1.0, 0.0, 1.0], // Back face
        [0.0, 0.0, 1.0, 1.0], // Top face
        [1.0, 1.0, 0.0, 1.0], // Bottom face
        [1.0, 0.0, 1.0, 1.0], // Right face
        [0.0, 1.0, 1.0, 1.0] // Left face
    ];

    var colors = [];
    for (var i in faceColors) {
        var color = faceColors[i];
        for (var j = 0; j < 6; j++) {
            colors = colors.concat(color);
        }
    }

    var triangleVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    var textureCoordinates = [
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          1.0, 1.0,
          0.0, 1.0,
          0.0, 0.0,

          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          1.0, 1.0,
          0.0, 1.0,
          0.0, 0.0,

          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
          0.0, 1.0,
          0.0, 0.0,
          1.0, 0.0,

          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
          0.0, 1.0,
          0.0, 0.0,
          1.0, 0.0,

          0.0, 1.0,
          1.0, 1.0,
          1.0, 0.0,
          1.0, 0.0,
          0.0, 0.0,
          0.0, 1.0,

          0.0, 1.0,
          1.0, 1.0,
          1.0, 0.0,
          1.0, 0.0,
          0.0, 0.0,
          0.0, 1.0
];

    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

    var isTextureReady = false;


    var webGLTexture = gl.createTexture();
    webGLTexture.image = new Image();
    webGLTexture.image.src = "images/webgl-logo-256.jpg";

    webGLTexture.image.onload = function () {
            
       gl.bindTexture(gl.TEXTURE_2D, webGLTexture);
       gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
       //void gl.texImage2D(target, level, internalformat, format, type, HTMLImageElement? pixels);
       gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, webGLTexture.image);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
       gl.bindTexture(gl.TEXTURE_2D, null);
       isTextureReady = true;
        }
        
    


    var shaderProgram;
    var fragmentShader = getShader("shader-fs");
    var vertexShader = getShader("shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);


    var vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "position");
    gl.enableVertexAttribArray(vertexPositionAttribute);

    var vertexColorAttribute = gl.getAttribLocation(shaderProgram, "color");
    gl.enableVertexAttribArray(vertexColorAttribute);

    var vertexTextureAttribute = gl.getAttribLocation(shaderProgram, "textureCoord");
    gl.enableVertexAttribArray(vertexTextureAttribute);


    var modelViewMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "modelViewMatrix");
    var projectionMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    var samplerUniformLocation = gl.getUniformLocation(shaderProgram, "uSampler");

    var modelViewMatrix = mat4.create();
    var projectionMatrix = mat4.create();


    var angle = 0;


    mat4.perspective(projectionMatrix, 45, canvas.width / canvas.height, 0.1, 100.0);

    function renderLoop() {
        if (!isTextureReady) {
            requestAnimationFrame(renderLoop);
            return;
        }
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0, 0, 0, 1);


        mat4.identity(modelViewMatrix);

        mat4.translate(modelViewMatrix, modelViewMatrix,[0.0, 0.0, -1]);
        
        mat4.rotateY(modelViewMatrix,modelViewMatrix, angle);

        mat4.rotateZ(modelViewMatrix,modelViewMatrix, angle / 4.0);
         angle += .01;

        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
        gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.vertexAttribPointer(vertexTextureAttribute, 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0); // you have at least 8 textures possible
        gl.bindTexture(gl.TEXTURE_2D, webGLTexture);


        gl.uniform1i(samplerUniformLocation, 0);


        setMatrixUniforms();

        gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);

        // Register for the next frame
        requestAnimationFrame(renderLoop);
    }


    requestAnimationFrame(renderLoop);



    function getShader(id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, shaderScript.text);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    function setMatrixUniforms() {
        gl.uniformMatrix4fv(projectionMatrixUniformLocation, false, projectionMatrix);
        gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, modelViewMatrix);
    }

}


