(function ($) {
  $(document).ready(function () {
    var container,
      container_w,
      container_h,
      container_id = 'viz_histogram_container',
      canvas_id = 'viz_histogram_canvas',
      renderer,
      scene,
      camera,
      material,
      geometry,
      mesh,
      fov = 60;
    var mousePosition = {
      x: 1.0,
      y: 1.0,
    };
    var time = 0;
    var meshes = [];
    var w = window.innerWidth;
    var h = window.innerHeight;

    var barRowCount = 20;
    var barColCount = 20;
    var barSize = 0.6;
    var spacer = 8;

    var isFocused = true;
    /* $(window).on('blur', function() {
      isFocused = false;
    });
    $(window).on('focus', function() {
      isFocused = true;
      render();
    }); */

    init();

    function interpolateShader(glsl) {
      return glsl.replace(/\/\/\s?addFragment\(\s?(\w+)\s?\);/g, function (a, b) {
        if (!THREE.ShaderChunk[b]) {
          throw new Error('Could not find chunk "' + b + '"');
        }
        return THREE.ShaderChunk[b] + '\n';
      });
    }

/*     document.onkeydown = function (e) {
      e.preventDefault();
      if (e.keyCode === 81) {             // 1
        camera.position.x -= 1
      } else if (e.keyCode === 87) {             // 1
        camera.position.x += 1
      } else if (e.keyCode === 65) {             // 1
        camera.position.y -= 1
      } else if (e.keyCode === 83) {             // 1
        camera.position.y += 1
      } else if (e.keyCode === 90) {             // 1
        camera.position.z -= 1
      } else if (e.keyCode === 88) {             // 1
        camera.position.z += 1
      }
      camera.lookAt(scene.position);
      console.log('x:' + camera.position.x + ', y:' + camera.position.y + ', z:' + camera.position.z);
    }; */

    function init() {
      container = document.getElementById(container_id);
      if(!container) return;
      
      container_w = container.offsetWidth;
      container_h = container.offsetHeight;

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(60, container_w / container_h, 0.01, 1000);
      camera.position.x = 18;
      camera.position.y = -148;
      camera.position.z = -80;
      // camera.position.x = 10;
      // camera.position.y = -105;
      // camera.position.z = -50;
      camera.lookAt(scene.position);
      scene.add(camera);

      material = new THREE.ShaderMaterial({
        uniforms: {
          u_mousePosition: {
            type: 'v2',
            value: new THREE.Vector2(mousePosition.x, mousePosition.y),
          },
          u_dimensions: {
            type: 'v2',
            value: new THREE.Vector2(container_w, container_h),
          },
          u_multiplier: {
            value: w < 800 ? 1 : 1.5,
          },
        },
        fragmentShader: $('#fragmentShader').text(),
        vertexShader: $('#vertexShader').text(),
        side: THREE.DoubleSide,
      });


      for (var i = 0; i < barRowCount * barColCount; i++) {
        var barGeometry = new THREE.BoxGeometry(barSize, barSize, 15);
        var barMesh = new THREE.Mesh(barGeometry, material);

        var currentRow = i % barRowCount;
        var currentCol = Math.floor(i / barColCount);

        var x = currentRow * spacer - barRowCount * (spacer / 2);
        var y = currentCol * spacer - barColCount * (spacer / 2);
        var z = Math.sin(time + i) * 5;
        barMesh.position.set(x, y, z);
        meshes.push(barMesh);

        scene.add(barMesh);
      }

      var floorGeometry = new THREE.PlaneGeometry(200, 200, 200);
      var floorMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color('rgb(0,0,0)'),
      });
      var floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
      floorMesh.position.z = -1;

      scene.add(floorMesh);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(container_w, container_h);
      renderer.setClearAlpha(0.0);
      renderer.domElement.id = canvas_id;
      container.appendChild(renderer.domElement);

      window.addEventListener('resize', onWindowResize, false);

      render();
    }

    function onWindowResize() {
      // w = window.innerWidth;
      // h = window.innerHeight;
      // renderer.setSize(w, h);

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      material.uniforms.u_dimensions.value = new THREE.Vector2(w, h);
    }

    var handleTouchMove = function (e) {
      var touch = e.touches[0];
      mousePosition.x = touch.pageX / w;
      mousePosition.y = touch.pageY / h;
    };
    var handleMouseMove = function (e) {
      mousePosition.x = e.pageX / w;
      mousePosition.y = e.pageY / h;
    };
    if ('ontouchstart' in window) {
      $(document.body).on('touchmove', handleTouchMove);
    } else {
      $(document.body).on('mousemove', handleMouseMove);
    }

    function render() {
      if (isFocused) {
        requestAnimationFrame(render);
        time += 0.035;
        material.uniforms.u_mousePosition.value = new THREE.Vector2(
          mousePosition.x,
          mousePosition.y
        );

        meshes.forEach(function (m, i) {
          var normalizedCurrentRow = (i % barRowCount) / barRowCount;
          var normalizedCurrentCol =
            Math.floor(i / barColCount) / barColCount;

          var dx = Math.abs(mousePosition.x - normalizedCurrentRow);
          var dy = Math.abs(1 - mousePosition.y - normalizedCurrentCol);

          var effect = (1 - dx) * (1 - dy) * 10;
          var z = -8.8 + (2 * Math.sin(time + i / 3) + 1.2) / 0.5 + effect;
          m.position.z = z;
          m.scale.z = z / 8;
        });

        renderer.render(scene, camera);
      }
    }

  });

  VANTA.DOTS({
    el: ".banner_top",
    mouseControls: true,
    touchControls: true,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    color: 0x5350a5,
    color2: 0xf007d9,
    backgroundColor: 0x0,
    spacing: 31.00,
    showLines: false
  })

})(jQuery);