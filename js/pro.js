//
// <reference path="libs/jquery-1.9.1/jquery-1.9.1.j" />
// <reference path="libs/three.js.r58/three.js" />
// <reference path="libs/three.js.r58/controls/OrbitControls.js" />
// <reference path="libs/three.js.r59/loaders/ColladaLoader.js" />
// <reference path="libs/requestAnimationFrame/RequestAnimationFrame.js" />
// <reference path="js/babylon.max.js" />
// <reference path="js/cannon.max.js" />

var canvas;
var engine;
var Game = {};
Game.scenes = [];
Game.activeScene = 0;

var isWPressed = false;
var isDPressed = false;
var isSPressed = false;
var isAPressed = false;

document.addEventListener("DOMContentLoaded", startGame, false);

Game.createFirstScene = function () {
    var scene = new BABYLON.Scene(engine);
    var ground = createGround(scene);
    var light1 = new BABYLON.HemisphericLight("l1", new BABYLON.Vector3(0, 5, 0), scene);
    var tank = createHero(scene);
    var followCamera = createFollowCamera(tank, scene);
    var portal = new BABYLON.Mesh.CreateCylinder("portal", 10, 10, 10, 50, 50, scene);
    portal.position = new BABYLON.Vector3(20, 5, 10);
    portal.material = new BABYLON.StandardMaterial("portalMaterial", scene);
    portal.material.diffuseTexture = new BABYLON.Texture("images/lightning.jpg", scene);
    portal.material.diffuseTexture.uScale = 3;

    Game.scenes.push(scene);

    Game.scenes[0].applyTankMovement = function (tank) {

        if (isWPressed) {
            tank.moveWithCollisions(tank.frontVector.multiplyByFloats(tank.speed, tank.speed, tank.speed));
        }
        if (isSPressed) {
            var reverseVector = tank.frontVector.multiplyByFloats(-1, 1, -1).multiplyByFloats(tank.speed, tank.speed, tank.speed);
            tank.moveWithCollisions(reverseVector);

        }
        if (isDPressed) {
            tank.rotation.y += .1 * tank.rotationSensitivity;
        }
        if (isAPressed)
            tank.rotation.y -= .1 * tank.rotationSensitivity;
        tank.frontVector.x = Math.sin(tank.rotation.y) * -1;
        tank.frontVector.z = Math.cos(tank.rotation.y) * -1;
    }


    Game.scenes[0].checkMoveToNextLevel = function (tank, portal) {
        if (
            tank.position.x > portal.position.x - 3 &&
            tank.position.x < portal.position.x + 3 &&
            tank.position.z > portal.position.z - 3 &&
            tank.position.z < portal.position.z + 3
        )
            Game.activeScene = 1;

    }
    Game.scenes[0].renderLoop = function () {
        this.applyTankMovement(tank);
        this.checkMoveToNextLevel(tank, portal);
        this.render();
    }

    return scene;

}

Game.createSecondScene = function () {
    var scene = new BABYLON.Scene(engine);
    var ground = createGround(scene);
    var light1 = new BABYLON.HemisphericLight("l1", new BABYLON.Vector3(0, 5, 0), scene);
    var tank = createHero(scene);
    var followCamera = createFollowCamera(tank, scene);
    Game.scenes.push(scene);

    Game.scenes[1].renderLoop = function () {
        this.render();
    }
}

function startGame() {
    canvas = document.getElementById("renderCanvas");
    engine = new BABYLON.Engine(canvas, true);
    engine.isPointerLock = true;
    //engine.displayLoadingUI();
    Game.createFirstScene();
    Game.createSecondScene();


    engine.runRenderLoop(function () {
        Game.scenes[Game.activeScene].renderLoop();
    });

}
    //window.addEventListener("mousemove", function () {   // We try to pick an object   var pickResult = scene.pick(scene.pointerX, scene.pointerY);});
    document.addEventListener("keydown", function (event) {

        if (event.key === 'a' || event.key === 'A') {
            isAPressed = true;
        }
        if (event.key === 'd' || event.key === 'D') {
            isDPressed = true;
        }
        if (event.key === 'w' || event.key === 'W') {
            isWPressed = true;
        }
        if (event.key === 's' || event.key === 'S') {
            isSPressed = true;
        }
    });

    document.addEventListener("keyup", function (event) {

        if (event.key === 'a' || event.key === 'A') {
            isAPressed = false;
        }
        if (event.key === 'd' || event.key === 'D') {
            isDPressed = false;
        }
        if (event.key === 'w' || event.key === 'W') {
            isWPressed = false;
        }
        if (event.key === 's' || event.key === 'S') {
            isSPressed = false;
        }
    });

function createGround(scene) {
    var ground = new BABYLON.Mesh.CreateGroundFromHeightMap("G1", "images/height1.png", 300, 100, 20, 0, 100, scene, false);
    //var ground = BABYLON.Mesh.CreateGround("ground", 200, 200, 2, scene);
    var groundMaterial = new BABYLON.StandardMaterial("M1", scene);
    //groundMaterial.diffuseColor = new BABYLON.Color3.White;
    //groundMaterial.ambientColor = new BABYLON.Color3.White;
    groundMaterial.diffuseTexture = new BABYLON.Texture("images/grasslight-big.jpg", scene);
    ground.material = groundMaterial;
    //ground.position = new BABYLON.Vector3(0, 0, 0);
    ground.checkCollisions = true;
    return ground;
}

