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
var Game = {};
Game.scenes = [];
Game.activeScene = 0;

var isWPressed = false;
var isDPressed = false;
var isSPressed = false;
var isAPressed = false;
var isEPressed = false;

var isIPressed = false;
var isLPressed = false;
var isKPressed = false;
var isJPressed = false;
var isOPressed = false;

var isSpacePressed = false;

document.addEventListener("DOMContentLoaded", startGame, false);

function startGame() {
    canvas = document.getElementById("renderCanvas");
    engine = new BABYLON.Engine(canvas, true);
    Game.ChooseScene();
    Game.createFirstScene();
    Game.createSecondScene();
    Game.createThirdScene();
    engine.runRenderLoop(function () {
        Game.scenes[Game.activeScene].renderLoop();
    });

}

Game.ChooseScene = function () {
    var scene = new BABYLON.Scene(engine);
    var ground = new BABYLON.Mesh.CreateGroundFromHeightMap("G0", "images/height1.png", 500, 500, 50, 0, 100, scene, false);
    var groundMaterial = new BABYLON.StandardMaterial("M0", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("images/OceanSequence.png", scene);
    ground.material = groundMaterial;
    ground.checkCollisions = true;

    var tank = [];
    tank[0] = createHero(new BABYLON.Color3.White, scene);
    tank[1] = createHero(new BABYLON.Color3.Black, scene);
    var light1 = new BABYLON.HemisphericLight("l1", new BABYLON.Vector3(0, 5, 0), scene);
    tank[0].position = new BABYLON.Vector3(-10, 1, 13);
    tank[0].speed /= 5;
    tank[1].position = new BABYLON.Vector3(-14, 1, 13);
    tank[1].speed /= 5;
    var followCamera2 = createFollowCamera(tank[0], scene);
    var followCamera = createFollowCamera(tank[1], scene);
    scene.activeCameras.push(followCamera);
    scene.activeCameras.push(followCamera2);
    followCamera.attachControl(canvas);
    followCamera.viewport = new BABYLON.Viewport(0, 0, 1, 0.5);
    followCamera2.viewport = new BABYLON.Viewport(0, 0.5, 1, 0.5);

    var map1 = new BABYLON.Mesh.CreateBox("map1", 8, scene);
    map1mat = new BABYLON.StandardMaterial("M1", scene);
    map1mat.diffuseTexture = new BABYLON.Texture("images/Earth.jpg", scene);
    map1.material = map1mat;
    map1.position = new BABYLON.Vector3(3, 5, 147);

    var map2 = new BABYLON.Mesh.CreateBox("map2", 8, scene);
    map2mat = new BABYLON.StandardMaterial("M2", scene);
    map2mat.diffuseTexture = new BABYLON.Texture("images/earth2.jpg", scene);
    map2.material = map2mat;
    map2.position = new BABYLON.Vector3(7, 5, -87);

    var map3 = new BABYLON.Mesh.CreateBox("map3", 8, scene);
    map3mat = new BABYLON.StandardMaterial("M3", scene);
    map3mat.diffuseTexture = new BABYLON.Texture("images/earth3.jpg", scene);
    map3.material = map3mat;
    map3.position = new BABYLON.Vector3(142, 5, 12);

    var map4 = new BABYLON.Mesh.CreateBox("map4", 8, scene);
    map4mat = new BABYLON.StandardMaterial("M4", scene);
    map4mat.diffuseTexture = new BABYLON.Texture("images/OceanSequence.png", scene);
    map4.material = map4mat;
    map4.position = new BABYLON.Vector3(-185, 5, 30);

    Game.scenes.push(scene);

    Game.scenes[0].applyPlayer1Movement = function (tank) {
        if (tank.position.y > 1)
            tank.position.y = 1;

        if (tank.position.x > map1.position.x - 5 &&
            tank.position.x < map1.position.x + 5 &&
            tank.position.z > map1.position.z - 5 &&
            tank.position.z < map1.position.z + 5
            && isEPressed)
            Game.activeScene = 1;

        if (tank.position.x > map2.position.x - 5 &&
            tank.position.x < map2.position.x + 5 &&
            tank.position.z > map2.position.z - 5 &&
            tank.position.z < map2.position.z + 5
            && isEPressed) 
            Game.activeScene = 2;
        if (tank.position.x > map3.position.x - 5 &&
            tank.position.x < map3.position.x + 5 &&
            tank.position.z > map3.position.z - 5 &&
            tank.position.z < map3.position.z + 5
            && isEPressed)
            Game.activeScene = 3;

        if (isWPressed) {
            tank.moveWithCollisions(tank.frontVector.multiplyByFloats(tank.speed, 0, tank.speed));
        }

        if (isEPressed) {
            console.log(tank.position);
        }

        if (isSPressed) {
            tank.moveWithCollisions(tank.frontVector.multiplyByFloats(-tank.speed, 0, -tank.speed));
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
    }
    Game.scenes[0].applyPlayer2Movement = function (tank) {
        if (tank.position.y > 1)
            tank.position.y = 1;

        if (tank.position.x > map1.position.x - 5 &&
            tank.position.x < map1.position.x + 5 &&
            tank.position.z > map1.position.z - 5 &&
            tank.position.z < map1.position.z + 5
            && isEPressed)
            Game.activeScene = 1;

        if (tank.position.x > map2.position.x - 5 &&
            tank.position.x < map2.position.x + 5 &&
            tank.position.z > map2.position.z - 5 &&
            tank.position.z < map2.position.z + 5
            && isEPressed)
            Game.activeScene = 2;

        if (tank.position.x > map3.position.x - 5 &&
            tank.position.x < map3.position.x + 5 &&
            tank.position.z > map3.position.z - 5 &&
            tank.position.z < map3.position.z + 5
            && isEPressed)
            Game.activeScene = 3;

        if (isIPressed) {
            tank.moveWithCollisions(tank.frontVector.multiplyByFloats(tank.speed, 0, tank.speed));
        }

        if (isOPressed) {
            console.log(tank.position);
        }

        if (isKPressed) {
            tank.moveWithCollisions(tank.frontVector.multiplyByFloats(-tank.speed, 0, -tank.speed));
        }

        if (isLPressed) {
            tank.rotation.y += 0.1 * tank.rotationSensitivity;
            tank.frontVector.x = Math.sin(tank.rotation.y) * -1;
            tank.frontVector.z = Math.cos(tank.rotation.y) * -1;
        }

        if (isJPressed) {
            tank.rotation.y -= 0.1 * tank.rotationSensitivity;
            tank.frontVector.x = Math.sin(tank.rotation.y) * -1;
            tank.frontVector.z = Math.cos(tank.rotation.y) * -1;
        }
    }
    Game.scenes[0].renderLoop = function () {
        this.applyPlayer1Movement(tank[0]);
        this.applyPlayer2Movement(tank[1]);
        this.render();
    }
    return scene;
}

Game.createFirstScene = function () {
    var scene = new BABYLON.Scene(engine);
    scene.enablePhysics(new BABYLON.Vector3(0, 0, 0), new BABYLON.CannonJSPlugin());
    var ground = createGround("images/Untitled2.png", "images/Earth.jpg", scene);
    var light1 = new BABYLON.HemisphericLight("l1", new BABYLON.Vector3(0, 5, 0), scene);
    var tank = [];
    tank[0] = createHero(new BABYLON.Color3.White, scene);
    tank[1] = createHero(new BABYLON.Color3.Black, scene);
    var finish = createFinishLine(scene,0);
    var PowerUps = [];
    var Goo = [];
    var madafe3 = [];

    //var startMusic = new BABYLON.Sound("racestart", "sounds/Mario Kart Race Start.mp3", scene, null, { loop: false, autoplay: true });
    //var raceMusic = new BABYLON.Sound("racemusic", "sounds/Luigi Circuit & Mario Circuit.mp3", scene, null, { loop: false, autoplay: true });
    //raceMusic.play();
    //startMusic.play();
    
    PowerUps = createPowerups(scene,0);
    var skybox = createSkybox("textures/sky/sky",scene);
    tank[0].position = new BABYLON.Vector3(627, 1, 430);
    tank[1].position = new BABYLON.Vector3(632, 1, 430);
    var followCamera2 = createFollowCamera(tank[0], scene);
    var followCamera = createFollowCamera(tank[1], scene);
    scene.activeCameras.push(followCamera);
    scene.activeCameras.push(followCamera2);
    followCamera.attachControl(canvas);
    followCamera.viewport = new BABYLON.Viewport(0, 0, 1, 0.5);
    followCamera2.viewport = new BABYLON.Viewport(0, 0.5, 1, 0.5);

    Game.scenes.push(scene);

    Game.scenes[1].touchGoo = function (tank) {
        var sz = Goo.length;
        for (var i = 0; i < sz; i++) {
            if (tank.intersectsMesh(Goo[i], false)) {
                var splaat = new BABYLON.Sound("can", "sounds/Cartoon Slip.mp3", scene, null, { loop: false, autoplay: true });
                splaat.play();
                tank.rotationSensitivity *= 5;
                Goo[i].dispose();
                Goo.splice(i);
                setTimeout(function () {
                    tank.rotationSensitivity /= 5;
                }, 4000);
                break;
            }
        }

    }

    Game.scenes[1].touchCannon = function (tank) {
        var sz = madafe3.length;
        for (var i = 0; i < sz; i++) {
            if (tank.intersectsMesh(madafe3[i], false)) {
                var boom = new BABYLON.Sound("can", "sounds/Punch.mp3", scene, null, { loop: false, autoplay: true });
                boom.play();
                tank.speed /= 5;
                madafe3[i].dispose();
                madafe3.splice(i);
                setTimeout(function () {
                    tank.speed *= 5;
                }, 4000);
                break;
            }
        }

    }

    Game.scenes[1].applyPlayer1Movement = function (tank, PowerUps, finish) {
        if (tank.position.y > 1)
            tank.position.y = 1;

        if (tank.position.x >= -876 && tank.position.x <= -575 && tank.position.z >= -126 && tank.position.z <= -122) {
            tank.passedCheckpoint = true;
        }

        if (tank.passedCheckpoint && tank.intersectsMesh(finish, true)) {
            tank.laps++;
            tank.passedCheckpoint = false;
        }

        if (tank.position.x > PowerUps[0].position.x - 5.5 &&
            tank.position.x < PowerUps[0].position.x + 5.5 &&
            tank.position.z > PowerUps[0].position.z - 5.5 &&
            tank.position.z < PowerUps[0].position.z + 5.5)
        {
            tank.particleSystem.start();
            var temp0 = PowerUps[0].position;
            PowerUps[0].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[0].position = temp0;
            }, 2000);
        }

        if (tank.position.x > PowerUps[1].position.x - 5.5 &&
            tank.position.x < PowerUps[1].position.x + 5.5 &&
            tank.position.z > PowerUps[1].position.z - 5.5 &&
            tank.position.z < PowerUps[1].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[1].position;
            PowerUps[1].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[1].position = temp0;
            }, 2000);
        }

        if (tank.position.x > PowerUps[2].position.x - 5.5 &&
            tank.position.x < PowerUps[2].position.x + 5.5 &&
            tank.position.z > PowerUps[2].position.z - 5.5 &&
            tank.position.z < PowerUps[2].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[2].position;
            PowerUps[2].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[2].position = temp0;
            }, 2000);
        }
        
        if (tank.position.x > PowerUps[3].position.x - 5.5 &&
            tank.position.x < PowerUps[3].position.x + 5.5 &&
            tank.position.z > PowerUps[3].position.z - 5.5 &&
            tank.position.z < PowerUps[3].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[3].position;
            PowerUps[3].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[3].position = temp0;
            }, 2000);
        }

        if (tank.position.x > PowerUps[4].position.x - 5.5 &&
            tank.position.x < PowerUps[4].position.x + 5.5 &&
            tank.position.z > PowerUps[4].position.z - 5.5 &&
            tank.position.z < PowerUps[4].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[4].position;
            PowerUps[4].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[4].position = temp0;
            }, 2000);
        }

        if (tank.position.x > PowerUps[5].position.x - 5.5 &&
            tank.position.x < PowerUps[5].position.x + 5.5 &&
            tank.position.z > PowerUps[5].position.z - 5.5 &&
            tank.position.z < PowerUps[5].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[5].position;
            PowerUps[5].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[5].position = temp0;
            }, 2000);
        }

        if (tank.position.x > PowerUps[6].position.x - 5.5 &&
            tank.position.x < PowerUps[6].position.x + 5.5 &&
            tank.position.z > PowerUps[6].position.z - 5.5 &&
            tank.position.z < PowerUps[6].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[6].position;
            PowerUps[6].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[6].position = temp0;
            }, 2000);
        }

        if (tank.position.x > PowerUps[7].position.x - 5.5 &&
            tank.position.x < PowerUps[7].position.x + 5.5 &&
            tank.position.z > PowerUps[7].position.z - 5.5 &&
            tank.position.z < PowerUps[7].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[7].position;
            PowerUps[7].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[7].position = temp0;
            }, 2000);
        }

        if (isWPressed) {
            tank.moveWithCollisions(tank.frontVector.multiplyByFloats(tank.speed, 0, tank.speed));
        }

        if (isSPressed) {
            tank.moveWithCollisions(tank.frontVector.multiplyByFloats(-tank.speed, 0, -tank.speed));
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

        if (isEPressed) {
            console.log(tank.position);
            console.log(tank.laps);
            console.log(tank.passedCheckpoint);
            console.log(tank.power);
            console.log(Goo.length);
            console.log(madafe3.length);
            if (tank.power === "CannonBall") {
                var cannonball = BABYLON.Mesh.CreateSphere("cannonball", 3,20, scene, false);
                var cannonMat = new BABYLON.StandardMaterial("cannonMat", scene);
                cannonMat.diffuseColor = new BABYLON.Color3.Black;
                cannonball.material = cannonMat;

                var cannonsound = new BABYLON.Sound("can", "sounds/Cannon.wav", scene, null, { loop: false, autoplay: true });
                cannonsound.play();

                cannonball.position = tank.position.add(BABYLON.Vector3.Zero().add(tank.frontVector.normalize().multiplyByFloats(20, 0, 20)));
                cannonball.position.y += 5;

                cannonball.physicsImpostor = new BABYLON.PhysicsImpostor(cannonball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 5, friction: 10, restitution: .2 }, scene);
                cannonball.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero().add(tank.frontVector.normalize().multiplyByFloats(200, 0, 200)));
                madafe3.push(cannonball);
                setTimeout(function () {
                    madafe3.splice(cannonball);
                    cannonball.dispose();
                }, 2000);
                tank.power = "none";
            }
            else if (tank.power === "SpeedBuff") {
                var speedsound = new BABYLON.Sound("can", "sounds/Item Box Sound3.mp3", scene, null, { loop: false, autoplay: true });
                speedsound.play();
                tank.speed *= 1.5;
                tank.power = "none";
                var color = tank.material.diffuseColor;
                var ani = scene.beginAnimation(tank, 0, 180, true);
                setTimeout(function () {
                    tank.speed /= 1.5;
                    speedsound.stop();
                    ani.stop();
                    tank.material.diffuseColor = color;
                }, 3000);
            }
            else if (tank.power === "SpeedNerf") {
                tank.speed /= 1.5;
                tank.power = "none";
                var slowsound = new BABYLON.Sound("can", "sounds/Sitcom Laughter Applause2.mp3", scene, null, { loop: false, autoplay: true });
                slowsound.play();
                setTimeout(function () {
                    tank.speed *= 1.5;
                    slowsound.stop();
                }, 3000);
            }
            else if (tank.power === "GooStain") {
                var splaat = new BABYLON.Sound("can", "sounds/Splat.mp3", scene, null, { loop: false, autoplay: true });
                splaat.play();
                var goo = new BABYLON.Mesh.CreateBox("boxsss", 20, scene);
                goo.position = tank.position.add(BABYLON.Vector3.Zero().add(tank.frontVector.normalize().multiplyByFloats(-50, 0, -50)));
                goo.position.y = -9;
                goo.material = new BABYLON.StandardMaterial("target", scene);
                goo.material.diffuseTexture = new BABYLON.Texture("images/goo.png", scene);
                goo.material.diffuseTexture.hasAlpha = true;
                Goo.push(goo);
                tank.power = "none";
            }
        }

        
    }
    Game.scenes[1].applyPlayer2Movement = function (tank, PowerUps, finish) {
        if (tank.position.y > 1)
            tank.position.y = 1;

        if (tank.position.x >= -876 && tank.position.x <= -575 && tank.position.z >= -126 && tank.position.z <= -122) {
            tank.passedCheckpoint = true;
        }

        if (tank.passedCheckpoint && tank.intersectsMesh(finish, true)) {
            tank.laps++;
            tank.passedCheckpoint = false;
        }

        if (tank.position.x > PowerUps[0].position.x - 5.5 &&
            tank.position.x < PowerUps[0].position.x + 5.5 &&
            tank.position.z > PowerUps[0].position.z - 5.5 &&
            tank.position.z < PowerUps[0].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[0].position;
            PowerUps[0].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[0].position = temp0;
            }, 2000);
        }

        if (tank.position.x > PowerUps[1].position.x - 5.5 &&
            tank.position.x < PowerUps[1].position.x + 5.5 &&
            tank.position.z > PowerUps[1].position.z - 5.5 &&
            tank.position.z < PowerUps[1].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[1].position;
            PowerUps[1].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[1].position = temp0;
            }, 2000);
        }

        if (tank.position.x > PowerUps[2].position.x - 5.5 &&
            tank.position.x < PowerUps[2].position.x + 5.5 &&
            tank.position.z > PowerUps[2].position.z - 5.5 &&
            tank.position.z < PowerUps[2].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[2].position;
            PowerUps[2].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[2].position = temp0;
            }, 2000);
        }

        if (tank.position.x > PowerUps[3].position.x - 5.5 &&
            tank.position.x < PowerUps[3].position.x + 5.5 &&
            tank.position.z > PowerUps[3].position.z - 5.5 &&
            tank.position.z < PowerUps[3].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[3].position;
            PowerUps[3].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[3].position = temp0;
            }, 2000);
        }

        if (tank.position.x > PowerUps[4].position.x - 5.5 &&
            tank.position.x < PowerUps[4].position.x + 5.5 &&
            tank.position.z > PowerUps[4].position.z - 5.5 &&
            tank.position.z < PowerUps[4].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[4].position;
            PowerUps[4].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[4].position = temp0;
            }, 2000);
        }

        if (tank.position.x > PowerUps[5].position.x - 5.5 &&
            tank.position.x < PowerUps[5].position.x + 5.5 &&
            tank.position.z > PowerUps[5].position.z - 5.5 &&
            tank.position.z < PowerUps[5].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[5].position;
            PowerUps[5].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[5].position = temp0;
            }, 2000);
        }

        if (tank.position.x > PowerUps[6].position.x - 5.5 &&
            tank.position.x < PowerUps[6].position.x + 5.5 &&
            tank.position.z > PowerUps[6].position.z - 5.5 &&
            tank.position.z < PowerUps[6].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[6].position;
            PowerUps[6].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[6].position = temp0;
            }, 2000);
        }

        if (tank.position.x > PowerUps[7].position.x - 5.5 &&
            tank.position.x < PowerUps[7].position.x + 5.5 &&
            tank.position.z > PowerUps[7].position.z - 5.5 &&
            tank.position.z < PowerUps[7].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[7].position;
            PowerUps[7].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[7].position = temp0;
            }, 2000);
        }

        if (isIPressed) {
            tank.moveWithCollisions(tank.frontVector.multiplyByFloats(tank.speed, 0, tank.speed));
        }

        if (isKPressed) {
            tank.moveWithCollisions(tank.frontVector.multiplyByFloats(-tank.speed, 0, -tank.speed));
        }

        if (isLPressed) {
            tank.rotation.y += 0.1 * tank.rotationSensitivity;
            tank.frontVector.x = Math.sin(tank.rotation.y) * -1;
            tank.frontVector.z = Math.cos(tank.rotation.y) * -1;
        }

        if (isJPressed) {
            tank.rotation.y -= 0.1 * tank.rotationSensitivity;
            tank.frontVector.x = Math.sin(tank.rotation.y) * -1;
            tank.frontVector.z = Math.cos(tank.rotation.y) * -1;
        }

        if (isOPressed) {
            console.log(tank.position);
            console.log(tank.laps);
            console.log(tank.passedCheckpoint);
            console.log(tank.power);
            console.log(Goo.length);
            console.log(madafe3.length);
            if (tank.power === "CannonBall") {
                var cannonball = BABYLON.Mesh.CreateSphere("cannonball", 3, 20, scene, false);
                var cannonMat = new BABYLON.StandardMaterial("cannonMat", scene);
                cannonMat.diffuseColor = new BABYLON.Color3.Black;
                cannonball.material = cannonMat;

                var cannonsound = new BABYLON.Sound("can", "sounds/Cannon.wav", scene, null, { loop: false, autoplay: true });
                cannonsound.play();
                setTimeout(function () {
                    cannonsound.stop();
                }, 1000);

                cannonball.position = tank.position.add(BABYLON.Vector3.Zero().add(tank.frontVector.normalize().multiplyByFloats(20, 0, 20)));
                cannonball.position.y += 5;

                cannonball.physicsImpostor = new BABYLON.PhysicsImpostor(cannonball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 5, friction: 10, restitution: .2 }, scene);
                cannonball.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero().add(tank.frontVector.normalize().multiplyByFloats(200, 0, 200)));
                madafe3.push(cannonball);
                setTimeout(function () {
                    madafe3.splice(cannonball);
                    cannonball.dispose();
                }, 2000);
                tank.power = "none";
            }
            else if (tank.power === "SpeedBuff") {
                var speedsound = new BABYLON.Sound("can", "sounds/Item Box Sound3.mp3", scene, null, { loop: false, autoplay: true });
                speedsound.play();
                tank.speed *= 1.5;
                tank.power = "none";
                var color = tank.material.diffuseColor;
                var ani = scene.beginAnimation(tank, 0, 180, true);
                setTimeout(function () {
                    tank.speed /= 1.5;
                    speedsound.stop();
                    ani.stop();
                    tank.material.diffuseColor = color;
                }, 3000);
            }
            else if (tank.power === "SpeedNerf") {
                tank.speed /= 1.5;
                tank.power = "none";
                var slowsound = new BABYLON.Sound("can", "sounds/Sitcom Laughter Applause2.mp3", scene, null, { loop: false, autoplay: true });
                slowsound.play();
                setTimeout(function () {
                    tank.speed *= 1.5;
                    slowsound.stop();
                }, 3000);
            }
            else if (tank.power === "GooStain") {
                var splaat = new BABYLON.Sound("can", "sounds/Splat.mp3", scene, null, { loop: false, autoplay: true });
                splaat.play();
                var goo = new BABYLON.Mesh.CreateBox("boxsss", 20, scene);
                goo.position = tank.position.add(BABYLON.Vector3.Zero().add(tank.frontVector.normalize().multiplyByFloats(-50, 0, -50)));
                goo.position.y = -9;
                goo.material = new BABYLON.StandardMaterial("target", scene);
                goo.material.diffuseTexture = new BABYLON.Texture("images/goo.png", scene);
                goo.material.diffuseTexture.hasAlpha = true;
                Goo.push(goo);
                tank.power = "none";
            }
        }

        
    }
    Game.scenes[1].renderLoop = function () {
        this.applyPlayer1Movement(tank[0], PowerUps, finish);
        this.applyPlayer2Movement(tank[1], PowerUps, finish);
        this.touchGoo(tank[0]);
        this.touchGoo(tank[1]);
        this.touchCannon(tank[0]);
        this.touchCannon(tank[1]);
        this.render();
    }
    return scene;
}

