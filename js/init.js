function App() {
  if ( !(this instanceof App) ) return new App();

  var self = this;

  this.background = null;

  this.camera   = null;
  this.scene    = null;
  this.renderer = null;

  this.mesh     = null;


  function init() {
    // Check if the basic URL includes link to the section
    onHashChange();

    //

    self.background = document.getElementById( 'background' );

    self.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    self.renderer.setPixelRatio( window.devicePixelRatio );
    self.renderer.setSize( window.innerWidth, window.innerHeight );
    self.renderer.setClearColor( 0xffffff );
    background.appendChild( self.renderer.domElement );

    //

    self.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    self.camera.position.z = 400;

    self.scene = new THREE.Scene();

    var geometry = new THREE.IcosahedronGeometry( 100, 0 );
    var material = new THREE.MeshBasicMaterial( { color: 0x808080, wireframe: true } );
    self.mesh = new THREE.Mesh( geometry, material );

    self.scene.add( self.mesh );

    //

    window.addEventListener( 'resize', debounce( onWindowResize, 64 ), false );
    window.addEventListener( 'hashchange', onHashChange, false );
  }

  function onWindowResize() {
    self.camera.aspect = window.innerWidth / window.innerHeight;
    self.camera.updateProjectionMatrix();

    self.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  function onHashChange() {
    var hash   = window.location.hash,
        regexp = /^#kung-fu$|^#skills$|^#timeline$|^#$/;

    if ( hash.length === 0 || hash.search( regexp ) === 0 ) {
      document.body.className = hash.slice( 1 );
    }
  }

  function animate() {
    requestAnimationFrame( animate );

    self.mesh.rotation.x += 0.002;
    self.mesh.rotation.y += 0.005;

    self.renderer.render( self.scene, self.camera );
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
