/**
 * gameEngine.service.ts
 *
 * @authors Félix Boulet
 * @date 2017/03/26
 */

import { Injectable } from '@angular/core';
import { SceneBuilder } from './sceneBuilder.service';
import { GameCamera } from './gameCamera.service';
import { IGameState } from './gameStates/GameState';
import { ChoosingAngleState } from './gameStates/ChoosingAngleState';
import { EndThrowState } from './gameStates/EndThrowState';
import { IdleState } from './gameStates/IdleState';
import { ShootingState } from './gameStates/ShootingState';
import { SweepingState } from './gameStates/SweepingState';

@Injectable()
export class GameEngine {

    private static instance: GameEngine = new GameEngine();

    private container: HTMLElement;
    private scene: THREE.Scene;
    private camera: GameCamera;
    private renderer: THREE.WebGLRenderer;
    private clock: THREE.Clock;

    private gameState: IGameState;

    public static getInstance(): GameEngine {
        return GameEngine.instance;
    }

    private constructor() {
        if (GameEngine.instance) {
            throw new Error("Error: GameEngine is a singleton class, use GameEngine.getInstance() instead of new.");
        }
        GameEngine.instance = this;
    }

    public init(container: HTMLElement): void {
        this.container = container;
        this.createRenderer();
        this.initGameStates();
        this.gameState = IdleState.getInstance();
        this.launchGame();
    }

    public update(): void {
        window.requestAnimationFrame(() => this.update());
        const delta = this.clock.getDelta();
        // TODO: Remove this once physics are re-implemented.
        let sceneData = SceneBuilder.getInstance().getSceneData();
        sceneData.activeStone.update(delta);
        this.camera.followStone(sceneData.activeStone.position, sceneData.rink);
        this.renderer.render(this.scene, this.camera.getCamera());
    }

    // Called when the browser window gets resized
    public onResize(event: any): void {
        this.renderer.setSize(event.target.innerWidth, event.target.innerHeight);
        let containerRect = this.container.getBoundingClientRect();
        // Adjust width and height to real container size
        this.renderer.setSize(containerRect.width, containerRect.height);

        // Adjust camera FOV following aspect ratio
        this.camera.onResize(this.container);
    }

    public switchCamera(): void {
        (this.camera.isUsingPerspectiveCamera()) ?
            this.camera.useOrthographicCamera(this.container) :
            this.camera.usePerspectiveCamera(this.container);
    }

    private createRenderer(): void {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.localClippingEnabled = true;
        this.renderer.physicallyCorrectLights = true;
        this.checkHardwareCapabilities();

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

    // Disable shadows on Intel integrated graphics since it has a large performance hit.
    private checkHardwareCapabilities(): void {
        const gl = this.renderer.getContext();
        const hardware = gl.getExtension('WEBGL_debug_renderer_info');
        const vendor: string = gl.getParameter(hardware.UNMASKED_RENDERER_WEBGL);
        if (vendor.toLowerCase().includes("intel")) {
            this.renderer.shadowMap.enabled = false;
        } else {
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }
    }

    private launchGame(): void {
        let self = this;
        SceneBuilder.getInstance().buildScene()
            .then((scene) => {
                self.scene = scene;
                self.setupCamera();
                // TODO: Move update to the game controller to start rendering.
                self.update();
            }).catch(() => {
                throw new Error("ERROR: Could not build game scene (unresolved promise).");
            });
    }

    private setupCamera(): void {
        this.camera = GameCamera.getInstance();
        this.camera.init(this.container);
    }

    private initGameStates(): void {
        ChoosingAngleState.getInstance().init();
        EndThrowState.getInstance().init();
        IdleState.getInstance().init();
        ShootingState.getInstance().init();
        SweepingState.getInstance().init();
    }
}
