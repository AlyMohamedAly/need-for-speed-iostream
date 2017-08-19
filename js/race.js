// <reference path="libs/jquery-1.9.1/jquery-1.9.1.j" />
// <reference path="libs/three.js.r58/three.js" />
// <reference path="libs/three.js.r58/controls/OrbitControls.js" />
// <reference path="libs/three.js.r59/loaders/ColladaLoader.js" />
// <reference path="libs/requestAnimationFrame/RequestAnimationFrame.js" />
// <reference path="js/babylon.max.js" />
// <reference path="js/cannon.max.js" />
// <reference path="js/babylon.d.ts" />

var canvas;
var engine;
var scene;
var tank;
var laps = 0;
var satellite;
var finish;
//var checkPoint;

var isWPressed = false;
var isDPressed = false;
var isSPressed = false;
var isAPressed = false;
var isGPressed = false;
var passedCheckpoint = false;

document.addEventListener("DOMContentLoaded", startGame, false);

function startGame() {
    canvas = document.getElementById("renderCanvas");
    engine = new BABYLON.Engine(canvas, true);
    //engine.isPointerLock = true;
    scene = new BABYLON.Scene(engine);

    var ground = createGround();
    finish = createFinishLine();
    //checkPoint = createCheckpoint();
    tank = createHero();
    //loadSpace7arakat();
    tank.position.x = 612;
    tank.position.z = 419;
    var freeCamera = createFreeCamera();
    var followCamera = createFollowCamera();
    scene.activeCamera = followCamera;
    

    var light_1 = new BABYLON.HemisphericLight("L1", new BABYLON.Vector3(0, 5, 0), scene);

    
    engine.runRenderLoop(function () {
        scene.render();
        applyTankMovement();

    });
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
        if (event.key === 'g' || event.key === 'G') {
            isGPressed = true;
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
        if (event.key === 'g' || event.key === 'G') {
            isGPressed = false;
        }
    });


}

function createGround() {
    var ground = new BABYLON.Mesh.CreateGroundFromHeightMap("G1", "images/Untitled2.png", 2000, 2000, 20, 0, 100, scene, false);
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
function createFinishLine() {

    var lineMaterial = new BABYLON.StandardMaterial("M2", scene);
    lineMaterial.diffuseTexture = new BABYLON.Texture("images/stripes33.jpg", scene);
    lineMaterial.emissiveColor = new BABYLON.Color3(0, 1, 0);

    var signMaterial = new BABYLON.StandardMaterial("M3", scene);
    signMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);

    var mat = new BABYLON.StandardMaterial("mat", scene);
    mat.diffuseColor = BABYLON.Color3.White();
    mat.alpha = 0;

    var finishLine = BABYLON.Mesh.CreateBox("line", 2, scene);
    finishLine.scaling.x = 130;
    finishLine.scaling.y = 0.1;
    finishLine.scaling.z = 5;
    finishLine.position.x = 587;
    finishLine.position.y = 0;
    finishLine.position.z = 387;
    finishLine.rotation.y = -0.5;
    finishLine.material = lineMaterial;

    var finishSign = BABYLON.Mesh.CreateCylinder("cylinder", 50, 3, 3, 12, 1, scene);
    finishSign.position.x = 476;
    finishSign.position.y = 25;
    finishSign.position.z = 325;
    finishSign.material = signMaterial;
    finishLine.sign1 = finishSign;

    var finishSign2 = BABYLON.Mesh.CreateCylinder("cylinder2", 50, 3, 3, 12, 1, scene);
    finishSign2.position.x = 699;
    finishSign2.position.y = 25;
    finishSign2.position.z = 450; 
    finishSign2.material = signMaterial;
    finishLine.sign2 = finishSign2;

    var finishFlag = BABYLON.Mesh.CreateBox("line", 2, scene);
    finishFlag.scaling.x = 128;
    finishFlag.scaling.y = 0.1;
    finishFlag.scaling.z = 5;
    finishFlag.position.x = 587.5;
    finishFlag.position.y = 50;
    finishFlag.position.z = 387.5;
    finishFlag.rotation.x = Math.PI / 2;
    finishFlag.rotation.y = -0.51;
    finishFlag.material = lineMaterial;
    finishLine.flag = finishFlag;




    var xd = BABYLON.Mesh.CreateBox("sss", 2, scene);
    xd.scaling.x = 130;
    xd.scaling.y = 1;
    xd.scaling.z = 5;
    xd.position.x = 587;
    xd.position.y = 1;
    xd.position.z = 387;
    xd.rotation.y = -0.5;
    xd.material = mat;
    
    return xd;
}

