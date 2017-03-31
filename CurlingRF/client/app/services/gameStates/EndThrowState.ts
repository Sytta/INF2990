/**
 * EndThrowState.ts
 *
 * @authors Pierre To
 * @date 2017/03/22
 */

import { IGameState } from './GameState';
import { IdleState } from './IdleState';
import { GameController } from '../gameController.service';
import { GameEngine } from '../gameEngine.service';
import { SceneBuilder } from '../sceneBuilder.service';

export class EndThrowState implements IGameState {

    private static instance: EndThrowState = new EndThrowState();
    private gameController: GameController;
    private stonesThrown: number;

    public static getInstance(): EndThrowState {
        return EndThrowState.instance;
    }

    public init(gameController: GameController): void {
        this.gameController = gameController;
    }

    private constructor() {
        if (EndThrowState.instance) {
            throw new Error("Error: EndThrowState " +
                "is a singleton class, use EndThrowState.getInstance() instead of new.");
        }
        EndThrowState.instance = this;
    }

    public onMouseDown(event: any): void {
        if (this.gameController.getHUDData().nextThrowMessageVisible) {
            this.gameController.getGameData().state = this.nextState();
        }

        if (this.gameController.getHUDData().nextRoundMessageVisible) {
            this.gameController.getHUDData().nextRoundMessageVisible = false;
        }
    }

    public onMouseUp(event: any): void {
        // Do nothing
    }

    public onMouseMove(event: any): void {
        // Do nothing
    }

    public onKeyboardDown(event: KeyboardEvent): void {
        if (event.key === " ") { // Spacebar
            if (this.gameController.getHUDData().nextThrowMessageVisible) {
                this.gameController.getGameData().state = this.nextState();
            }

            if (this.gameController.getHUDData().nextRoundMessageVisible) {
                this.gameController.startNextRound();
            }
        }
    }

    public update(delta: number): void {
        // Do nothing
    }

    public enterState(): EndThrowState {
        this.stonesThrown++;
        let hudData = this.gameController.getHUDData();
        hudData.forceVisible = false;
        let gameData = this.gameController.getGameData();
        gameData.isPlayerTurn = !gameData.isPlayerTurn;

        this.highlightStonesWorthPoints();
        return this;
    }

    public nextState(): IdleState {

        this.gameController.getHUDData().nextThrowMessageVisible = false;
        this.gameController.getHUDData().nextRoundMessageVisible = false;

        return IdleState.getInstance().enterState();
    }

    // Highlight stones that are currently worth points
    private highlightStonesWorthPoints(): void {

        let curlingStones = GameEngine.getInstance().getStones();
        let rings = SceneBuilder.getInstance().getRinkData().rings;

        if (curlingStones.length > 0) {

            let teamClosestStone = curlingStones[0].getTeam();
            let index = 0;

            const ringsCenter = new THREE.Vector3(0, 0, rings.offset);

            while (curlingStones.length > index &&
                curlingStones[index].getTeam() === teamClosestStone &&
                curlingStones[index].position.distanceTo(ringsCenter) < rings.outer) {

                curlingStones[index++].highlightOn();
            }
        }
    }

    private startNextRound() {
        let curlingStones = GameEngine.getInstance().getStones();
        curlingStones.forEach(stone => {
            GameEngine.getInstance().removeFromScene(stone);
        });

        curlingStones = [];
        this.gameController.getHUDData().playerStones = new Array<number>(this.gameController.getMaxThrows() / 2);
        this.gameController.getHUDData().aiStones = new Array<number>(this.gameController.getMaxThrows() / 2);

        // Go to end game´
        const gameData = this.gameController.getGameData();
        if (this.stonesThrown === this.gameController.getMaxThrows() && gameData.roundsCompleted[1]) {
            // this.endGame();
        } else if (this.stonesThrown === this.gameController.getMaxThrows()) { // Go to next round
            // this.updateScore();
            // this.showNextRoundMessage = true;
        } else if (this.stonesThrown > 0) { // Go to next throw
            // this.showNextThrowMessage = true;
        }
    }
}
