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
var ground;
var laps = 0;
var finish;
var particleSystem;
var projectile;
var origin;
var PowerUps = [];
const Powers = {
    Cannon: 'CannonBall',
    Oil: 'OilStain',
    SpeedIncrease: 'SpeedBuff',
    SpeedDecrease: 'SpeedNerf',
    none: "none"
}

var isWPressed = false;
var isDPressed = false;
var isSPressed = false;
var isAPressed = false;
var isGPressed = false;
var isBPressed = false;
var passedCheckpoint = false;

document.addEventListener("DOMContentLoaded", startGame, false);

function startGame() {
    canvas = document.getElementById("renderCanvas");
    engine = new BABYLON.Engine(canvas, true);
    //engine.isPointerLock = true;
    scene = new BABYLON.Scene(engine);

    ground = createGround();
    finish = createFinishLine();
    PowerUps = createPowerups();
    createSkybox();
    origin = new BABYLON.Vector3(0, 0, 0);

    scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.CannonJSPlugin());
    scene.gravity = new BABYLON.Vector3(0, -10, 0);

    particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
    particleSystem.particleTexture = new BABYLON.Texture("textures/flare.png", scene);
    particleSystem.color1 = new BABYLON.Color3(0.3, 0.56, 1);
    particleSystem.color2 = new BABYLON.Color3(0.9, 0.9, 1);

    //particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
    particleSystem.minSize = 0.2;
    particleSystem.maxSize = 0.9;
    particleSystem.minEmitBox = new BABYLON.Vector3(-2, -2, -2); // Starting all From
    particleSystem.maxEmitBox = new BABYLON.Vector3(2, 2, 2);
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 1.5;
    particleSystem.emitRate = 2000;
    // particleSystem.manualEmitCount = 300;
    particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

    //checkPoint = createCheckpoint();
    tank = createHero();
    //loadSpace7arakat();
    tank.position.x = 612;
    tank.position.z = 419;
    var freeCamera = createFreeCamera();
    var followCamera = createFollowCamera();
    scene.activeCamera = followCamera;
    particleSystem.emitter = tank;

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
        if (event.key === 'b' || event.key === 'B') {
            isBPressed = true;
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
        if (event.key === 'b' || event.key === 'B') {
            isBPressed = false;
        }
    });


}

function createGround() {
    var ground = new BABYLON.Mesh.CreateGroundFromHeightMap("G1", "images/Untitled2.png", 2000, 2000, 20, 0, 100, scene, false);
    //var ground = BABYLON.Mesh.CreateGround("ground", 200, 200, 2, scene);
    var groundMaterial = new BABYLON.StandardMaterial("M1", scene);
    //groundMaterial.diffuseColor = new BABYLON.Color3.White;
    //groundMaterial.ambientColor = new BABYLON.Color3.White;
    groundMaterial.diffuseTexture = new BABYLON.Texture("images/Earth.jpg", scene);
    ground.material = groundMaterial;
    //ground.position = new BABYLON.Vector3(0, 0, 0);
    ground.checkCollisions = true;
    return ground;
}
function createSkybox() {
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 10000.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    skybox.infiniteDistance = true;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/sky/sky", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

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




    var realFinishLine = BABYLON.Mesh.CreateBox("sss", 2, scene);
    realFinishLine.scaling.x = 130;
    realFinishLine.scaling.y = 1;
    realFinishLine.scaling.z = 5;
    realFinishLine.position.x = 587;
    realFinishLine.position.y = 1;
    realFinishLine.position.z = 387;
    realFinishLine.rotation.y = -0.5;
    realFinishLine.material = mat;

    return realFinishLine;
}

