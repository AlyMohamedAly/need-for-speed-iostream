
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


    var firstTriangleVertexPositionBuffer = gl.createBuffer();
    var secondTriangleVertexPositionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, firstTriangleVertexPositionBuffer);
    var firstTriangleVertices = [
         0.0, 1.0, 0.0,
        -1.0, -1.0, 0.0,
         0.0, -1.0, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(firstTriangleVertices), gl.STATIC_DRAW);

    var secondTriangleVertices = [
     1.0, 1.0, 0.0,
    -0.1, -0.5, 0.0,
     0.25, -1.0, 0.0
    ];

    var secondTriangleVertexPositionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, secondTriangleVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(secondTriangleVertices), gl.STATIC_DRAW);


    var firstTriangleVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, firstTriangleVertexColorBuffer);
    var firstTriangleColors = [
        1.0, 0.0,1.0, 1.0,
        0.0, 1.0, 1.0, 1.0,
        0.0, 1.0, 0.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(firstTriangleColors), gl.STATIC_DRAW);


    var secondfirstTriangleVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, secondfirstTriangleVertexColorBuffer);
    var secondTriangleColors = [
        1.0, 0.0, 1.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
       1.0, .20, .50, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(secondTriangleColors), gl.STATIC_DRAW);



    var firstTriangleShaderProgram;
    var firstTriangleFragmentShader = getShader("shader-fs-first");
    var firstTriangleVertexShader = getShader("shader-vs-first");

    var secondtTriangleShaderProgram;
    var secondTriangleFragmentShader = getShader("shader-fs-first");
    var secondTriangleVertexShader = getShader("shader-vs-second");


    firstTriangleShaderProgram = gl.createProgram();
    gl.attachShader(firstTriangleShaderProgram, firstTriangleVertexShader);
    gl.attachShader(firstTriangleShaderProgram, firstTriangleFragmentShader);
    gl.linkProgram(firstTriangleShaderProgram);

    if (!gl.getProgramParameter(firstTriangleShaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }


    secondTriangleShaderProgram = gl.createProgram();
    gl.attachShader(secondTriangleShaderProgram, secondTriangleVertexShader);
    gl.attachShader(secondTriangleShaderProgram, secondTriangleFragmentShader);
    gl.linkProgram(secondTriangleShaderProgram);

    if (!gl.getProgramParameter(secondTriangleShaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders of second program");
    }


    gl.useProgram(firstTriangleShaderProgram);


    var firstShaderVertexPositionAttribute = gl.getAttribLocation(firstTriangleShaderProgram, "position");
    gl.enableVertexAttribArray(firstShaderVertexPositionAttribute);

    var firstShaderVertexColorAttribute = gl.getAttribLocation(firstTriangleShaderProgram, "color");
    gl.enableVertexAttribArray(firstShaderVertexColorAttribute);


    var firstShaderModelViewMatrixUniformLocation = gl.getUniformLocation(firstTriangleShaderProgram, "modelViewMatrix");
    var firstShaderProjectionMatrixUniformLocation = gl.getUniformLocation(firstTriangleShaderProgram, "projectionMatrix");


    gl.useProgram(secondTriangleShaderProgram);

    var secondShaderVertexPositionAttribute = gl.getAttribLocation(secondTriangleShaderProgram, "position");
    gl.enableVertexAttribArray(secondShaderVertexPositionAttribute);
    var secondShaderVertexColorAttribute = gl.getAttribLocation(secondTriangleShaderProgram, "color");
    gl.enableVertexAttribArray(secondShaderVertexColorAttribute);
    var secondShaderModelViewMatrixUniformLocation = gl.getUniformLocation(secondTriangleShaderProgram, "modelViewMatrix");
    var secondShaderProjectionMatrixUniformLocation = gl.getUniformLocation(secondTriangleShaderProgram, "projectionMatrix");



    var timeUniformLocation = gl.getUniformLocation(secondTriangleShaderProgram, "time");
    var time = 0;

    var modelViewMatrix = mat4.create();
    var projectionMatrix = mat4.create();


    var angle = 0;

    mat4.perspective(projectionMatrix, 45, canvas.width / canvas.height, 0.1, 100.0);

    function renderLoop() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clearColor(0, 0, 0, 1);


        gl.useProgram(firstTriangleShaderProgram);

        mat4.identity(modelViewMatrix);

        mat4.translate(modelViewMatrix, modelViewMatrix,[0.0, 0.0, -7]);
        mat4.rotateY(modelViewMatrix,modelViewMatrix, angle);
        mat4.rotateX(modelViewMatrix,modelViewMatrix, angle / 4.0);
        angle += .01;
        time += .01;

        gl.bindBuffer(gl.ARRAY_BUFFER, firstTriangleVertexPositionBuffer);
        gl.vertexAttribPointer(firstShaderVertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, firstTriangleVertexColorBuffer);
        gl.vertexAttribPointer(firstShaderVertexColorAttribute, 4, gl.FLOAT, false, 0, 0);


        setMatrixUniformsFirst();
        gl.drawArrays(gl.TRIANGLES, 0, 3);


        gl.useProgram(secondTriangleShaderProgram);

         secondShaderVertexPositionAttribute = gl.getAttribLocation(secondTriangleShaderProgram, "position");
        gl.enableVertexAttribArray(secondShaderVertexPositionAttribute);
         secondShaderVertexColorAttribute = gl.getAttribLocation(secondTriangleShaderProgram, "color");
        gl.enableVertexAttribArray(secondShaderVertexColorAttribute);

        mat4.identity(modelViewMatrix);

        mat4.translate(modelViewMatrix, modelViewMatrix,[0.0, 0.0, -7]);

        angle += .01;
        time += .01;

        gl.bindBuffer(gl.ARRAY_BUFFER, secondTriangleVertexPositionBuffer);
        gl.vertexAttribPointer(secondShaderVertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, secondfirstTriangleVertexColorBuffer);
        gl.vertexAttribPointer(secondShaderVertexColorAttribute, 4, gl.FLOAT, false, 0, 0);


        setUniformsSecond();
        gl.drawArrays(gl.TRIANGLES, 0, 3);


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

    function setMatrixUniformsFirst() {
        gl.uniformMatrix4fv(firstShaderProjectionMatrixUniformLocation, false, projectionMatrix);
        gl.uniformMatrix4fv(firstShaderModelViewMatrixUniformLocation, false, modelViewMatrix);
    }

    function setUniformsSecond() {
        gl.uniformMatrix4fv(secondShaderProjectionMatrixUniformLocation, false, projectionMatrix);
        gl.uniformMatrix4fv(secondShaderModelViewMatrixUniformLocation, false, modelViewMatrix);
        gl.uniform1f(timeUniformLocation, time);
    }

}