function createFreeCamera(scene) {
    var camera = new BABYLON.FreeCamera("C1", new BABYLON.Vector3(0, 5, 0), scene);
    camera.attachControl(canvas);
    camera.keysUp.push('w'.charCodeAt(0));
    camera.keysUp.push('W'.charCodeAt(0));

    camera.keysLeft.push('a'.charCodeAt(0));
    camera.keysLeft.push('A'.charCodeAt(0));

    camera.keysDown.push('s'.charCodeAt(0));
    camera.keysDown.push('S'.charCodeAt(0));

    camera.keysRight.push('d'.charCodeAt(0));
    camera.keysRight.push('D'.charCodeAt(0));

    camera.checkCollisions = true;

    return camera;
}

function createFollowCamera(tar, scene) {
    var camera = new BABYLON.FollowCamera("follow", new BABYLON.Vector3(0, 2, -20), scene);
    camera.lockedTarget = tar;
    camera.radius = 10;
    camera.heightOffset = 2;
    camera.rotationOffset = 0;
    camera.cameraAcceleration = 0.05;
    camera.maxCameraSpeed = 10;
    camera.checkCollisions = true;
    return camera;
}

function createHero(scene) {
    var tank = new BABYLON.Mesh.CreateBox("tank", 2, scene);
    var tankMaterial = new BABYLON.StandardMaterial("tankMat", scene);
    tankMaterial.diffuseColor = new BABYLON.Vector3(0.90, 0.67, 0.93);
    tank.material = tankMaterial;
    tank.ellipsoid = new BABYLON.Vector3(2, 1.0, 2);
    tank.ellipsoidOffset = new BABYLON.Vector3(0, 1.0, 0);
    tank.scaling.y = 0.5;
    tank.scaling.x = 1.5;
    tank.scaling.z = 2;
    tank.position.addInPlace(new BABYLON.Vector3(0, 1, 30));
    tank.rotationSensitivity =0.4;
    tank.speed = 0.7;
    tank.frontVector = new BABYLON.Vector3(0, 0, -1);
    //console.log(tank.position);
    var tankMadfa3 = BABYLON.Mesh.CreateBox("madfa3", 1, scene, true);
    tankMadfa3.scaling.x *= .6;
    tankMadfa3.scaling.y*= .6;
    tankMadfa3.scaling.z *= 1.2;
    tankMadfa3.position.z -= .5;
    tankMadfa3.position.y += 1.4;
    materialWood = new BABYLON.StandardMaterial("wood", scene);
    materialWood.diffuseColor = new BABYLON.Color3.Green;
    //materialWood.emissiveColor = new BABYLON.Color3.Yellow;
    tankMadfa3.material = materialWood;

    tankMadfa3.parent = tank;
    return tank;
}

function applyTankMovement(tank, scene) {
    //console.log(tank.position);
    if (isWPressed) {

        //tank.position.addInPlace(tank.frontVector).multiplyByFloats(tank.speed);
        //console.log(tank.frontVector);
        //console.log(tank.frontVector.multiplyByFloats(tank.speed, tank.speed, tank.speed));
        //console.log(tank.frontVector.multiply(tank.speed));
        //console.log("vec: " + tank.frontVector);
        //console.log("pos: " + tank.position);
        tank.moveWithCollisions(tank.frontVector.multiplyByFloats(tank.speed, 0, tank.speed));
        //tank.moveWithCollisions(tank.frontVector.multiply(tank.speed));
        //.multiplyByFloats(tank.speed));
    }

    if (isSPressed) {
        //var reverseVector = tank.frontVector.multiplyByFloats(-1, -1, -1);
        //tank.position.addInPlace(reverseVector).multiply(tank.speed);
        tank.moveWithCollisions(tank.frontVector.multiplyByFloats(-tank.speed, 0, -tank.speed));
        //console.log("vec: " + tank.frontVector);
        //console.log("pos: " + tank.position);
    }

    if (isDPressed) {
        tank.rotation.y += 0.1 * tank.rotationSensitivity;
        tank.frontVector.x = Math.sin(tank.rotation.y) * -1;
        tank.frontVector.z = Math.cos(tank.rotation.y) * -1;
    }

    if (isAPressed) {
        tank.rotation.y -= 0.1 * tank.rotationSensitivity;
        tank.frontVector.x = Math.sin(tank.rotation.y) * -1;
        tank.frontVector.z = Math.cos(tank.rotation.y) * -1;
    }

    //if (tank.position.z < -28)
    //    tank.position.z = -28;

    //if (tank.position.z > 43)
    //    tank.position.z = 43;

    //if (tank.position.x > 43)
    //    tank.position.x = 43;

    //if (tank.position.x < -43)
    //    tank.position.x = -43;

    if (tank.position.y > 1)
        tank.position.y = 1;

}