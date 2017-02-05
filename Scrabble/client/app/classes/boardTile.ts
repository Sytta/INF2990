/**
 * boardTile.ts - describes a tile on the scrabble board
 *
 * @authors Félix Boulet, Pierre To
 * @date 2017/02/05
 */

export type TileType =
    "Basic"
    | "DoubleLetter"
    | "TripleLetter"
    | "DoubleWord"
    | "TripleWord"
    | "Center";

export class BoardTile {
    tileType : TileType;
    letter : any;
    isEmpty = true;
    texture : string;

    constructor(tileType : TileType = "Basic") {
        this.tileType = tileType;
        this.texture = "../../assets/textures/board/" + this.tileType + ".png";
    }

    putLetter(letter : any) : void {
        this.letter = letter;
        this.isEmpty = false;
    }

    // TODO : Add method to count point form a single tile
    /*countPoint() : number {
        if (this.tileType.type === Type.DoubleLetter || this.tileType.type === Type.TripleLetter) {

        }
        return this.letter.value;
    }*/
}