Game.createSecondScene = function () {
    var scene = new BABYLON.Scene(engine);
    scene.enablePhysics(new BABYLON.Vector3(0, 0, 0), new BABYLON.CannonJSPlugin());
    var ground = createGround("images/Track1.png", "images/earth2.jpg", scene);
    var light1 = new BABYLON.HemisphericLight("l1", new BABYLON.Vector3(0, 5, 0), scene);
    var tank = [];
    var tank = [];
    tank[0] = createHero(new BABYLON.Color3.White, scene);
    tank[1] = createHero(new BABYLON.Color3.Black, scene);
    var PowerUps = [];
    var Goo = [];
    var madafe3 = [];
    var finish = createFinishLine(scene,1);
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP;

    scene.fogColor = new BABYLON.Color3(0.9, 0.9, 0.85);
    scene.fogDensity = 0.003;
    PowerUps = createPowerups(scene,1);
    var skybox = createSkybox("textures/sky/sky",scene);
    tank[0].position = new BABYLON.Vector3(831, 1, 41);
    tank[1].position = new BABYLON.Vector3(835, 1, 41);
    //var freeCamera = createFreeCamera(scene);
    var followCamera2 = createFollowCamera(tank[0], scene);
    var followCamera = createFollowCamera(tank[1], scene);
    scene.activeCameras.push(followCamera);
    scene.activeCameras.push(followCamera2);
    followCamera.attachControl(canvas);
    followCamera.viewport = new BABYLON.Viewport(0, 0, 1, 0.5);
    followCamera2.viewport = new BABYLON.Viewport(0, 0.5, 1, 0.5);

    Game.scenes.push(scene);

    Game.scenes[2].touchGoo = function (tank) {
        var sz = Goo.length;
        for (var i = 0; i < sz; i++) {
            if (tank.intersectsMesh(Goo[i], false)) {
                var splaat = new BABYLON.Sound("can", "sounds/Cartoon Slip.mp3", scene, null, { loop: false, autoplay: true });
                splaat.play();
                tank.rotationSensitivity *= 5;
                Goo[i].dispose();
                Goo.splice(i);
                setTimeout(function () {
                    tank.rotationSensitivity /= 5;
                }, 4000);
                break;
            }
        }

    }

    Game.scenes[2].touchCannon = function (tank) {
        var sz = madafe3.length;
        for (var i = 0; i < sz; i++) {
            if (tank.intersectsMesh(madafe3[i], false)) {
                var boom = new BABYLON.Sound("can", "sounds/Punch.mp3", scene, null, { loop: false, autoplay: true });
                boom.play();
                tank.speed /= 5;
                madafe3[i].dispose();
                madafe3.splice(i);
                setTimeout(function () {
                    tank.speed *= 5;
                }, 4000);
                break;
            }
        }

    }

    Game.scenes[2].applyPlayer1Movement = function (tank, PowerUps, finish) {
        if (tank.position.y > 1)
            tank.position.y = 1;

        if (tank.position.x >= -876 && tank.position.x <= -575 && tank.position.z >= -126 && tank.position.z <= -122) {
            tank.passedCheckpoint = true;
        }

        if (tank.passedCheckpoint && tank.intersectsMesh(finish, true)) {
            tank.laps++;
            tank.passedCheckpoint = false;
        }

        if (tank.position.x > PowerUps[0].position.x - 5.5 &&
            tank.position.x < PowerUps[0].position.x + 5.5 &&
            tank.position.z > PowerUps[0].position.z - 5.5 &&
            tank.position.z < PowerUps[0].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[0].position;
            PowerUps[0].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[0].position = temp0;
            }, 2000);
        }

        if (tank.position.x > PowerUps[1].position.x - 5.5 &&
            tank.position.x < PowerUps[1].position.x + 5.5 &&
            tank.position.z > PowerUps[1].position.z - 5.5 &&
            tank.position.z < PowerUps[1].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[1].position;
            PowerUps[1].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[1].position = temp0;
            }, 2000);
        }

        if (tank.position.x > PowerUps[2].position.x - 5.5 &&
            tank.position.x < PowerUps[2].position.x + 5.5 &&
            tank.position.z > PowerUps[2].position.z - 5.5 &&
            tank.position.z < PowerUps[2].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[2].position;
            PowerUps[2].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[2].position = temp0;
            }, 2000);
        }

        if (tank.position.x > PowerUps[3].position.x - 5.5 &&
            tank.position.x < PowerUps[3].position.x + 5.5 &&
            tank.position.z > PowerUps[3].position.z - 5.5 &&
            tank.position.z < PowerUps[3].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[3].position;
            PowerUps[3].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[3].position = temp0;
            }, 2000);
        }

        if (tank.position.x > PowerUps[4].position.x - 5.5 &&
            tank.position.x < PowerUps[4].position.x + 5.5 &&
            tank.position.z > PowerUps[4].position.z - 5.5 &&
            tank.position.z < PowerUps[4].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[4].position;
            PowerUps[4].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[4].position = temp0;
            }, 2000);
        }

        if (tank.position.x > PowerUps[5].position.x - 5.5 &&
            tank.position.x < PowerUps[5].position.x + 5.5 &&
            tank.position.z > PowerUps[5].position.z - 5.5 &&
            tank.position.z < PowerUps[5].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[5].position;
            PowerUps[5].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[5].position = temp0;
            }, 2000);
        }

        if (tank.position.x > PowerUps[6].position.x - 5.5 &&
            tank.position.x < PowerUps[6].position.x + 5.5 &&
            tank.position.z > PowerUps[6].position.z - 5.5 &&
            tank.position.z < PowerUps[6].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[6].position;
            PowerUps[6].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[6].position = temp0;
            }, 2000);
        }

        if (tank.position.x > PowerUps[7].position.x - 5.5 &&
            tank.position.x < PowerUps[7].position.x + 5.5 &&
            tank.position.z > PowerUps[7].position.z - 5.5 &&
            tank.position.z < PowerUps[7].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[7].position;
            PowerUps[7].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[7].position = temp0;
            }, 2000);
        }

        if (isWPressed) {
            tank.moveWithCollisions(tank.frontVector.multiplyByFloats(tank.speed, 0, tank.speed));
        }

        if (isSPressed) {
            tank.moveWithCollisions(tank.frontVector.multiplyByFloats(-tank.speed, 0, -tank.speed));
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

        if (isEPressed) {
            console.log(tank.position);
            console.log(tank.laps);
            console.log(tank.passedCheckpoint);
            console.log(tank.power);
            console.log(Goo.length);
            console.log(madafe3.length);
            if (tank.power === "CannonBall") {
                var cannonball = BABYLON.Mesh.CreateSphere("cannonball", 3, 20, scene, false);
                var cannonMat = new BABYLON.StandardMaterial("cannonMat", scene);
                cannonMat.diffuseColor = new BABYLON.Color3.Black;
                cannonball.material = cannonMat;

                var cannonsound = new BABYLON.Sound("can", "sounds/Cannon.wav", scene, null, { loop: false, autoplay: true });
                cannonsound.play();

                cannonball.position = tank.position.add(BABYLON.Vector3.Zero().add(tank.frontVector.normalize().multiplyByFloats(20, 0, 20)));
                cannonball.position.y += 5;

                cannonball.physicsImpostor = new BABYLON.PhysicsImpostor(cannonball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 5, friction: 10, restitution: .2 }, scene);
                cannonball.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero().add(tank.frontVector.normalize().multiplyByFloats(200, 0, 200)));
                madafe3.push(cannonball);
                setTimeout(function () {
                    madafe3.splice(cannonball);
                    cannonball.dispose();
                }, 2000);
                tank.power = "none";
            }
            else if (tank.power === "SpeedBuff") {
                var speedsound = new BABYLON.Sound("can", "sounds/Item Box Sound3.mp3", scene, null, { loop: false, autoplay: true });
                speedsound.play();
                tank.speed *= 1.5;
                tank.power = "none";
                var color = tank.material.diffuseColor;
                var ani = scene.beginAnimation(tank, 0, 180, true);
                setTimeout(function () {
                    tank.speed /= 1.5;
                    speedsound.stop();
                    ani.stop();
                    tank.material.diffuseColor = color;
                }, 3000);
            }
            else if (tank.power === "SpeedNerf") {
                tank.speed /= 1.5;
                tank.power = "none";
                var slowsound = new BABYLON.Sound("can", "sounds/Sitcom Laughter Applause2.mp3", scene, null, { loop: false, autoplay: true });
                slowsound.play();
                setTimeout(function () {
                    tank.speed *= 1.5;
                    slowsound.stop();
                }, 3000);
            }
            else if (tank.power === "GooStain") {
                var splaat = new BABYLON.Sound("can", "sounds/Splat.mp3", scene, null, { loop: false, autoplay: true });
                splaat.play();
                var goo = new BABYLON.Mesh.CreateBox("boxsss", 20, scene);
                goo.position = tank.position.add(BABYLON.Vector3.Zero().add(tank.frontVector.normalize().multiplyByFloats(-50, 0, -50)));
                goo.position.y = -9;
                goo.material = new BABYLON.StandardMaterial("target", scene);
                goo.material.diffuseTexture = new BABYLON.Texture("images/goo.png", scene);
                goo.material.diffuseTexture.hasAlpha = true;
                Goo.push(goo);
                tank.power = "none";
            }
        }

        
    }
    Game.scenes[2].applyPlayer2Movement = function (tank, PowerUps, finish) {
        if (tank.position.y > 1)
            tank.position.y = 1;

        if (tank.position.x >= -876 && tank.position.x <= -575 && tank.position.z >= -126 && tank.position.z <= -122) {
            tank.passedCheckpoint = true;
        }

        if (tank.passedCheckpoint && tank.intersectsMesh(finish, true)) {
            tank.laps++;
            tank.passedCheckpoint = false;
        }

        if (tank.position.x > PowerUps[0].position.x - 5.5 &&
            tank.position.x < PowerUps[0].position.x + 5.5 &&
            tank.position.z > PowerUps[0].position.z - 5.5 &&
            tank.position.z < PowerUps[0].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[0].position;
            PowerUps[0].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[0].position = temp0;
            }, 2000);
        }

        if (tank.position.x > PowerUps[1].position.x - 5.5 &&
            tank.position.x < PowerUps[1].position.x + 5.5 &&
            tank.position.z > PowerUps[1].position.z - 5.5 &&
            tank.position.z < PowerUps[1].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[1].position;
            PowerUps[1].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[1].position = temp0;
            }, 2000);
        }

        if (tank.position.x > PowerUps[2].position.x - 5.5 &&
            tank.position.x < PowerUps[2].position.x + 5.5 &&
            tank.position.z > PowerUps[2].position.z - 5.5 &&
            tank.position.z < PowerUps[2].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[2].position;
            PowerUps[2].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[2].position = temp0;
            }, 2000);
        }

        if (tank.position.x > PowerUps[3].position.x - 5.5 &&
            tank.position.x < PowerUps[3].position.x + 5.5 &&
            tank.position.z > PowerUps[3].position.z - 5.5 &&
            tank.position.z < PowerUps[3].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[3].position;
            PowerUps[3].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[3].position = temp0;
            }, 2000);
        }

        if (tank.position.x > PowerUps[4].position.x - 5.5 &&
            tank.position.x < PowerUps[4].position.x + 5.5 &&
            tank.position.z > PowerUps[4].position.z - 5.5 &&
            tank.position.z < PowerUps[4].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[4].position;
            PowerUps[4].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[4].position = temp0;
            }, 2000);
        }

        if (tank.position.x > PowerUps[5].position.x - 5.5 &&
            tank.position.x < PowerUps[5].position.x + 5.5 &&
            tank.position.z > PowerUps[5].position.z - 5.5 &&
            tank.position.z < PowerUps[5].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[5].position;
            PowerUps[5].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[5].position = temp0;
            }, 2000);
        }

        if (tank.position.x > PowerUps[6].position.x - 5.5 &&
            tank.position.x < PowerUps[6].position.x + 5.5 &&
            tank.position.z > PowerUps[6].position.z - 5.5 &&
            tank.position.z < PowerUps[6].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[6].position;
            PowerUps[6].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[6].position = temp0;
            }, 2000);
        }

        if (tank.position.x > PowerUps[7].position.x - 5.5 &&
            tank.position.x < PowerUps[7].position.x + 5.5 &&
            tank.position.z > PowerUps[7].position.z - 5.5 &&
            tank.position.z < PowerUps[7].position.z + 5.5) {
            tank.particleSystem.start();
            var temp0 = PowerUps[7].position;
            PowerUps[7].position = BABYLON.Vector3.Zero();

            var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
            glass.play();

            tank.power = RandomPower(tank);

            setTimeout(function () {
                tank.particleSystem.stop();
            }, 75);

            setTimeout(function () {
                PowerUps[7].position = temp0;
            }, 2000);
        }

        if (isIPressed) {
            tank.moveWithCollisions(tank.frontVector.multiplyByFloats(tank.speed, 0, tank.speed));
        }

        if (isKPressed) {
            tank.moveWithCollisions(tank.frontVector.multiplyByFloats(-tank.speed, 0, -tank.speed));
        }

        if (isLPressed) {
            tank.rotation.y += 0.1 * tank.rotationSensitivity;
            tank.frontVector.x = Math.sin(tank.rotation.y) * -1;
            tank.frontVector.z = Math.cos(tank.rotation.y) * -1;
        }

        if (isJPressed) {
            tank.rotation.y -= 0.1 * tank.rotationSensitivity;
            tank.frontVector.x = Math.sin(tank.rotation.y) * -1;
            tank.frontVector.z = Math.cos(tank.rotation.y) * -1;
        }

        if (isOPressed) {
            console.log(tank.position);
            console.log(tank.laps);
            console.log(tank.passedCheckpoint);
            console.log(tank.power);
            console.log(Goo.length);
            console.log(madafe3.length);
            if (tank.power === "CannonBall") {
                var cannonball = BABYLON.Mesh.CreateSphere("cannonball", 3, 20, scene, false);
                var cannonMat = new BABYLON.StandardMaterial("cannonMat", scene);
                cannonMat.diffuseColor = new BABYLON.Color3.Black;
                cannonball.material = cannonMat;

                var cannonsound = new BABYLON.Sound("can", "sounds/Cannon.wav", scene, null, { loop: false, autoplay: true });
                cannonsound.play();
                setTimeout(function () {
                    cannonsound.stop();
                }, 1000);

                cannonball.position = tank.position.add(BABYLON.Vector3.Zero().add(tank.frontVector.normalize().multiplyByFloats(20, 0, 20)));
                cannonball.position.y += 5;

                cannonball.physicsImpostor = new BABYLON.PhysicsImpostor(cannonball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 5, friction: 10, restitution: .2 }, scene);
                cannonball.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero().add(tank.frontVector.normalize().multiplyByFloats(200, 0, 200)));
                madafe3.push(cannonball);
                setTimeout(function () {
                    madafe3.splice(cannonball);
                    cannonball.dispose();
                }, 2000);
                tank.power = "none";
            }
            else if (tank.power === "SpeedBuff") {
                var speedsound = new BABYLON.Sound("can", "sounds/Item Box Sound3.mp3", scene, null, { loop: false, autoplay: true });
                speedsound.play();
                tank.speed *= 1.5;
                tank.power = "none";
                var color = tank.material.diffuseColor;
                var ani = scene.beginAnimation(tank, 0, 180, true);
                setTimeout(function () {
                    tank.speed /= 1.5;
                    speedsound.stop();
                    ani.stop();
                    tank.material.diffuseColor = color;
                }, 3000);
            }
            else if (tank.power === "SpeedNerf") {
                tank.speed /= 1.5;
                tank.power = "none";
                var slowsound = new BABYLON.Sound("can", "sounds/Sitcom Laughter Applause2.mp3", scene, null, { loop: false, autoplay: true });
                slowsound.play();
                setTimeout(function () {
                    tank.speed *= 1.5;
                    slowsound.stop();
                }, 3000);
            }
            else if (tank.power === "GooStain") {
                var splaat = new BABYLON.Sound("can", "sounds/Splat.mp3", scene, null, { loop: false, autoplay: true });
                splaat.play();
                var goo = new BABYLON.Mesh.CreateBox("boxsss", 20, scene);
                goo.position = tank.position.add(BABYLON.Vector3.Zero().add(tank.frontVector.normalize().multiplyByFloats(-50, 0, -50)));
                goo.position.y = -9;
                goo.material = new BABYLON.StandardMaterial("target", scene);
                goo.material.diffuseTexture = new BABYLON.Texture("images/goo.png", scene);
                goo.material.diffuseTexture.hasAlpha = true;
                Goo.push(goo);
                tank.power = "none";
            }
        }

       
    }
    Game.scenes[2].renderLoop = function () {
        this.applyPlayer1Movement(tank[0], PowerUps, finish);
        this.applyPlayer2Movement(tank[1], PowerUps, finish);
        this.touchGoo(tank[0]);
        this.touchGoo(tank[1]);
        this.touchCannon(tank[0]);
        this.touchCannon(tank[1]);
        this.render();
    }
    return scene;
}

