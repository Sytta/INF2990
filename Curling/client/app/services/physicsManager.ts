import { Injectable } from '@angular/core';
import { CurlingStone } from '../entities/curlingStone';

@Injectable()
export class PhysicsManager {

    // Everything is in meters, meters per second, and m/s²
    // TODO use weight directly instead of mass?
    readonly GRAVITY_N_PER_KG = 9.81;
    readonly COEFFICIENT_OF_FRICTION = 0.0168;
    readonly FRICTION_MAGNITUDE = this.GRAVITY_N_PER_KG * this.COEFFICIENT_OF_FRICTION;
    readonly CURVE_ANGLE = Math.PI / 300;
    private curlingStones: CurlingStone[] = new Array();
    private delta: number;

    constructor() {
        //TODO: Make constructor related calls (create Curling stones?)
        this.curlingStones = new Array() as Array<CurlingStone>;
    }

    addStone(curlingStone: CurlingStone) {
        this.curlingStones.push(curlingStone);
    }

    getStones(): Array<CurlingStone> {
        return this.curlingStones;
    }

    update(delta: number): void {
        this.delta = delta;
        // Collision
        this.updateCollidingStonesDirection();
        this.updateAllStonesPosition();
        //TODO: Add physics logic to calculate stone position, friction, etc.
        //TODO: Call update() in renderer game loop
        //TODO: Collision detection should be called here instead of GameRenderer
    }

    private updateCollidingStonesDirection(): void {
        for (let i = 0; i < this.curlingStones.length; i++) {
            for (let j = i + 1; j < this.curlingStones.length; j++) {
                let vec = this.calculateVectorLinkingBothStones(i, j);

                if (vec.length() !== 0 && vec.length() < CurlingStone.MAX_RADIUS * 2) {
                    this.calculateCollision(i, j, vec);
                    this.separateStones(i, j);
                }
            }
        }
    }

    private calculateCollision(idStone1: number, idStone2: number, normalCollisionPlane: THREE.Vector3) {
        let speedStonei = this.curlingStones[idStone1].velocity.clone();
        let speedStonej = this.curlingStones[idStone2].velocity.clone();

        //Use vector calculations to determine the velocity of each stone
        //on the tangent and normal axis to the collision plane.
        let normali = speedStonei.clone().projectOnVector(normalCollisionPlane);
        let normalj = speedStonej.clone().projectOnVector(normalCollisionPlane);
        let tangenti = speedStonei.clone().sub(normali);
        let tangentj = speedStonej.clone().sub(normalj);
        this.curlingStones[idStone1].velocity = tangenti.clone().add(normalj);
        this.curlingStones[idStone2].velocity = tangentj.clone().add(normali);
    }

    private separateStones(idStone1: number, idStone2: number) {
        do {
            this.updateCurlingStonePosition(this.curlingStones[idStone1], 0.01);
            this.updateCurlingStonePosition(this.curlingStones[idStone2], 0.01);
        } while (this.calculateVectorLinkingBothStones(idStone1, idStone2).length() < CurlingStone.MAX_RADIUS * 2);
    }

    // Calculate the vector from the center of the first circle and the center of the second circle
    private calculateVectorLinkingBothStones(idStone1: number, idStone2: number): THREE.Vector3 {
        return this.curlingStones[idStone1].position.clone().sub(this.curlingStones[idStone2].position);
    }

    private updateAllStonesPosition(): void {
        this.curlingStones.forEach(stone => {
            this.updateCurlingStonePosition(stone);
        });
    }

    private updateCurlingStonePosition(stone: CurlingStone, separationCorrection?: number) {
        if (separationCorrection === undefined) {
            if (stone.isBeingPlayed) {
                //Curve calculation only for the stone that was thrown
                let curvedVelocity = stone.velocity.clone();
                curvedVelocity.x = Math.cos(this.delta * this.CURVE_ANGLE) * stone.velocity.x
                    + Math.sin(this.delta * this.CURVE_ANGLE) * stone.velocity.z;
                curvedVelocity.z = -Math.sin(this.delta * this.CURVE_ANGLE) * stone.velocity.x
                    + Math.cos(this.delta * this.CURVE_ANGLE) * stone.velocity.z;
                stone.velocity = curvedVelocity.clone();
            }

            //TODO: Check if stone is on a brushed ice area, if so, reduce friction by a certain factor.
            stone.velocity.sub((stone.velocity.clone().normalize()
                .multiplyScalar(this.FRICTION_MAGNITUDE * this.delta)));
            stone.position.add((stone.velocity.clone().multiplyScalar(this.delta)));
        }
        else {
            //For stone separation
            stone.position.add(stone.velocity.clone().multiplyScalar(separationCorrection * this.delta));
        }

    }
}
