# Computer Graphics Final Project - Blackhole Simulation

## Project Description
This project aimed to use Three.js and the glsl language to simulate a blackhole in a 3d environment through a browser.
### Technical
I used the LivePreview VsCode extension to spin up a local server to view the render.

## References

### Simulating a Schwarzschild Black Hole: Part 1 — The Background and Raytracer
The following guide served as the core basis of the project: https://medium.com/@cadenmarinozzi/simulating-a-schwarzschild-black-hole-part-1-the-background-and-raytracer-7de436a56b7e

### Simulating a Schwarzschild Black Hole: Part 2 — The Accretion Disk
The following guide served as the core basis of the project: https://medium.com/@cadenmarinozzi/simulating-a-schwarzschild-black-hole-part-2-the-accretion-disk-ff96f677e49c

### Simulating a Schwarzschild Black Hole: Part 3— Adding Texture to the Disk
The following guide served as the core basis of the project: https://medium.com/@cadenmarinozzi/simulating-a-schwarzschild-black-hole-part-3-adding-texture-to-the-disk-7a5725f72808

### fall2025csci445 Gitlab Repository
https://gitlab.com/coloradomesa_cs/csci445fall2025/karl/-/tree/main?ref_type=heads

Took the files folder for the needed three.js files and also pulled orbit.html and orbit.js to use as a base case for testing.

## Development Notes

### Note 1
Found a guide to follow to help get a base idea of a program done. Will ideally modify and experiment with it when the base thing is implemented.

### Note 2
Needed to grab the three.js files from the gitlab repository to have the needed files.

### Note 3
Ran into some issues with MIME errors, but I was able to fix it.

### Note 4
See below for what the texture looks like at time of writing. I think the raytracing implementation is being inverted somehow, doing the opposite of what it needs to be doing.
![Progress photo 1](/progressPhotos/progress1.PNG "progress photo 1")

### Note 5
See below for updated photo. I got the distortion working the way I believe it should be but the background photo that I am using is not in the right position it seems, or maybe the camera position is off.
![Progress photo 2](/progressPhotos/progress2.PNG "progress photo 2")

### Note 6
I am struggling to puzzle out how to move the position of the jpeg so that its centered behind the blackhole from the perspective of the camera. Unless it already is, but the reference photo I see in the guide doesn't match up with what mine is doing.

### Note 7
The camera position and blackhole position are fine, if I am reading this right. The only issue it seems is the position of the space texture, which seems to be towards the top right part of the scene. I think the 8kSpace.jpg file is not being stretched to the scene properly, but I am stuggling to figure out how to fix that.

### Note 8
Well I found an extra renderor.render(scene, camera) that I was supposed to remove that I didn't, but removing it didn't seem to do anything.

### Note 9
We got it working, though I changed the UV mapping to a spherical model.
![Progress photo 3](/progressPhotos/progress3.PNG "progress photo 3")
Here is a version with the brightness multiplied by 10
![Progress photo 4](/progressPhotos/progress4.PNG "progress photo 4")

### Note 10
Followed another guide to add an accretion disk.
![Progress photo 5](/progressPhotos/progress5.PNG "progress photo 5")

### Note 11
Added a uTime uniform to allow me to have the background space texture move and add an illusion of motion. I also am using uTime as part of the accretion disk render, to give the disk a subtle illusion of motion. Its not perfect, but it does add a bit more visual interest.