Game.createThirdScene = function () {
    {
        var scene = new BABYLON.Scene(engine);
        scene.enablePhysics(new BABYLON.Vector3(0, 0, 0), new BABYLON.CannonJSPlugin());
        var ground = createGround("images/Track2.png", "images/earth3.jpg", scene);
        var light1 = new BABYLON.HemisphericLight("l1", new BABYLON.Vector3(0, 5, 0), scene);
        var tank = [];
        tank[0] = createHero(new BABYLON.Color3.White, scene);
        tank[1] = createHero(new BABYLON.Color3.Black, scene);
        var PowerUps = [];
        var Goo = [];
        var madafe3 = [];
        var finish = createFinishLine(scene, 2);
        tank[0].position = new BABYLON.Vector3(141, 1, 806);
        tank[1].position = new BABYLON.Vector3(145, 1, 806);

        PowerUps = createPowerups(scene, 2);
        var skybox = createSkybox("textures/sky36/sky36",scene);
        var followCamera2 = createFollowCamera(tank[0], scene);
        var followCamera = createFollowCamera(tank[1], scene);
        scene.activeCameras.push(followCamera);
        scene.activeCameras.push(followCamera2);
        followCamera.attachControl(canvas);
        followCamera.viewport = new BABYLON.Viewport(0, 0, 1, 0.5);
        followCamera2.viewport = new BABYLON.Viewport(0, 0.5, 1, 0.5);

        Game.scenes.push(scene);

        Game.scenes[3].touchGoo = function (tank) {
            var sz = Goo.length;
            for (var i = 0; i < sz; i++) {
                if (tank.intersectsMesh(Goo[i], false)) {
                    var splaat = new BABYLON.Sound("can", "sounds/Cartoon Slip.mp3", scene, null, { loop: false, autoplay: true });
                    splaat.play();
                    tank.rotationSensitivity *= 5;
                    Goo[i].dispose();
                    Goo.splice(i);
                    setTimeout(function () {
                        tank.rotationSensitivity /= 5;
                    }, 4000);
                    break;
                }
            }

        }

        Game.scenes[3].touchCannon = function (tank) {
            var sz = madafe3.length;
            for (var i = 0; i < sz; i++) {
                if (tank.intersectsMesh(madafe3[i], false)) {
                    var boom = new BABYLON.Sound("can", "sounds/Punch.mp3", scene, null, { loop: false, autoplay: true });
                    boom.play();
                    tank.speed /= 5;
                    madafe3[i].dispose();
                    madafe3.splice(i);
                    setTimeout(function () {
                        tank.speed *= 5;
                    }, 4000);
                    break;
                }
            }

        }

        Game.scenes[3].applyPlayer1Movement = function (tank, PowerUps, finish) {
            if (tank.position.y > 1)
                tank.position.y = 1;

            if (tank.position.x >= 224 && tank.position.x <= 243 && tank.position.z >= -837 && tank.position.z <= -642) {
                tank.passedCheckpoint = true;
            }

            if (tank.passedCheckpoint && tank.intersectsMesh(finish, true)) {
                tank.laps++;
                tank.passedCheckpoint = false;
            }

            if (tank.position.x > PowerUps[0].position.x - 5.5 &&
                tank.position.x < PowerUps[0].position.x + 5.5 &&
                tank.position.z > PowerUps[0].position.z - 5.5 &&
                tank.position.z < PowerUps[0].position.z + 5.5) {
                tank.particleSystem.start();
                var temp0 = PowerUps[0].position;
                PowerUps[0].position = BABYLON.Vector3.Zero();

                var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
                glass.play();

                tank.power = RandomPower(tank);

                setTimeout(function () {
                    tank.particleSystem.stop();
                }, 75);

                setTimeout(function () {
                    PowerUps[0].position = temp0;
                }, 2000);
            }

            if (tank.position.x > PowerUps[1].position.x - 5.5 &&
                tank.position.x < PowerUps[1].position.x + 5.5 &&
                tank.position.z > PowerUps[1].position.z - 5.5 &&
                tank.position.z < PowerUps[1].position.z + 5.5) {
                tank.particleSystem.start();
                var temp0 = PowerUps[1].position;
                PowerUps[1].position = BABYLON.Vector3.Zero();

                var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
                glass.play();

                tank.power = RandomPower(tank);

                setTimeout(function () {
                    tank.particleSystem.stop();
                }, 75);

                setTimeout(function () {
                    PowerUps[1].position = temp0;
                }, 2000);
            }

            if (tank.position.x > PowerUps[2].position.x - 5.5 &&
                tank.position.x < PowerUps[2].position.x + 5.5 &&
                tank.position.z > PowerUps[2].position.z - 5.5 &&
                tank.position.z < PowerUps[2].position.z + 5.5) {
                tank.particleSystem.start();
                var temp0 = PowerUps[2].position;
                PowerUps[2].position = BABYLON.Vector3.Zero();

                var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
                glass.play();

                tank.power = RandomPower(tank);

                setTimeout(function () {
                    tank.particleSystem.stop();
                }, 75);

                setTimeout(function () {
                    PowerUps[2].position = temp0;
                }, 2000);
            }

            if (tank.position.x > PowerUps[3].position.x - 5.5 &&
                tank.position.x < PowerUps[3].position.x + 5.5 &&
                tank.position.z > PowerUps[3].position.z - 5.5 &&
                tank.position.z < PowerUps[3].position.z + 5.5) {
                tank.particleSystem.start();
                var temp0 = PowerUps[3].position;
                PowerUps[3].position = BABYLON.Vector3.Zero();

                var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
                glass.play();

                tank.power = RandomPower(tank);

                setTimeout(function () {
                    tank.particleSystem.stop();
                }, 75);

                setTimeout(function () {
                    PowerUps[3].position = temp0;
                }, 2000);
            }

            if (tank.position.x > PowerUps[4].position.x - 5.5 &&
                tank.position.x < PowerUps[4].position.x + 5.5 &&
                tank.position.z > PowerUps[4].position.z - 5.5 &&
                tank.position.z < PowerUps[4].position.z + 5.5) {
                tank.particleSystem.start();
                var temp0 = PowerUps[4].position;
                PowerUps[4].position = BABYLON.Vector3.Zero();

                var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
                glass.play();

                tank.power = RandomPower(tank);

                setTimeout(function () {
                    tank.particleSystem.stop();
                }, 75);

                setTimeout(function () {
                    PowerUps[4].position = temp0;
                }, 2000);
            }

            if (tank.position.x > PowerUps[5].position.x - 5.5 &&
                tank.position.x < PowerUps[5].position.x + 5.5 &&
                tank.position.z > PowerUps[5].position.z - 5.5 &&
                tank.position.z < PowerUps[5].position.z + 5.5) {
                tank.particleSystem.start();
                var temp0 = PowerUps[5].position;
                PowerUps[5].position = BABYLON.Vector3.Zero();

                var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
                glass.play();

                tank.power = RandomPower(tank);

                setTimeout(function () {
                    tank.particleSystem.stop();
                }, 75);

                setTimeout(function () {
                    PowerUps[5].position = temp0;
                }, 2000);
            }

            if (tank.position.x > PowerUps[6].position.x - 5.5 &&
                tank.position.x < PowerUps[6].position.x + 5.5 &&
                tank.position.z > PowerUps[6].position.z - 5.5 &&
                tank.position.z < PowerUps[6].position.z + 5.5) {
                tank.particleSystem.start();
                var temp0 = PowerUps[6].position;
                PowerUps[6].position = BABYLON.Vector3.Zero();

                var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
                glass.play();

                tank.power = RandomPower(tank);

                setTimeout(function () {
                    tank.particleSystem.stop();
                }, 75);

                setTimeout(function () {
                    PowerUps[6].position = temp0;
                }, 2000);
            }

            if (tank.position.x > PowerUps[7].position.x - 5.5 &&
                tank.position.x < PowerUps[7].position.x + 5.5 &&
                tank.position.z > PowerUps[7].position.z - 5.5 &&
                tank.position.z < PowerUps[7].position.z + 5.5) {
                tank.particleSystem.start();
                var temp0 = PowerUps[7].position;
                PowerUps[7].position = BABYLON.Vector3.Zero();

                var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
                glass.play();

                tank.power = RandomPower(tank);

                setTimeout(function () {
                    tank.particleSystem.stop();
                }, 75);

                setTimeout(function () {
                    PowerUps[7].position = temp0;
                }, 2000);
            }

            if (isWPressed) {
                tank.moveWithCollisions(tank.frontVector.multiplyByFloats(tank.speed, 0, tank.speed));
            }

            if (isSPressed) {
                tank.moveWithCollisions(tank.frontVector.multiplyByFloats(-tank.speed, 0, -tank.speed));
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

            if (isEPressed) {
                console.log(tank.position);
                console.log(tank.laps);
                console.log(tank.passedCheckpoint);
                console.log(tank.power);
                console.log(Goo.length);
                console.log(madafe3.length);
                if (tank.power === "CannonBall") {
                    var cannonball = BABYLON.Mesh.CreateSphere("cannonball", 3, 20, scene, false);
                    var cannonMat = new BABYLON.StandardMaterial("cannonMat", scene);
                    cannonMat.diffuseColor = new BABYLON.Color3.Black;
                    cannonball.material = cannonMat;

                    var cannonsound = new BABYLON.Sound("can", "sounds/Cannon.wav", scene, null, { loop: false, autoplay: true });
                    cannonsound.play();

                    cannonball.position = tank.position.add(BABYLON.Vector3.Zero().add(tank.frontVector.normalize().multiplyByFloats(20, 0, 20)));
                    cannonball.position.y += 5;

                    cannonball.physicsImpostor = new BABYLON.PhysicsImpostor(cannonball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 5, friction: 10, restitution: .2 }, scene);
                    cannonball.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero().add(tank.frontVector.normalize().multiplyByFloats(200, 0, 200)));
                    madafe3.push(cannonball);
                    setTimeout(function () {
                        madafe3.splice(cannonball);
                        cannonball.dispose();
                    }, 2000);
                    tank.power = "none";
                }
                else if (tank.power === "SpeedBuff") {
                    var speedsound = new BABYLON.Sound("can", "sounds/Item Box Sound3.mp3", scene, null, { loop: false, autoplay: true });
                    speedsound.play();
                    tank.speed *= 1.5;
                    tank.power = "none";
                    var color = tank.material.diffuseColor;
                    var ani = scene.beginAnimation(tank, 0, 180, true);
                    setTimeout(function () {
                        tank.speed /= 1.5;
                        speedsound.stop();
                        ani.stop();
                        tank.material.diffuseColor = color;
                    }, 3000);
                }
                else if (tank.power === "SpeedNerf") {
                    tank.speed /= 1.5;
                    tank.power = "none";
                    var slowsound = new BABYLON.Sound("can", "sounds/Sitcom Laughter Applause2.mp3", scene, null, { loop: false, autoplay: true });
                    slowsound.play();
                    setTimeout(function () {
                        tank.speed *= 1.5;
                        slowsound.stop();
                    }, 3000);
                }
                else if (tank.power === "GooStain") {
                    var splaat = new BABYLON.Sound("can", "sounds/Splat.mp3", scene, null, { loop: false, autoplay: true });
                    splaat.play();
                    var goo = new BABYLON.Mesh.CreateBox("boxsss", 20, scene);
                    goo.position = tank.position.add(BABYLON.Vector3.Zero().add(tank.frontVector.normalize().multiplyByFloats(-50, 0, -50)));
                    goo.position.y = -9;
                    goo.material = new BABYLON.StandardMaterial("target", scene);
                    goo.material.diffuseTexture = new BABYLON.Texture("images/goo.png", scene);
                    goo.material.diffuseTexture.hasAlpha = true;
                    Goo.push(goo);
                    tank.power = "none";
                }
            }

            
        }
        Game.scenes[3].applyPlayer2Movement = function (tank, PowerUps, finish) {
            if (tank.position.y > 1)
                tank.position.y = 1;

            if (tank.position.x >= -876 && tank.position.x <= -575 && tank.position.z >= -126 && tank.position.z <= -122) {
                tank.passedCheckpoint = true;
            }

            if (tank.passedCheckpoint && tank.intersectsMesh(finish, true)) {
                tank.laps++;
                tank.passedCheckpoint = false;
            }

            if (tank.position.x > PowerUps[0].position.x - 5.5 &&
                tank.position.x < PowerUps[0].position.x + 5.5 &&
                tank.position.z > PowerUps[0].position.z - 5.5 &&
                tank.position.z < PowerUps[0].position.z + 5.5) {
                tank.particleSystem.start();
                var temp0 = PowerUps[0].position;
                PowerUps[0].position = BABYLON.Vector3.Zero();

                var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
                glass.play();

                tank.power = RandomPower(tank);

                setTimeout(function () {
                    tank.particleSystem.stop();
                }, 75);

                setTimeout(function () {
                    PowerUps[0].position = temp0;
                }, 2000);
            }

            if (tank.position.x > PowerUps[1].position.x - 5.5 &&
                tank.position.x < PowerUps[1].position.x + 5.5 &&
                tank.position.z > PowerUps[1].position.z - 5.5 &&
                tank.position.z < PowerUps[1].position.z + 5.5) {
                tank.particleSystem.start();
                var temp0 = PowerUps[1].position;
                PowerUps[1].position = BABYLON.Vector3.Zero();

                var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
                glass.play();

                tank.power = RandomPower(tank);

                setTimeout(function () {
                    tank.particleSystem.stop();
                }, 75);

                setTimeout(function () {
                    PowerUps[1].position = temp0;
                }, 2000);
            }

            if (tank.position.x > PowerUps[2].position.x - 5.5 &&
                tank.position.x < PowerUps[2].position.x + 5.5 &&
                tank.position.z > PowerUps[2].position.z - 5.5 &&
                tank.position.z < PowerUps[2].position.z + 5.5) {
                tank.particleSystem.start();
                var temp0 = PowerUps[2].position;
                PowerUps[2].position = BABYLON.Vector3.Zero();

                var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
                glass.play();

                tank.power = RandomPower(tank);

                setTimeout(function () {
                    tank.particleSystem.stop();
                }, 75);

                setTimeout(function () {
                    PowerUps[2].position = temp0;
                }, 2000);
            }

            if (tank.position.x > PowerUps[3].position.x - 5.5 &&
                tank.position.x < PowerUps[3].position.x + 5.5 &&
                tank.position.z > PowerUps[3].position.z - 5.5 &&
                tank.position.z < PowerUps[3].position.z + 5.5) {
                tank.particleSystem.start();
                var temp0 = PowerUps[3].position;
                PowerUps[3].position = BABYLON.Vector3.Zero();

                var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
                glass.play();

                tank.power = RandomPower(tank);

                setTimeout(function () {
                    tank.particleSystem.stop();
                }, 75);

                setTimeout(function () {
                    PowerUps[3].position = temp0;
                }, 2000);
            }

            if (tank.position.x > PowerUps[4].position.x - 5.5 &&
                tank.position.x < PowerUps[4].position.x + 5.5 &&
                tank.position.z > PowerUps[4].position.z - 5.5 &&
                tank.position.z < PowerUps[4].position.z + 5.5) {
                tank.particleSystem.start();
                var temp0 = PowerUps[4].position;
                PowerUps[4].position = BABYLON.Vector3.Zero();

                var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
                glass.play();

                tank.power = RandomPower(tank);

                setTimeout(function () {
                    tank.particleSystem.stop();
                }, 75);

                setTimeout(function () {
                    PowerUps[4].position = temp0;
                }, 2000);
            }

            if (tank.position.x > PowerUps[5].position.x - 5.5 &&
                tank.position.x < PowerUps[5].position.x + 5.5 &&
                tank.position.z > PowerUps[5].position.z - 5.5 &&
                tank.position.z < PowerUps[5].position.z + 5.5) {
                tank.particleSystem.start();
                var temp0 = PowerUps[5].position;
                PowerUps[5].position = BABYLON.Vector3.Zero();

                var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
                glass.play();

                tank.power = RandomPower(tank);

                setTimeout(function () {
                    tank.particleSystem.stop();
                }, 75);

                setTimeout(function () {
                    PowerUps[5].position = temp0;
                }, 2000);
            }

            if (tank.position.x > PowerUps[6].position.x - 5.5 &&
                tank.position.x < PowerUps[6].position.x + 5.5 &&
                tank.position.z > PowerUps[6].position.z - 5.5 &&
                tank.position.z < PowerUps[6].position.z + 5.5) {
                tank.particleSystem.start();
                var temp0 = PowerUps[6].position;
                PowerUps[6].position = BABYLON.Vector3.Zero();

                var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
                glass.play();

                tank.power = RandomPower(tank);

                setTimeout(function () {
                    tank.particleSystem.stop();
                }, 75);

                setTimeout(function () {
                    PowerUps[6].position = temp0;
                }, 2000);
            }

            if (tank.position.x > PowerUps[7].position.x - 5.5 &&
                tank.position.x < PowerUps[7].position.x + 5.5 &&
                tank.position.z > PowerUps[7].position.z - 5.5 &&
                tank.position.z < PowerUps[7].position.z + 5.5) {
                tank.particleSystem.start();
                var temp0 = PowerUps[7].position;
                PowerUps[7].position = BABYLON.Vector3.Zero();

                var glass = new BABYLON.Sound("broken", "sounds/Glass Vase-trimmed.mp3", scene, null, { loop: false, autoplay: true });
                glass.play();

                tank.power = RandomPower(tank);

                setTimeout(function () {
                    tank.particleSystem.stop();
                }, 75);

                setTimeout(function () {
                    PowerUps[7].position = temp0;
                }, 2000);
            }

            if (isIPressed) {
                tank.moveWithCollisions(tank.frontVector.multiplyByFloats(tank.speed, 0, tank.speed));
            }

            if (isKPressed) {
                tank.moveWithCollisions(tank.frontVector.multiplyByFloats(-tank.speed, 0, -tank.speed));
            }

            if (isLPressed) {
                tank.rotation.y += 0.1 * tank.rotationSensitivity;
                tank.frontVector.x = Math.sin(tank.rotation.y) * -1;
                tank.frontVector.z = Math.cos(tank.rotation.y) * -1;
            }

            if (isJPressed) {
                tank.rotation.y -= 0.1 * tank.rotationSensitivity;
                tank.frontVector.x = Math.sin(tank.rotation.y) * -1;
                tank.frontVector.z = Math.cos(tank.rotation.y) * -1;
            }

            if (isOPressed) {
                console.log(tank.position);
                console.log(tank.laps);
                console.log(tank.passedCheckpoint);
                console.log(tank.power);
                console.log(Goo.length);
                console.log(madafe3.length);
                if (tank.power === "CannonBall") {
                    var cannonball = BABYLON.Mesh.CreateSphere("cannonball", 3, 20, scene, false);
                    var cannonMat = new BABYLON.StandardMaterial("cannonMat", scene);
                    cannonMat.diffuseColor = new BABYLON.Color3.Black;
                    cannonball.material = cannonMat;

                    var cannonsound = new BABYLON.Sound("can", "sounds/Cannon.wav", scene, null, { loop: false, autoplay: true });
                    cannonsound.play();
                    setTimeout(function () {
                        cannonsound.stop();
                    }, 1000);

                    cannonball.position = tank.position.add(BABYLON.Vector3.Zero().add(tank.frontVector.normalize().multiplyByFloats(20, 0, 20)));
                    cannonball.position.y += 5;

                    cannonball.physicsImpostor = new BABYLON.PhysicsImpostor(cannonball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 5, friction: 10, restitution: .2 }, scene);
                    cannonball.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero().add(tank.frontVector.normalize().multiplyByFloats(200, 0, 200)));
                    madafe3.push(cannonball);
                    setTimeout(function () {
                        madafe3.splice(cannonball);
                        cannonball.dispose();
                    }, 2000);
                    tank.power = "none";
                }
                else if (tank.power === "SpeedBuff") {
                    var speedsound = new BABYLON.Sound("can", "sounds/Item Box Sound3.mp3", scene, null, { loop: false, autoplay: true });
                    speedsound.play();
                    tank.speed *= 1.5;
                    tank.power = "none";
                    var color = tank.material.diffuseColor;
                    var ani = scene.beginAnimation(tank, 0, 180, true);
                    setTimeout(function () {
                        tank.speed /= 1.5;
                        speedsound.stop();
                        ani.stop();
                        tank.material.diffuseColor = color;
                    }, 3000);
                }
                else if (tank.power === "SpeedNerf") {
                    tank.speed /= 1.5;
                    tank.power = "none";
                    var slowsound = new BABYLON.Sound("can", "sounds/Sitcom Laughter Applause2.mp3", scene, null, { loop: false, autoplay: true });
                    slowsound.play();
                    setTimeout(function () {
                        tank.speed *= 1.5;
                        slowsound.stop();
                    }, 3000);
                }
                else if (tank.power === "GooStain") {
                    var splaat = new BABYLON.Sound("can", "sounds/Splat.mp3", scene, null, { loop: false, autoplay: true });
                    splaat.play();
                    var goo = new BABYLON.Mesh.CreateBox("boxsss", 20, scene);
                    goo.position = tank.position.add(BABYLON.Vector3.Zero().add(tank.frontVector.normalize().multiplyByFloats(-50, 0, -50)));
                    goo.position.y = -9;
                    goo.material = new BABYLON.StandardMaterial("target", scene);
                    goo.material.diffuseTexture = new BABYLON.Texture("images/goo.png", scene);
                    goo.material.diffuseTexture.hasAlpha = true;
                    Goo.push(goo);
                    tank.power = "none";
                }
            }

            
        }
        Game.scenes[3].renderLoop = function () {
            this.applyPlayer1Movement(tank[0], PowerUps, finish);
            this.applyPlayer2Movement(tank[1], PowerUps, finish);
            this.touchGoo(tank[0]);
            this.touchGoo(tank[1]);
            this.touchCannon(tank[0]);
            this.touchCannon(tank[1]);
            this.render();
        }
        return scene;
    }
}

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
    if (event.key === 'e' || event.key === 'E') {
        isEPressed = true;
    }
    if (event.key === 'j' || event.key === 'J') {
        isJPressed = true;
    }
    if (event.key === 'l' || event.key === 'L') {
        isLPressed = true;
    }
    if (event.key === 'i' || event.key === 'I') {
        isIPressed = true;
    }
    if (event.key === 'k' || event.key === 'K') {
        isKPressed = true;
    }
    if (event.key === 'o' || event.key === 'O') {
        isOPressed = true;
    }
    if (event.key === 'l' || event.key === 'L') {
        isLPressed = true;
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
    if (event.key === 'e' || event.key === 'E') {
        isEPressed = false;
    }
    if (event.key === 'j' || event.key === 'J') {
        isJPressed = false;
    }
    if (event.key === 'l' || event.key === 'L') {
        isLPressed = false;
    }
    if (event.key === 'i' || event.key === 'I') {
        isIPressed = false;
    }
    if (event.key === 'k' || event.key === 'K') {
        isKPressed = false;
    }
    if (event.key === 'o' || event.key === 'O') {
        isOPressed = false;
    }
    if (event.key === 'l' || event.key === 'L') {
        isLPressed = false;
    }
});