function createPowerups() {
    var Ups = [];
    var UpsMaterial = [];


    UpsMaterial[0] = new BABYLON.StandardMaterial("U1", scene);
    UpsMaterial[0].emissiveColor = new BABYLON.Color3(1, 1, 1);
    UpsMaterial[0].alpha = 0.8;

    UpsMaterial[1] = new BABYLON.StandardMaterial("U2", scene);
    UpsMaterial[1].emissiveColor = new BABYLON.Color3(1, 1, 1);
    UpsMaterial[1].alpha = 0.8;

    UpsMaterial[2] = new BABYLON.StandardMaterial("U3", scene);
    UpsMaterial[2].emissiveColor = new BABYLON.Color3(1, 1, 1);
    UpsMaterial[2].alpha = 0.8;

    UpsMaterial[3] = new BABYLON.StandardMaterial("U4", scene);
    UpsMaterial[3].emissiveColor = new BABYLON.Color3(1, 1, 1);
    UpsMaterial[3].alpha = 0.8;

    UpsMaterial[4] = new BABYLON.StandardMaterial("U5", scene);
    UpsMaterial[4].emissiveColor = new BABYLON.Color3(1, 1, 1);
    UpsMaterial[4].alpha = 0.8;

    UpsMaterial[5] = new BABYLON.StandardMaterial("U6", scene);
    UpsMaterial[5].emissiveColor = new BABYLON.Color3(1, 1, 1);
    UpsMaterial[5].alpha = 0.8;

    UpsMaterial[6] = new BABYLON.StandardMaterial("U7", scene);
    UpsMaterial[6].emissiveColor = new BABYLON.Color3(1, 1, 1);
    UpsMaterial[6].alpha = 0.8;

    UpsMaterial[7] = new BABYLON.StandardMaterial("U8", scene);
    UpsMaterial[7].emissiveColor = new BABYLON.Color3(1, 1, 1);
    UpsMaterial[7].alpha = 0.8;

    Ups[0] = new BABYLON.Mesh.CreateBox("powerup_1", 8, scene);
    Ups[1] = new BABYLON.Mesh.CreateBox("powerup_2", 8, scene);
    Ups[2] = new BABYLON.Mesh.CreateBox("powerup_3", 8, scene);
    Ups[3] = new BABYLON.Mesh.CreateBox("powerup_4", 8, scene);
    Ups[4] = new BABYLON.Mesh.CreateBox("powerup_5", 8, scene);
    Ups[5] = new BABYLON.Mesh.CreateBox("powerup_6", 8, scene);
    Ups[6] = new BABYLON.Mesh.CreateBox("powerup_7", 8, scene);
    Ups[7] = new BABYLON.Mesh.CreateBox("powerup_8", 8, scene);

    Ups[0].position.x = 563;
    Ups[0].position.y = 5;
    Ups[0].position.z = -445;

    Ups[1].position.x = 518;
    Ups[1].position.y = 5;
    Ups[1].position.z = -365;

    Ups[2].position.x = 473;
    Ups[2].position.y = 5;
    Ups[2].position.z = -307;

    Ups[3].position.x = 428;
    Ups[3].position.y = 5;
    Ups[3].position.z = -262;

    Ups[4].position.x = -609;
    Ups[4].position.y = 5;
    Ups[4].position.z = -22;

    Ups[5].position.x = -663;
    Ups[5].position.y = 5;
    Ups[5].position.z = -8;

    Ups[6].position.x = -718;
    Ups[6].position.y = 5;
    Ups[6].position.z = 5;

    Ups[7].position.x = -802;
    Ups[7].position.y = 5;
    Ups[7].position.z = 28;

    Ups[0].material = UpsMaterial[0];
    Ups[1].material = UpsMaterial[1];
    Ups[2].material = UpsMaterial[2];
    Ups[3].material = UpsMaterial[3];
    Ups[4].material = UpsMaterial[4];
    Ups[5].material = UpsMaterial[5];
    Ups[6].material = UpsMaterial[6];
    Ups[7].material = UpsMaterial[7];

    Ups[0].broken = false;
    Ups[1].broken = false;
    Ups[2].broken = false;
    Ups[3].broken = false;
    Ups[4].broken = false;
    Ups[5].broken = false;
    Ups[6].broken = false;
    Ups[7].broken = false;

    var animationBox = [];
    animationBox[0] = new BABYLON.Animation("tutoAnimation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    animationBox[1] = new BABYLON.Animation("tutoAnimation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    animationBox[2] = new BABYLON.Animation("tutoAnimation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    animationBox[3] = new BABYLON.Animation("tutoAnimation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    animationBox[4] = new BABYLON.Animation("tutoAnimation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    animationBox[5] = new BABYLON.Animation("tutoAnimation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    animationBox[6] = new BABYLON.Animation("tutoAnimation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    animationBox[7] = new BABYLON.Animation("tutoAnimation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    // Animation keys
    var keys = [];
    keys.push({
        frame: 0,
        value: 0
    });

    keys.push({
        frame: 60,
        value: 2 * Math.PI
    });


    animationBox[0].setKeys(keys);
    animationBox[1].setKeys(keys);
    animationBox[2].setKeys(keys);
    animationBox[3].setKeys(keys);
    animationBox[4].setKeys(keys);
    animationBox[5].setKeys(keys);
    animationBox[6].setKeys(keys);
    animationBox[7].setKeys(keys);

    Ups[0].animations.push(animationBox[0]);
    Ups[1].animations.push(animationBox[1]);
    Ups[2].animations.push(animationBox[2]);
    Ups[3].animations.push(animationBox[3]);
    Ups[4].animations.push(animationBox[4]);
    Ups[5].animations.push(animationBox[5]);
    Ups[6].animations.push(animationBox[6]);
    Ups[7].animations.push(animationBox[7]);

    scene.beginAnimation(Ups[0], 0, 60, true);
    scene.beginAnimation(Ups[1], 0, 60, true);
    scene.beginAnimation(Ups[2], 0, 60, true);
    scene.beginAnimation(Ups[3], 0, 60, true);
    scene.beginAnimation(Ups[4], 0, 60, true);
    scene.beginAnimation(Ups[5], 0, 60, true);
    scene.beginAnimation(Ups[6], 0, 60, true);
    scene.beginAnimation(Ups[7], 0, 60, true);




    return Ups;
}

function RandomPower() {
    if (tank.power !== "none")
        return tank.power;
    var r = Math.floor(Math.random() * 4);
    if (r === 0)
        return "SpeedBuff";
    if (r === 1)
        return "SpeedNerf";
    if (r === 2)
        return "CannonBall";
    if (r === 3)
        return "OilStain";
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
    //materialWood = new BABYLON.StandardMaterial("wood", scene);
    //materialWood.diffuseColor = new BABYLON.Color3.Green;
    ////materialWood.emissiveColor = new BABYLON.Color3.Yellow;

    var tank = new BABYLON.Mesh.CreateBox("tank", 2, scene);

    var tankMaterial = new BABYLON.StandardMaterial("tankMat", scene);
    // pink : tankMaterial.diffuseColor = new BABYLON.Vector3(0.90, 0.67, 0.93);
    // brown: tankMaterial.diffuseColor = new BABYLON.Vector3(0.27, 0.19, 0.19);
    tankMaterial.diffuseColor = new BABYLON.Color3.Yellow;
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
    tank.power = "none";
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
        console.log(tank.power);
        if (tank.power !== "none") {
            var cannonball = BABYLON.Mesh.CreateSphere("cannonball", 3, 1, scene, false);
            var cannonMat = new BABYLON.StandardMaterial("cannonMat", scene);
            // pink : tankMaterial.diffuseColor = new BABYLON.Vector3(0.90, 0.67, 0.93);
            // brown: tankMaterial.diffuseColor = new BABYLON.Vector3(0.27, 0.19, 0.19);
            cannonMat.diffuseColor = new BABYLON.Color3.Black;
            cannonball.material = cannonMat;

            cannonball.position = tank.position.add(BABYLON.Vector3.Zero().add(tank.frontVector.normalize().multiplyByFloats(15, 0, 15)));
            cannonball.physicsImpostor = new BABYLON.PhysicsImpostor(cannonball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 5, friction: 10, restitution: .2 }, scene);
            cannonball.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero().add(tank.frontVector.normalize().multiplyByFloats(100, 9.8, 100)));
            setTimeout(function () {
                cannonball.dispose();
            }, 2000);
            tank.power = "none";
        }
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
    if (isBPressed) {
        var cannonball = BABYLON.Mesh.CreateSphere("cannonball", 3,2, scene, false);
        var cannonMat = new BABYLON.StandardMaterial("cannonMat", scene);
        // pink : tankMaterial.diffuseColor = new BABYLON.Vector3(0.90, 0.67, 0.93);
        // brown: tankMaterial.diffuseColor = new BABYLON.Vector3(0.27, 0.19, 0.19);
        cannonMat.diffuseColor = new BABYLON.Color3.Black;
        cannonball.material = cannonMat;
        cannonball.checkCollisions = true;
        cannonball.position = tank.position.add(BABYLON.Vector3.Zero().add(tank.frontVector.normalize().multiplyByFloats(15, 0, 15)));
        cannonball.position.y += 1
        var cannonsound = new BABYLON.Sound("cannonballSound", "sound/cannonball.wav", scene);
        cannonsound.play();
        window.setTimeout(function () {
            cannonsound.stop();
        },1000);
        cannonball.physicsImpostor = new BABYLON.PhysicsImpostor(cannonball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 5, friction: 10, restitution: .2 }, scene);
        cannonball.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero().add(tank.frontVector.normalize().multiplyByFloats(350, -9.8, 350)));
        console.log("edraaaab");
        setTimeout(function () {
            cannonball.dispose();
        }, 2000);
        isBPressed = false;
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


    //optimize here
    if (!PowerUps[0].broken && tank.intersectsMesh(PowerUps[0], false)) {
        var temp0 = PowerUps[0].position;
        PowerUps[0].position = origin
        //particleSystem.emitter = PowerUps[0];
        particleSystem.start();
        tank.power = RandomPower();
        setTimeout(function () {
            particleSystem.stop();
        }, 75);
        setTimeout(function () {
            PowerUps[0].position = temp0;
        }, 2000);
    }
    if (!PowerUps[1].broken && tank.intersectsMesh(PowerUps[1], false)) {
        var temp1 = PowerUps[1].position;
        PowerUps[1].position = origin
        //particleSystem.emitter = PowerUps[0];
        particleSystem.start();
        tank.power = RandomPower();
        setTimeout(function () {
            particleSystem.stop();
        }, 75);
        setTimeout(function () {
            PowerUps[1].position = temp1;
        }, 2000);
    }
    if (!PowerUps[2].broken && tank.intersectsMesh(PowerUps[2], false)) {
        var temp2 = PowerUps[2].position;
        PowerUps[2].position = origin
        //particleSystem.emitter = PowerUps[0];
        particleSystem.start();
        tank.power = RandomPower();
        setTimeout(function () {
            particleSystem.stop();
        }, 75);
        setTimeout(function () {
            PowerUps[2].position = temp2;
        }, 2000);
    }
    if (!PowerUps[3].broken && tank.intersectsMesh(PowerUps[3], false)) {
        var temp3 = PowerUps[3].position;
        PowerUps[3].position = origin
        //particleSystem.emitter = PowerUps[0];
        particleSystem.start();
        tank.power = RandomPower();
        setTimeout(function () {
            particleSystem.stop();
        }, 75);
        setTimeout(function () {
            PowerUps[3].position = temp3;
        }, 2000);
    }
    if (!PowerUps[4].broken && tank.intersectsMesh(PowerUps[4], false)) {
        var temp4 = PowerUps[4].position;
        PowerUps[4].position = origin
        //particleSystem.emitter = PowerUps[0];
        particleSystem.start();
        tank.power = RandomPower();
        setTimeout(function () {
            particleSystem.stop();
        }, 75);
        setTimeout(function () {
            PowerUps[4].position = temp4;
        }, 2000);
    }
    if (!PowerUps[5].broken && tank.intersectsMesh(PowerUps[5], false)) {
        var temp5 = PowerUps[5].position;
        PowerUps[5].position = origin
        //particleSystem.emitter = PowerUps[0];
        particleSystem.start();
        tank.power = RandomPower();
        setTimeout(function () {
            particleSystem.stop();
        }, 75);
        setTimeout(function () {
            PowerUps[5].position = temp5;
        }, 2000);
    }
    if (!PowerUps[6].broken && tank.intersectsMesh(PowerUps[6], false)) {
        var temp6 = PowerUps[6].position;
        PowerUps[6].position = origin
        //particleSystem.emitter = PowerUps[0];
        particleSystem.start();
        tank.power = RandomPower();
        setTimeout(function () {
            particleSystem.stop();
        }, 75);
        setTimeout(function () {
            PowerUps[6].position = temp6;
        }, 2000);
    }
    if (!PowerUps[7].broken && tank.intersectsMesh(PowerUps[7], false)) {
        var temp7 = PowerUps[7].position;
        PowerUps[7].position = origin
        //particleSystem.emitter = PowerUps[0];
        particleSystem.start();
        tank.power = RandomPower();
        setTimeout(function () {
            particleSystem.stop();
        }, 75);
        setTimeout(function () {
            PowerUps[7].position = tem7;
        }, 2000);
    }


    //optimize here
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