function createCheckpoint() {
    var checkpoint = BABYLON.Mesh.CreateBox("checkpoint", 2, scene);
    var checkMaterial = new BABYLON.StandardMaterial("M2", scene);

    checkpoint.scaling.x = 155;
    checkpoint.scaling.y = 0.1;
    checkpoint.scaling.z = 5;

    checkpoint.position.x = -727.5;
    checkpoint.position.y = 0;
    checkpoint.position.z = -123;
    //finishLine.rotation.y = Math.PI;
    
    checkMaterial.diffuseTexture = new BABYLON.Texture("images/stripes3.jpg", scene);
    checkMaterial.emissiveColor = new BABYLON.Color3(0, 1, 0);
    checkpoint.material = checkMaterial;
    return checkpoint;
}

//function loadSpace7arakat() {
//    BABYLON.SceneLoader.ImportMesh("final_robot_w_moves.", "scenes/", "final-robot-w-moves.babylon", scene, function (newMeshes) {
//        newMeshes[0].position.x = 627;
//        newMeshes[0].position.y = 1;
//        newMeshes[0].position.z = 247;
//        newMeshes[0].scaling.y *= 1;
//        newMeshes[0].scaling.x *= 1;
//        newMeshes[0].scaling.z *= 1;
//    });
//}

//function on7arakatLoaded(newMeshes, particleSystems, skeletons) {
   
//    //scene.beginAnimation(skeletons[0], 0, 120, 1.0, true);
//}
//function applyDudeMovement() {
//    if (dude) {
//        dude.MovementVector = new BABYLON.Vector3(tank.position.x * 0.01 - dude.position.x * 0.01, 0, tank.position.z * 0.01 - dude.position.z * 0.01);
//        dude.position.addInPlace(dude.MovementVector);
//        var dot = BABYLON.Vector3.Dot(dude.MovementVector.normalize(), new BABYLON.Vector3(0, 0, -1));
//        var angle = Math.acos(dot);
//        dude.rotation.y = angle;
//    }
//}

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
    tank.position.addInPlace(new BABYLON.Vector3(704, 1, 387));
    tank.rotationSensitivity = 1.3;

    tank.speed = 4;
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
  
    if (isGPressed) {
        console.log(tank.position);
        console.log(laps);
        console.log(passedCheckpoint);
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

    //if (passedCheckpoint && tank.position.x >= 476 && tank.position.x <= 698 && tank.position.z >= 326 && tank.position.z <= 442) {
    //    laps++;
    //    passedCheckpoint = false;
    //}

    if (tank.position.x >= -876 && tank.position.x <= -575 && tank.position.z >= -126 && tank.position.z <= -122) {
        passedCheckpoint = true;
    }

    //if (tank.position.z < -28)
    //    tank.position.z = -28;

    //if (tank.position.z > 43)
    //    tank.position.z = 43;

    //if (tank.position.x > 43)
    //    tank.position.x = 43;

    //if (tank.position.x < -43)
    //    tank.position.x = -43;

    if (passedCheckpoint && tank.intersectsMesh(finish, true)) {
        laps++;
        passedCheckpoint = false;
    }

    //if (tank.intersectsMesh(checkPoint, true)) {
    //    passedCheckpoint = true;
    //}

    if (tank.position.y > 1)
        tank.position.y = 1;

}