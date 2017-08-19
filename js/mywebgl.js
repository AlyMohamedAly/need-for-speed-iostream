/// <reference path= "js/babylon.max.js" />
/// <reference path= "js/cannon.max.js"/ >

document.addEventListener("DOMContentLoaded", startGame, false);

var canvas;
var engine;
var scene;

function startGame() {
    canvas = document.getElementById("renderCanvas");
    engine = new BABYLON.Engine(canvas);
    scene = new BABYLON.Scene(engine);

    //var camera = new BABYLON.FreeCamera("myCam",new //BABYLON.Vector3(3,5,0),scene);

    var cube = BABYLON.Mesh.CreateTorus("torus", 5, 1, 10, scene);

    var cubeMat = new BABYLON.StandardMaterial("mat1", scene);
    cubeMat.diffuseColor = new BABYLON.Color3(0, 0, 1);
    cubeMat.emissiveColor = new BABYLON.Color3.Green;
    cube.material = cubeMat;
    var camera = new BABYLON.ArcRotateCamera("camera", 0, 1.2, 10, cube, scene);
    camera.attachControl(canvas);
    var light = new BABYLON.PointLight("L1", new BABYLON.Vector3(0, 5, 0), scene);
    var light2 = new BABYLON.PointLight("L2", new BABYLON.Vector3(5, 5, 0), scene);
    var light3 = new BABYLON.PointLight("L3", new BABYLON.Vector3(0, 10, 9), scene);
    //light.diffuse= new BABYLON.Color3.Red;
    light.specular = new BABYLON.Color3.Red;
    engine.runRenderLoop(function () {
        engine.clear(new BABYLON.Color3(1, 0, 0), true);
        scene.render();

    }
    );


}