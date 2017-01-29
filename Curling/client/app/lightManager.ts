
export class LightManager {

    lights: Array<THREE.Light>;
    constructor() {
        console.log("LightManager created successfully.");

    }



}
export class SpotlightArray extends THREE.Group {

    constructor(width: number, length: number, wLights: number, lLights: number, target?: THREE.Object3D) {
        super();
        for (let i = 0; i < lLights; i++) {
            for (let j = 0; j < wLights; j++) {

                let sunlight = new THREE.SpotLight(0xffffff, 0.6);
                sunlight.position.set((width / (wLights - 1)) * j, 5, -i * (length / (lLights - 1)));
                sunlight.penumbra = 0.4;
                this.add(sunlight);
                if (target !== undefined) {
                    this.add(target);
                    sunlight.target = target;
                }
                else {
                    let lightTarget = new THREE.Object3D();
                    lightTarget.position.set((width / (wLights - 1)) * j, 0, -i * (length / (lLights - 1)));
                    this.add(lightTarget);
                    sunlight.target = lightTarget;
                }


            }
        }
    }
}