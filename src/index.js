import 'css-wipe'
import '../style/base.css'

import THREE from 'three'
import altspace from 'altspace'

import Please from 'pleasejs'

var CUBE_SCALE = 150;
//can change above value in live-coding, 10-500 works well

var sim = altspace.utilities.Simulation();
var config = { authorId: 'AltspaceVR', appId: 'SpinningCube' };
var sceneSync;

altspace.utilities.sync.connect(config).then(function(connection) {
  sceneSync = altspace.utilities.behaviors.SceneSync(connection.instance, {
    instantiators: {'Cube': createCube },
    ready: ready
  });
  sim.scene.addBehavior(sceneSync);
});

function createCube() {
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshBasicMaterial({color:'#ffffff'});
  var cube = new THREE.Mesh(geometry, material);
  cube.scale.multiplyScalar(CUBE_SCALE);
  cube.addBehaviors(
    altspace.utilities.behaviors.Object3DSync(),
    altspace.utilities.behaviors.Spin({speed: 0.0005}),
    ChangeColor()
  );
  sim.scene.add(cube);
  return cube;
}

function ready(firstInstance) {
  if (firstInstance) {
    sceneSync.instantiate('Cube');
  }
}

function ChangeColor() {//define a custom behavior
  var object3d;
  var lastColor;
  var colorRef;
  function awake(o) {
    object3d = o;
    var sync = object3d.getBehaviorByType('Object3DSync');//TODO: better way of doing this
    colorRef = sync.dataRef.child('color');
    colorRef.on('value', function (snapshot) {
      var value = snapshot.val();
      if (!value) return; //we are first to create the cube, no color set yet
      object3d.material.color = new THREE.Color(value);
      object3d.material.needsUpdate = true;//currently required in Altspace
    });
    object3d.addEventListener('cursordown', function() {
      var color = Please.make_color()[0];//random color
      colorRef.set(color);
    });
  }
  function update(deltaTime) {
    /* no updating needed, color changes in Firebase 'value' callback above */
  }
  return { awake: awake, update: update };
};