function createGround(ur1, ur2, scene) {
    var ground = new BABYLON.Mesh.CreateGroundFromHeightMap("G"+Game.activeScene, ur1, 2000, 2000,50,0,75   ,scene,false);
    var groundMaterial = new BABYLON.StandardMaterial("M"+Game.activeScene, scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture(ur2, scene);
    ground.material = groundMaterial;
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

    camera.checkCollisions = false;
    camera.speed = 10   ;
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

function createHero(color, scene) {
    var tank = new BABYLON.Mesh.CreateBox("tank", 2, scene);
    var animationBox = new BABYLON.Animation("myAnimation", "material.diffuseColor", 180, BABYLON.Animation.ANIMATIONTYPE_COLOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var keys = [];

    keys.push({
        frame: 0,
        value: new BABYLON.Color3(1, 0, 0)
    });

    keys.push({
        frame: 60,
        value: new BABYLON.Color3(0, 1, 0)
    });

    keys.push({
        frame: 120,
        value: new BABYLON.Color3(0, 0, 1)
    });

    animationBox.setKeys(keys);
    var tankMaterial = new BABYLON.StandardMaterial("tankMat", scene);
    tankMaterial.diffuseColor = color;

    tank.material = tankMaterial;
    tank.animations.push(animationBox);
    tank.ellipsoid = new BABYLON.Vector3(3, 1.0, 3);
    tank.ellipsoidOffset = new BABYLON.Vector3(0, 1.0, 0);
    tank.scaling.y = 0.5;
    tank.scaling.x = 1.5;
    tank.scaling.z = 2;
    tank.rotationSensitivity = 1.3;

    tank.speed = 4;
    tank.frontVector = new BABYLON.Vector3(0, 0, -1);
    tank.power = "none";
    tank.rotation.x -= 0.05;


    var tiremat = new BABYLON.StandardMaterial("tirmat", scene);
    tiremat.diffuseColor = new BABYLON.Color3.Red;

    var tire1 = new BABYLON.Mesh.CreateCylinder("cylinder", 1, 10, 10, 12, 3, scene);
    tire1.material = tiremat;

    tire1.scaling.z *= 0.1;
    tire1.scaling.y *= 0.1;
    tire1.scaling.x *= 0.3;

    tire1.position.y += 0.1;
    tire1.position.x += 1;
    tire1.position.z += 0.9;
    tire1.rotation.z = Math.PI / 2;

    tire1.parent = tank;


    var tire2 = new BABYLON.Mesh.CreateCylinder("cylinder", 1, 10, 10, 12, 3, scene);
    tire2.material = tiremat;

    tire2.scaling.z *= 0.1;
    tire2.scaling.y *= 0.1;
    tire2.scaling.x *= 0.3;

    tire2.position.y += 0.1;
    tire2.position.x -= 1;
    tire2.position.z += 0.9;
    tire2.rotation.z = Math.PI / 2;

    tire2.parent = tank;

    var tire3 = new BABYLON.Mesh.CreateCylinder("cylinder", 1, 7, 7, 12, 3, scene);
    tire3.material = tiremat;

    tire3.scaling.z *= 0.1;
    tire3.scaling.y *= 0.1;
    tire3.scaling.x *= 0.3;

    tire3.position.y -= 0.2;
    tire3.position.x -= 1;
    tire3.position.z -= 0.9;
    tire3.rotation.z = Math.PI / 2;

    tire3.parent = tank;

    var tire4 = new BABYLON.Mesh.CreateCylinder("cylinder", 1, 7, 7, 12, 3, scene);
    tire4.material = tiremat;

    tire4.scaling.z *= 0.1;
    tire4.scaling.y *= 0.1;
    tire4.scaling.x *= 0.3;

    tire4.position.y -= 0.1;
    tire4.position.x += 1;
    tire4.position.z -= 0.9;
    tire4.rotation.z = Math.PI / 2;

    tire4.parent = tank;

    tank.checkCollisions = true;
    tank.passedCheckpoint = false;
    tank.laps = 0;

    tank.particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
    tank.particleSystem.particleTexture = new BABYLON.Texture("textures/flare.png", scene);
    tank.particleSystem.color1 = new BABYLON.Color3(0.3, 0.56, 1);
    tank.particleSystem.color2 = new BABYLON.Color3(0.9, 0.9, 1);

    tank.particleSystem.minSize = 0.2;
    tank.particleSystem.maxSize = 0.9;
    tank.particleSystem.minEmitBox = new BABYLON.Vector3(-2, -2, -2);
    tank.particleSystem.maxEmitBox = new BABYLON.Vector3(2, 2, 2);
    tank.particleSystem.minLifeTime = 0.3;
    tank.particleSystem.maxLifeTime = 1.5;
    tank.particleSystem.emitRate = 2000;
    tank.particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);
    tank.particleSystem.emitter = tank;

    return tank;
}

function createFinishLine(scene, sceneIndex) {
    var finishLine = BABYLON.Mesh.CreateBox("line", 2, scene);
    var finishSign = BABYLON.Mesh.CreateCylinder("cylinder", 50, 3, 3, 12, 1, scene);
    var finishSign2 = BABYLON.Mesh.CreateCylinder("cylinder2", 50, 3, 3, 12, 1, scene);
    var finishFlag = BABYLON.Mesh.CreateBox("line", 2, scene);
    var realFinishLine = BABYLON.Mesh.CreateBox("sss", 2, scene);

    var lineMaterial = new BABYLON.StandardMaterial("M2", scene);
    lineMaterial.diffuseTexture = new BABYLON.Texture("images/stripes33.jpg", scene);
    lineMaterial.emissiveColor = new BABYLON.Color3(0, 1, 0);
    
    var signMaterial = new BABYLON.StandardMaterial("M3", scene);
    signMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);

    var mat = new BABYLON.StandardMaterial("mat", scene);
    mat.diffuseColor = BABYLON.Color3.White();
    mat.alpha = 0;
    if (sceneIndex === 0) {

        finishLine.scaling.x = 180;
        finishLine.scaling.y = 0.1;
        finishLine.scaling.z = 5;
        finishLine.position.x = 578;
        finishLine.position.y = 0;
        finishLine.position.z = 382;
        finishLine.rotation.y = -0.5;
        finishLine.material = lineMaterial;


        finishSign.position.x = 424;
        finishSign.position.y = 25;
        finishSign.position.z = 298;
        finishSign.material = signMaterial;
        finishLine.sign1 = finishSign;


        finishSign2.position.x = 731;
        finishSign2.position.y = 25;
        finishSign2.position.z = 466;
        finishSign2.material = signMaterial;
        finishLine.sign2 = finishSign2;


        finishFlag.scaling.x = 180;
        finishFlag.scaling.y = 0.1;
        finishFlag.scaling.z = 5;
        finishFlag.position.x = 577.5;
        finishFlag.position.y = 50;
        finishFlag.position.z = 382;
        finishFlag.rotation.x = Math.PI / 2;
        finishFlag.rotation.y = -0.5;
        finishFlag.material = lineMaterial;
        finishLine.flag = finishFlag;


        realFinishLine.scaling.x = 180;
        realFinishLine.scaling.y = 1;
        realFinishLine.scaling.z = 5;
        realFinishLine.position.x = 578;
        realFinishLine.position.y = 1;
        realFinishLine.position.z = 382;
        realFinishLine.rotation.y = -0.5;
        realFinishLine.material = mat;
    }

    else if (sceneIndex === 1) {
        finishLine.scaling.x = 60;
        finishLine.scaling.y = 0.1;
        finishLine.scaling.z = 5;
        finishLine.position.x = 819.5;
        finishLine.position.y = 0;
        finishLine.position.z = 12.5;
        finishLine.material = lineMaterial;


        finishSign.position.x = 762;
        finishSign.position.y = 25;
        finishSign.position.z = 12;
        finishSign.material = signMaterial;
        finishLine.sign1 = finishSign;


        finishSign2.position.x = 877;
        finishSign2.position.y = 25;
        finishSign2.position.z = 13;
        finishSign2.material = signMaterial;
        finishLine.sign2 = finishSign2;


        finishFlag.scaling.x = 58;
        finishFlag.scaling.y = 0.1;
        finishFlag.scaling.z = 5;
        finishFlag.position.x = 819.5;
        finishFlag.position.y = 50;
        finishFlag.position.z = 12.5;
        finishFlag.rotation.x = Math.PI / 2;
        finishFlag.material = lineMaterial;
        finishLine.flag = finishFlag;


        realFinishLine.scaling.x = 60;
        realFinishLine.scaling.y = 1;
        realFinishLine.scaling.z = 5;
        realFinishLine.position.x = 819.5;
        realFinishLine.position.y = 1;
        realFinishLine.position.z = 12.5;
        realFinishLine.material = mat;
    }

    else if (sceneIndex === 2) {
        finishLine.scaling.x = 80;
        finishLine.scaling.y = 0.1;
        finishLine.scaling.z = 5;

        finishLine.position.x = 141;
        finishLine.position.y = 0;
        finishLine.position.z = 799.95;
        finishLine.rotation.y = Math.PI / 2;
        finishLine.material = lineMaterial;


        finishSign.position.x = 141;
        finishSign.position.y = 25;
        finishSign.position.z = 722.4;
        finishSign.material = signMaterial;
        finishLine.sign1 = finishSign;


        finishSign2.position.x = 141;
        finishSign2.position.y = 25;
        finishSign2.position.z = 877.5;
        finishSign2.material = signMaterial;
        finishLine.sign2 = finishSign2;


        finishFlag.scaling.x = 80;
        finishFlag.scaling.y = 0.1;
        finishFlag.scaling.z = 5;
        finishFlag.position.x = 141;
        finishFlag.position.y = 50;
        finishFlag.position.z = 799.95;
        finishFlag.rotation.x = Math.PI / 2;
        finishFlag.rotation.y = Math.PI / 2;
        finishFlag.material = lineMaterial;
        finishLine.flag = finishFlag;


        realFinishLine.scaling.x = 80;
        realFinishLine.scaling.y = 1;
        realFinishLine.scaling.z = 5;
        realFinishLine.position.x = 141;
        realFinishLine.position.y = 1;
        realFinishLine.position.z = 799.95;
        realFinishLine.rotation.y = Math.PI / 2;
        realFinishLine.material = mat;
    }
    return realFinishLine;
}

function createPowerups(scene,sceneIndex) {
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
    if (sceneIndex === 0) {
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
    }
    else if (sceneIndex === 1) {
        Ups[0].position.x = 802;
        Ups[0].position.y = 5;
        Ups[0].position.z = -499;

        Ups[1].position.x = 769;
        Ups[1].position.y = 5;
        Ups[1].position.z = -495;

        Ups[2].position.x = 735;
        Ups[2].position.y = 5;
        Ups[2].position.z = -489;

        Ups[3].position.x = -690;
        Ups[3].position.y = 5;
        Ups[3].position.z = -95;

        Ups[4].position.x = -724;
        Ups[4].position.y = 5;
        Ups[4].position.z = -94;

        Ups[5].position.x = -762;
        Ups[5].position.y = 5;
        Ups[5].position.z = -93;

        Ups[6].position.x = -794;
        Ups[6].position.y = 5;
        Ups[6].position.z = -91;

        Ups[7].position.x = -24;
        Ups[7].position.y = 5;
        Ups[7].position.z = 531;
    }
    else if (sceneIndex === 2) {
        Ups[0].position.x = -715;
        Ups[0].position.y = 5;
        Ups[0].position.z = 605;

        Ups[1].position.x = -665;
        Ups[1].position.y = 5;
        Ups[1].position.z = 639;

        Ups[2].position.x = -907;
        Ups[2].position.y = 5;
        Ups[2].position.z = -426;

        Ups[3].position.x = -872;
        Ups[3].position.y = 5;
        Ups[3].position.z = 429;

        Ups[4].position.x = -847;
        Ups[4].position.y = 5;
        Ups[4].position.z = -442;

        Ups[5].position.x = -74;
        Ups[5].position.y = 5;
        Ups[5].position.z = 107;

        Ups[6].position.x = -320;
        Ups[6].position.y = 5;
        Ups[6].position.z = -502;

        Ups[7].position.x = 798;
        Ups[7].position.y = 5;
        Ups[7].position.z = -559;
    }

        Ups[0].material = UpsMaterial[0];
        Ups[1].material = UpsMaterial[1];
        Ups[2].material = UpsMaterial[2];
        Ups[3].material = UpsMaterial[3];
        Ups[4].material = UpsMaterial[4];
        Ups[5].material = UpsMaterial[5];
        Ups[6].material = UpsMaterial[6];
        Ups[7].material = UpsMaterial[7];

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

function createSkybox(url,scene) {
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 10000.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    skybox.infiniteDistance = true;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(url, scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

}

function RandomPower(tank) {
    return "CannonBall";
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
        return "GooStain";
}