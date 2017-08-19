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
var scene;
var tank;
var clones = [];
var dude;

var isWPressed = false;
var isDPressed = false;
var isSPressed = false;
var isAPressed = false;

document.addEventListener("DOMContentLoaded", startGame, false);

function startGame() {
    canvas = document.getElementById("renderCanvas");
    engine = new BABYLON.Engine(canvas, true);
    //engine.isPointerLock = true;
    scene = new BABYLON.Scene(engine);

    var ground = createGround();
    //ground.position = new BABYLON.Vector3(0, 0, 0);
    tank = createHero();
    //loadDude();
    var freeCamera = createFreeCamera();
    var followCamera = createFollowCamera();
    scene.activeCamera = followCamera;

    var light_1 = new BABYLON.HemisphericLight("L1", new BABYLON.Vector3(0, 5, 0), scene);

    engine.runRenderLoop(function () {
        scene.render();
        applyTankMovement();
        //applyDudeMovement();

    });
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


}

function createGround() {
    var ground = new BABYLON.Mesh.CreateGroundFromHeightMap("G1", "images/Untitled2.png", 1000, 1000, 20, 0, 100, scene, false);
    //var ground = BABYLON.Mesh.CreateGround("ground", 200, 200, 2, scene);
    var groundMaterial = new BABYLON.StandardMaterial("M1", scene);
    //groundMaterial.diffuseColor = new BABYLON.Color3.White;
    //groundMaterial.ambientColor = new BABYLON.Color3.White;
    groundMaterial.diffuseTexture = new BABYLON.Texture("images/concrete.jpg", scene);
    ground.material = groundMaterial;
    //ground.position = new BABYLON.Vector3(0, 0, 0);
    ground.checkCollisions = true;
    return ground;
}

