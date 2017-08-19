


document.addEventListener("DOMContentLoaded", start);

function start() {

    var canvas = document.getElementById("renderCanvas");
    var gl = canvas.getContext("webgl");


    var triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    var vertices = [ 
         0.0, 1.0, 0.0,
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),
        gl.STATIC_DRAW);

    var triangleVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    var colors = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    var triangleVertexPositionsAndColorsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionsAndColorsBuffer);
    var positionsAndColors = [
         0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        -1.0, -1.0, 0.0, 0.0, 1.0, 0.0, 1.0,
         1.0, -1.0, 0.0, 0.0, 0.0, 1.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionsAndColors), gl.STATIC_DRAW);


    var shaderProgram;

    var vertexShader = getShader("shader-vs");
    var fragmentShader = getShader("shader-fs");

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



    var FLOAT_SIZE = 4;

    function renderLoop() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clearColor(0, 0, 0, 1);

        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
        gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

        
        //void gl.vertexAttribPointer(index, size, type, normalized, stride, offset);

        //// Alternatively do :: 
        //gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionsAndColorsBuffer);
        //gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 7*FLOAT_SIZE, 0);
        //gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 7*FLOAT_SIZE, 3*FLOAT_SIZE);

        gl.drawArrays(gl.TRIANGLES, 0, 3);

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

}


