/* Lanyard First Screen - 3D Physics Card for Hexo Blog */
(function() {
  'use strict';

  var container = document.getElementById('lanyard-first-screen');
  if (!container) {
    console.warn('Lanyard: #lanyard-first-screen not found');
    return;
  }

  var scene, camera, renderer, physicsBodies = [];
  var cardBody, bandMesh, cardGroup;
  var curve;
  var isDragging = false;
  var dragOffset = new THREE.Vector3();
  var isHovered = false;
  var animationId;
  var isMobile = window.innerWidth < 768;
  var fixedBody, j1Body, j2Body, j3Body;

  var CONFIG = {
    position: [0, 0, 30],
    gravity: [0, -40, 0],
    fov: 20,
    maxSpeed: 50,
    minSpeed: 0,
    dpr: isMobile ? 1.5 : 2,
    physicsSteps: isMobile ? 1 / 30 : 1 / 60,
  };

  function createPhysicsBodies() {
    physicsBodies = [];

    fixedBody = {
      type: 'fixed',
      position: new THREE.Vector3(0, 4, 0),
      translation: new THREE.Vector3(0, 4, 0),
      lerped: new THREE.Vector3(0, 4, 0)
    };

    var jointPositions = [0.5, 1, 1.5];
    j1Body = createJointBody(jointPositions[0]);
    j2Body = createJointBody(jointPositions[1]);
    j3Body = createJointBody(jointPositions[2]);

    cardBody = {
      type: 'dynamic',
      position: new THREE.Vector3(2, 4, 0),
      translation: new THREE.Vector3(2, 4, 0),
      angvel: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Vector3(0, 0, 0),
      angularDamping: 4,
      linearDamping: 4,
      canSleep: true,
      colliders: false
    };

    physicsBodies = [fixedBody, j1Body, j2Body, j3Body, cardBody];
  }

  function createJointBody(x) {
    return {
      type: 'dynamic',
      position: new THREE.Vector3(x, 4, 0),
      translation: new THREE.Vector3(x, 4, 0),
      lerped: new THREE.Vector3(x, 4, 0),
      angvel: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Vector3(0, 0, 0),
      angularDamping: 4,
      linearDamping: 4,
      canSleep: true,
      colliders: false
    };
  }

  function createCard() {
    cardGroup = new THREE.Group();
    cardGroup.position.set(0, 4, 0);

    var cardGeometry = new THREE.BoxGeometry(1.8, 2.25, 0.02);

    var textureLoader = new THREE.TextureLoader();
    var cardMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1a1a2e,
      metalness: 0.8,
      roughness: 0.9,
      clearcoat: isMobile ? 0 : 1,
      clearcoatRoughness: 0.15,
    });

    textureLoader.load(
      '/images/lanyard/avatar.svg',
      function(texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        cardMaterial.map = texture;
        cardMaterial.needsUpdate = true;
      },
      undefined,
      function() {
        console.warn('Lanyard: Could not load avatar texture');
      }
    );

    var cardMesh = new THREE.Mesh(cardGeometry, cardMaterial);
    cardMesh.position.set(0, -1.2, -0.05);
    cardMesh.scale.set(2.25, 2.25, 2.25);
    cardGroup.add(cardMesh);

    var clipGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 16);
    var clipMaterial = new THREE.MeshStandardMaterial({
      color: 0x888888,
      metalness: 1,
      roughness: 0.3,
    });
    var clipMesh = new THREE.Mesh(clipGeometry, clipMaterial);
    clipMesh.position.set(0, 0.8, 0);
    clipMesh.rotation.z = Math.PI / 2;
    cardGroup.add(clipMesh);

    var clampGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.02);
    var clampMesh = new THREE.Mesh(clampGeometry, clipMaterial);
    clampMesh.position.set(0, 0.5, 0);
    cardGroup.add(clampMesh);

    cardGroup.traverse(function(child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(cardGroup);
  }

  function createBand() {
    curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3()
    ]);
    curve.curveType = 'chordal';

    var bandGeometry = new THREE.BufferGeometry();
    var points = curve.getPoints(isMobile ? 16 : 32);
    bandGeometry.setFromPoints(points);

    var textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      '/images/lanyard/octocat.svg',
      function(texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        if (bandMesh) {
          bandMesh.material.map = texture;
          bandMesh.material.needsUpdate = true;
        }
      },
      undefined,
      function() {
        console.warn('Lanyard: Could not load octocat texture');
      }
    );

    var bandMaterial = new THREE.LineBasicMaterial({
      color: 0xf97316,
      linewidth: 3,
      transparent: true,
      opacity: 0.9,
    });

    bandMesh = new THREE.Line(bandGeometry, bandMaterial);
    bandMesh.renderOrder = 999;
    scene.add(bandMesh);
  }

  function setupEvents() {
    var canvas = renderer.domElement;

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerout', onPointerOut);
  }

  function onPointerDown(event) {
    var rect = renderer.domElement.getBoundingClientRect();
    var x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    var y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    var dist = Math.abs(x) + Math.abs(y);
    if (dist < 0.3) {
      isDragging = true;
      dragOffset.set(x, y, 0.5);
      document.body.style.cursor = 'grabbing';
      physicsBodies.forEach(function(b) { if (b && b.wakeUp) b.wakeUp(); });
    }
  }

  function onPointerMove(event) {
    if (!isDragging) return;

    var rect = renderer.domElement.getBoundingClientRect();
    var x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    var y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    var vec = new THREE.Vector3(x, y, 0.5).unproject(camera);
    var dir = vec.sub(camera.position).normalize();
    vec.add(dir.multiplyScalar(camera.position.length()));

    cardBody.position.set(
      vec.x - dragOffset.x,
      vec.y - dragOffset.y,
      vec.z - dragOffset.z
    );
  }

  function onPointerUp() {
    isDragging = false;
    document.body.style.cursor = isHovered ? 'grab' : 'auto';
  }

  function onPointerOut() {
    isHovered = false;
    isDragging = false;
    document.body.style.cursor = 'auto';
  }

  function updatePhysics(delta) {
    if (!fixedBody) return;

    [j1Body, j2Body].forEach(function(ref) {
      if (!ref.lerped) ref.lerped = new THREE.Vector3().copy(ref.translation);
      var clampedDistance = Math.max(0.1, Math.min(1, ref.lerped.distanceTo(ref.translation)));
      ref.lerped.lerp(
        ref.translation,
        delta * (CONFIG.minSpeed + clampedDistance * (CONFIG.maxSpeed - CONFIG.minSpeed))
      );
    });

    if (j3Body && j2Body && j1Body && fixedBody && curve && bandMesh) {
      curve.points[0].copy(j3Body.translation);
      curve.points[1].copy(j2Body.lerped);
      curve.points[2].copy(j1Body.lerped);
      curve.points[3].copy(fixedBody.translation);

      var points = curve.getPoints(isMobile ? 16 : 32);
      bandMesh.geometry.setFromPoints(points);
      bandMesh.geometry.attributes.position.needsUpdate = true;
    }

    if (cardBody) {
      var ang = cardBody.angvel || new THREE.Vector3(0, 0, 0);
      var rot = cardBody.rotation || new THREE.Vector3(0, 0, 0);
      cardBody.angvel = new THREE.Vector3(
        ang.x,
        ang.y - (rot.y || 0) * 0.25,
        ang.z
      );
    }

    var gravity = new THREE.Vector3(CONFIG.gravity[0], CONFIG.gravity[1], CONFIG.gravity[2]);
    [j1Body, j2Body, j3Body, cardBody].forEach(function(body) {
      if (body && body.type === 'dynamic' && !isDragging) {
        body.translation.addScaledVector(gravity, delta * 0.5);
        body.translation.multiplyScalar(0.98);
      }
    });
  }

  function animate() {
    animationId = requestAnimationFrame(animate);
    var clock = new THREE.Clock();
    var delta = Math.min(clock.getDelta(), 0.1);
    updatePhysics(delta);
    renderer.render(scene, camera);
  }

  function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Initialize when THREE.js is ready
  function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      CONFIG.fov,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(CONFIG.position[0], CONFIG.position[1], CONFIG.position[2]);

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, CONFIG.dpr));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    var ambientLight = new THREE.AmbientLight(Math.PI);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-5, -5, -7);
    scene.add(directionalLight2);

    var lightPositions = [
      { pos: [0, -1, 5], intensity: 2, color: 0xffffff },
      { pos: [-1, -1, 1], intensity: 3, color: 0xffffff },
      { pos: [1, 1, 1], intensity: 3, color: 0xffffff },
      { pos: [-10, 0, 14], intensity: 10, color: 0xffffff },
    ];
    lightPositions.forEach(function(l) {
      var light = new THREE.PointLight(l.color, l.intensity, 50);
      light.position.set(l.pos[0], l.pos[1], l.pos[2]);
      scene.add(light);
    });

    createPhysicsBodies();
    createCard();
    createBand();
    setupEvents();

    window.addEventListener('resize', onWindowResize);
    animate();

    // Remove loading text after a short delay
    setTimeout(function() {
      var loading = container.querySelector('.lanyard-loading');
      if (loading) loading.style.display = 'none';
    }, 1500);
  }

  // Wait for THREE.js to load (loaded via <head> inject, may be async)
  function waitForThree(retries, delay) {
    if (typeof THREE !== 'undefined') {
      init();
      return;
    }
    if (retries <= 0) {
      console.warn('Lanyard: THREE.js not loaded after waiting');
      return;
    }
    setTimeout(function() {
      waitForThree(retries - 1, delay);
    }, delay);
  }

  waitForThree(100, 50); // 100 retries * 50ms = ~5s max wait
})();
