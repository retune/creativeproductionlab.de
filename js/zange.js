$( document ).ready(function() {
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container;

var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var camera, scene, renderer, objects;
var particleLight;
var dae;

var filename;

var loader = new THREE.ColladaLoader();
loader.options.convertUpAxis = false;


if(Math.random() < 0.5){
  filename = "./js/zange_2.dae";
} else {
  filename = "./js/hammer2.dae";
}

loader.load( filename, function ( collada ) {
  dae = collada.scene;
  dae.traverse( function ( child ) {
    if (child instanceof THREE.Mesh) {
      child.material = new THREE.MeshBasicMaterial( { vertexColors: true } );
    }
  } );

  dae.scale.x = dae.scale.y = dae.scale.z = 5;
  dae.scale.x = -dae.scale.x;
  dae.updateMatrix();

  init();
  animate();
} );

function init() {
  container = document.createElement( 'div' );
  document.getElementById("landingpage").appendChild( container );
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
  // camera.position.set( 2, 2, 3 );
  camera.position.z = 250;
  scene = new THREE.Scene();

  // Add the COLLADA
  scene.add( dae );
  particleLight = new THREE.Mesh( new THREE.SphereGeometry( 4, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
  scene.add( particleLight );

  // Lights
  scene.add( new THREE.AmbientLight( 0xcccccc ) );
  var directionalLight = new THREE.DirectionalLight(/*Math.random() * 0xffffff*/0xeeeeee );
  directionalLight.position.x = Math.random() - 0.5;
  directionalLight.position.y = Math.random() - 0.5;
  directionalLight.position.z = Math.random() - 0.5;
  directionalLight.position.normalize();
  scene.add( directionalLight );

  var pointLight = new THREE.PointLight( 0xffffff, 4 );
  particleLight.add( pointLight );

  renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );

  container.appendChild( renderer.domElement );

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
  requestAnimationFrame( animate );
  render();
}

var clock = new THREE.Clock();

function onDocumentMouseMove( event ) {
  mouseX = ( event.clientX - windowHalfX ) / 2;
  mouseY = ( event.clientY - windowHalfY ) / 2;
}

function render() {
  var timer = Date.now() * 0.0005;
  camera.position.x += ( mouseX - camera.position.x ) * .05;
  camera.position.y += (  mouseY - camera.position.y ) * .05;

  camera.lookAt( scene.position );
  particleLight.position.x = Math.sin( timer * 4 ) * 3009;
  particleLight.position.y = Math.cos( timer * 5 ) * 4000;
  particleLight.position.z = Math.cos( timer * 4 ) * 3009;
  THREE.AnimationHandler.update( clock.getDelta() );
  renderer.render( scene, camera );
}
});
