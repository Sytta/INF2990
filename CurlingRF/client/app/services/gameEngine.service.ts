/**
 * gameEngine.service.ts
 *
 * @authors Félix Boulet
 * @date 2017/03/26
 */

import { SceneBuilder } from './sceneBuilder.service';

export class GameEngine {

    private static instance: GameEngine = new GameEngine();
    private container: HTMLElement;
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
    private clock: THREE.Clock;

    public static getInstance(): GameEngine {
        return GameEngine.instance;
    }

    constructor() {
        if (GameEngine.instance) {
            throw new Error("Error: GameEngine is a singleton class, use GameEngine.getInstance() instead of new.");
        }
        GameEngine.instance = this;
    }

    public init(container: HTMLElement): void {
        this.container = container;
        this.createRenderer();
        this.loadScene();
        // TODO: Move update to the game controller to start rendering.
        this.update();
    }

    public update(): void {
        window.requestAnimationFrame(() => this.update());
        const delta = this.clock.getDelta();
    }

    private createRenderer(): void {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.localClippingEnabled = true;
        if (this.container !== undefined) {
            if (this.container.getElementsByTagName('canvas').length === 0) {
                this.container.appendChild(this.renderer.domElement);
            }
        }
        else {
            document.body.appendChild(this.renderer.domElement);
            this.container = document.body;
        }

        let containerRect = this.container.getBoundingClientRect();
        // Adjust width and height to real container size
        this.renderer.setSize(containerRect.width, containerRect.height);
        this.clock = new THREE.Clock();
    }

    private loadScene(): void {
        let self = this;
        SceneBuilder.getInstance().buildScene()
            .then((scene) => {
                self.scene = scene;
            }).catch(() => {
                throw new Error("ERROR: Could not build game scene (unresolved promise).");
            });
    }
}
