
    import * as three from 'three';
    import { OrbitControls } from 'three/addons/OrbitControls.js';

    let camera, scene, renderer,controls;
    const textureLoader=new three.TextureLoader();

    const moon = textureLoader.load('./moon.jpg');
    const moonMat = new three.MeshBasicMaterial({ map: moon });
    const moonObj= new three.SphereGeometry( 0.5, 32, 16 ); 
 
    const NumMoons=10;
    const accelerations=[];
    const velocities=[];
    var positions=[];
 
    let time=0.0;

    function init() {
        let can=document.getElementById('area');
        camera = new three.PerspectiveCamera( 70, 1.0, 0.1, 100 );
        camera.position.z = 10;

        scene = new three.Scene();
        for (let i=0;i<NumMoons;i++) {
            accelerations.push(new three.Vector3());
            velocities.push(new three.Vector3());
            let x=Math.random()*10.0-5.0;
            let y=Math.random()*10.0-5.0;
            let z=Math.random()*10.0-5.0;
            let moonMesh = new three.Mesh( moonObj, moonMat );
            positions.push(moonMesh.position.set(x,y,z));
            scene.add(moonMesh);
        }        

        renderer = new three.WebGLRenderer( { antialias: true,canvas:can }  );
        renderer.setAnimationLoop( animate );
        controls = new OrbitControls( camera, renderer.domElement );
       
        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.minDistance = 1;
        controls.maxDistance = 10;
    }

    var dt=0.01;
    function animate() {
        controls.update();
        renderer.render( scene, camera );
        for (let i=0;i<positions.length;i++){
            let total=new three.Vector3();
            for (let j=0;j<positions.length;j++){
              if (i!=j) {
                 let v=new three.Vector3();
                 v.subVectors(positions[j],positions[i]);
                 let pull=v.lengthSq();
                 if (pull>=1) {
                    v.divideScalar(pull);
                    total.addVectors(total,v); // total=total+v;
                 }
              }
            }
            accelerations[i]=total;
        }
        for (let i=0;i<positions.length;i++){
            let a=accelerations[i].clone();
            a.multiplyScalar(dt);
            let v=velocities[i].clone();
            v.multiplyScalar(dt);
            velocities[i].addVectors(velocities[i],a);
            positions[i].addVectors(positions[i],v);
        }
        time+=dt;
    }

    window.onload=init();
