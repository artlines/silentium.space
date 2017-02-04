(function () {
    var container;

    // scene size
    var WIDTH = window.innerWidth;
    var HEIGHT = window.innerHeight;

    var camera, scene, renderer;

    var cubeCamera2, textureCube;
    var cameraResolution = 512;

    if(location.search.indexOf('cam') != -1) {
        cameraResolution = location.search.slice(location.search.indexOf('cam') + 4, location.search.length);
    }

    var fov = 60,
        isUserInteracting = false,
        onMouseDownMouseX = 0, onMouseDownMouseY = 0,
        lon = 90, onMouseDownLon = 0,
        lat = 0, onMouseDownLat = 0,
        phi = 0, theta = 0;

    var r = "../img/";

    var urls = [
        r + "cube_1.jpg", r + "cube_3.jpg",
        r + "cube_4.jpg", r + "cube_5.jpg",
        r + "cube_0.jpg", r + "cube_2.jpg",
    ];

    textureCube = new THREE.CubeTextureLoader().load(urls);

    var textureLoader = new THREE.TextureLoader();

    textureLoader.load('../img/Ocean.jpg', function () {
        init();
        animate();
    });


    function init() {
        container = document.getElementById('container');

        // RENDERER
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(WIDTH, HEIGHT);

        renderer.domElement.style.position = "relative";

        container.appendChild(renderer.domElement);


        // camera

        camera = new THREE.PerspectiveCamera(fov, WIDTH / HEIGHT, 1, 1000);

        scene = new THREE.Scene();
        scene.background = textureCube;

        cubeCamera2 = new THREE.CubeCamera(1, 100, cameraResolution);

        cubeCamera2.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
        scene.add(cubeCamera2);

        material = new THREE.MeshBasicMaterial({
            envMap: textureCube
        });

        material1 = new THREE.MeshBasicMaterial({
            reflectivity: 0.7,
            refractionRatio: 0.3,
            envMap: textureCube,
            metalness: 0.5,
            roughness: 0.3
        });

        createScene();

        document.addEventListener('mousedown', onDocumentMouseDown, false);

        window.addEventListener('resize', onWindowResized, false);

    }

    function onWindowResized() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.projectionMatrix.makePerspective(fov, window.innerWidth / window.innerHeight, 1, 1100);
    }

    function onDocumentMouseDown(event) {

        event.preventDefault();

        onPointerDownPointerX = event.clientX;
        onPointerDownPointerY = event.clientY;

        onPointerDownLon = lon;
        onPointerDownLat = lat;

        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('mouseup', onDocumentMouseUp, false);

    }

    function onDocumentMouseMove(event) {
        lon = ( event.clientX - onPointerDownPointerX ) * 0.1 + onPointerDownLon;
        lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
    }

    function onDocumentMouseUp() {
        document.removeEventListener('mousemove', onDocumentMouseMove, false);
        document.removeEventListener('mouseup', onDocumentMouseUp, false);

    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {

        lon += .01;

        lat = Math.max(-85, Math.min(85, lat));
        phi = THREE.Math.degToRad(90 - lat);
        theta = THREE.Math.degToRad(lon);

        camera.position.x = 100 * Math.sin(phi) * Math.cos(theta);
        camera.position.y = 100 * Math.cos(phi);
        camera.position.z = 100 * Math.sin(phi) * Math.sin(theta);

        camera.lookAt(scene.position);

        cubeCamera2.updateCubeMap(renderer, scene);

        renderer.render(scene, camera);
    }


    function createScene() {

        // TEXT

        var loader = new THREE.FontLoader();
        loader.load('../fonts/Source Sans Pro_Regular.json', function (font) {

            var textGeo = new THREE.TextGeometry("ТИШИНА", {
                font: font,
                size: 32,
                height: 0.5,
                curveSegments: 40
            });

            textGeo.computeBoundingBox();
            var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

            var textMaterial = new THREE.MeshBasicMaterial({
                envMap: cubeCamera2.renderTarget.texture
            });

            var mesh = new THREE.Mesh(textGeo, textMaterial);

            mesh.position.x = centerOffset;
            mesh.position.y = -15;
            mesh.position.z = 0;

            mesh.rotation.x = 0;
            mesh.rotation.y = Math.PI * 2;

            group = new THREE.Group();
            group.add(mesh);

            scene.add(group);

        });
    }
})();