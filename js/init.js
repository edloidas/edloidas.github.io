function App() {
  if ( !(this instanceof App) ) return new App();

  this.background = null;

  this.camera   = null;
  this.scene    = null;
  this.renderer = null;

  this.mesh     = null;


  function init() {
    this.background = document.getElementById( 'background' );

    this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.setClearColor( 0xffffff );
    background.appendChild( this.renderer.domElement );

    //

    this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    this.camera.position.z = 400;

    this.scene = new THREE.Scene();

    var geometry = new THREE.IcosahedronGeometry( 100, 0 );
    var material = new THREE.MeshBasicMaterial( { color: 0x808080, wireframe: true } );
    this.mesh = new THREE.Mesh( geometry, material );

    this.scene.add( this.mesh );

    //

    window.addEventListener( 'resize', debounce( onWindowResize, 64 ), false );
  }

  function onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  function animate() {
    requestAnimationFrame( animate );

    this.mesh.rotation.x += 0.002;
    this.mesh.rotation.y += 0.005;

    this.renderer.render( scene, camera );
  }

  this.run = function () {
    init();
    animate();
  };
}

var edloidas = new App();
edloidas.run();


// UTILITIES

/*
 * debounce
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 * http://davidwalsh.name/javascript-debounce-function
 */
function debounce( func, wait, immediate ) {
  var timeout;
  return function() {
    var that = this, args = arguments;
    var later = function() {
      timeout = null;
      if ( !immediate ) func.apply( that, args );
    };
    var callNow = immediate && !timeout;
    clearTimeout( timeout );
    timeout = setTimeout( later, wait );
    if ( callNow ) func.apply( context, args );
  };
}