function createFreeCamera() {
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

function createFollowCamera() {
    var camera = new BABYLON.FollowCamera("follow", new BABYLON.Vector3(0, 2, -20), scene, tank);
    camera.lockedTarget = tank;
    camera.radius = 12;
    camera.heightOffset = 2;
    camera.rotationOffset = 0;
    camera.cameraAcceleration = 0.05;
    camera.maxCameraSpeed = 10;
    camera.checkCollisions = true;
    return camera;
}

function createHero() {
    materialWood = new BABYLON.StandardMaterial("wood", scene);
    materialWood.diffuseColor = new BABYLON.Color3.Green;
    //materialWood.emissiveColor = new BABYLON.Color3.Yellow;

    var tank = new BABYLON.Mesh.CreateBox("tank", 2, scene);

    var tankMaterial = new BABYLON.StandardMaterial("tankMat", scene);
    tankMaterial.diffuseColor = new BABYLON.Vector3(0.90, 0.67, 0.93);
    tank.material = tankMaterial;
    tank.ellipsoid = new BABYLON.Vector3(2, 1.0, 2);
    tank.ellipsoidOffset = new BABYLON.Vector3(0, 1.0, 0);
    tank.scaling.y = 0.5;
    tank.scaling.x = 1.5;
    tank.scaling.z = 2;
    tank.position.addInPlace(new BABYLON.Vector3(290, 1, 290));
    tank.rotationSensitivity =0.4;
    tank.speed = 1;
    tank.frontVector = new BABYLON.Vector3(0, 0, -1);

    //console.log(tank.position);
    //var tankMadfa3 = BABYLON.Mesh.CreateBox("madfa3", 1, scene, true);
    //tankMadfa3.scaling.x *= .6;
    //tankMadfa3.scaling.y*= .6;
    //tankMadfa3.scaling.z *= 1.2;
    //tankMadfa3.position.z -= .5;
    //tankMadfa3.position.y += 1.4;
    //materialWood = new BABYLON.StandardMaterial("wood", scene);
    //materialWood.diffuseColor = new BABYLON.Color3.Green;
    ////materialWood.emissiveColor = new BABYLON.Color3.Yellow;
    //tankMadfa3.material = materialWood;

    //tankMadfa3.parent = tank;

    //var leftleg = BABYLON.Mesh.CreateCylinder("regll", 5, 1, 1, 6, 1, scene);
    //leftleg.scaling.x *= 0.5;
    //leftleg.scaling.y*= 2.5;
    //leftleg.scaling.z *= 0.5;
    //leftleg.position.y += 6;
    //leftleg.position.x += 0.7;
    ////tankleg.position.z += 1;
    //leftleg.material = materialWood;
    //leftleg.parent = tank;

    //var rightleg = BABYLON.Mesh.CreateCylinder("reglr", 5, 1, 1, 6, 1, scene);
    //rightleg.scaling.x *= 0.5;
    //rightleg.scaling.y *= 2.5;
    //rightleg.scaling.z *= 0.5;
    //rightleg.position.y += 6;
    //rightleg.position.x -= 0.7;
    ////tankleg.position.z += 1;
    //rightleg.material = materialWood;
    //rightleg.parent = tank;


    //var waist = BABYLON.Mesh.CreateBox("west", 2, scene);
    //tank.scaling.y = 0.5;
    //tank.scaling.x = 1.5;
    //tank.scaling.z = 2;
    //waist.position.y += 12;
    ////rightleg.position.x -= 0.7;
    ////tankleg.position.z += 1;
    //rightleg.material = materialWood;
    //waist.parent = tank;

    return tank;
}

function applyTankMovement() {
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
        console.log("pos: " + tank.position);
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

function loadDude() {
    //BABYLON.SceneLoader.ImportMesh("Audi_Optimised02", "scenes/", "audioptimised02.babylon", scene, onDudeLoaded);
    //BABYLON.SceneLoader.ImportMesh("Gluttony", "scenes/", "gluttony.babylon", scene, onDudeLoaded);
    BABYLON.SceneLoader.ImportMesh("him", "scenes/", "Dude.babylon", scene, onDudeLoaded);
}

function onDudeLoaded(newMeshes, particleSystems, skeletons) {
    dude = newMeshes[0];
    dude.position.y = 0;
    newMeshes[0].scaling.y *= 0.1;
    newMeshes[0].scaling.x *= 0.1;
    newMeshes[0].scaling.z *= 0.1;
    //scene.beginAnimation(skeletons[0], 0, 120, 1.0, true);
}

function applyDudeMovement() {
    if (dude) {
        dude.MovementVector = new BABYLON.Vector3(tank.position.x * 0.01 - dude.position.x * 0.01, 0, tank.position.z * 0.01 - dude.position.z * 0.01);
        dude.position.addInPlace(dude.MovementVector);
        var dot = BABYLON.Vector3.Dot(dude.MovementVector.normalize(), new BABYLON.Vector3(0, 0, -1));
        var angle = Math.acos(dot);
        dude.rotation.y = angle;
    }
}

//function clone(dude, angle, radius)
//{
//    var id = clones.length;
//    clones[id] = dude.clone("clone_" + id);
//    clones[id].skeletons = [];

//    for (var i = 0; i < dude.skeletons.length; i += 1) {
//        clones[id].skeletons[i] = dude.skeletons[i].clone("skeleton clone #" + i);
//        scene.beginAnimation(clones[id].skeletons[i], 0, 120, 1.0, true);
//    }

//    if (dude._children) {
//        //dude is a parent mesh with multiple _children.

//        for (var i = 0; i < dude._children.length; i += 1) {
//            if (clones[id].skeletons.length > 1) //Mostlikely a seperate skeleton for each child mesh..
//                clones[id]._children[i].skeleton = clones[id].skeletons[i];
//            else //Mostlikely a single skeleton for all child meshes.
//                clones[id]._children[i].skeleton = clones[id].skeletons[0];
//        }

//    }

//    else {
//        //dude is a single mesh with no _children
//        clones[id].skeleton = clones[id].skeletons[0];
//    }

//    clones[id].position = new BABYLON.Vector3(Math.cos(angle)*radius , 2 , -1 * Math.sin(angle))
//}