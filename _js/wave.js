var scene = new THREE.Scene();

var W = window.innerWidth;
var H = 150;

var renderer = new THREE.WebGLRenderer({ alpha: true, antialias : true });
renderer.setClearColor(0x17293a, 0);
renderer.setSize(W, H);

var camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 10000);

//set the plane detail
var planeGeometry = new THREE.PlaneGeometry(2000, 100, 40, 16);
//set the line color's
var planeMaterial = new THREE.MeshBasicMaterial({
  wireframeLinewidth: 1.2,
  color: 0xffffff, 
  wireframe: true,
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);

plane.rotation.x = -0.9 * Math.PI;

plane.position.set(0, 0, 40);

scene.add(plane);

camera.position.set(0, 120, 100);
camera.lookAt(scene.position);

//add the element to DOM
document.getElementById("canvas").appendChild( renderer.domElement );

(function drawFrame(ts){
  var center = new THREE.Vector2(0,0);
  window.requestAnimationFrame(drawFrame);
  var vLength = plane.geometry.vertices.length;
  for (var i = 0; i < vLength; i++) {
    var v = plane.geometry.vertices[i];
    var dist = new THREE.Vector2(v.x, v.y).sub(center);
    var size = 50.0;
    var magnitude = 20;

    var heightVariation = Math.sin(dist.length()/-size + (ts/180)) * magnitude;
    var growth = false;
    if (Math.sin(ts) == 1 ) {
      growth = false;
    } else if (Math.sin(ts) == -1 ) {
      growth = true;
    }

    // modify the steepness
    if (growth == true) {
      v.z = heightVariation*0.01;
    } else {
      v.z = heightVariation;
    }
  }
  plane.geometry.verticesNeedUpdate = true;
  renderer.render(scene, camera);
}());
