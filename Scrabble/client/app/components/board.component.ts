/**
 * board.component.ts
 *
 * @authors Félix Boulet, Pierre To
 * @date 2017/02/05
 */

import { Component, OnInit } from '@angular/core';
import { BoardTile } from '../classes/boardTile';

@Component({
    selector: 'board-comp',
    template: `
        <div id="board" class="flex-container" fxLayout="row" fxLayout.xs="column"
         fxLayoutAlign="center center" fxLayoutAlign.xs="start">
         <div class="flex-item" fxFlex="100%" fxFlex.xs="100%" fxFlexFill>
          <md-grid-list cols="15" rows="15">
            <div *ngFor="let row of board; let i = index">
              <md-grid-tile *ngFor="let tile of row; let j = index"
              [colspan]="1"
              [rowspan]="1">
                <img src = {{tile.texture}} height = 100% width = 100% id = "scrabbleTile">

              </md-grid-tile>
            </div>
          </md-grid-list>
        </div>
        <!--
            <table>
                <tr *ngFor="let row of board; let i = index">
                    <td *ngFor="let tile of row; let j = index">
                        <img src = {{tile.texture}} height = 100% width = 100%>
                    </td>
                </tr>
            </table>
            -->
        </div>
    `
})

export class BoardComponent implements OnInit {
    board: BoardTile[][];

    ngOnInit() {
        let boardLength = 15;

        this.board = [];

        for (let i = 0; i < boardLength; i++) {
            this.board[i] = [];

            for (let j = 0; j < boardLength; j++) {
                this.board[i][j] = new BoardTile("Basic");
            }
        }

        this.board[7][7] = new BoardTile("Center");

        this.board[0][0] = new BoardTile("TripleWord");
        this.board[0][7] = new BoardTile("TripleWord");
        this.board[0][14] = new BoardTile("TripleWord");
        this.board[7][0] = new BoardTile("TripleWord");
        this.board[7][14] = new BoardTile("TripleWord");
        this.board[14][0] = new BoardTile("TripleWord");
        this.board[14][7] = new BoardTile("TripleWord");
        this.board[14][14] = new BoardTile("TripleWord");

        this.board[1][1] = new BoardTile("DoubleWord");
        this.board[1][13] = new BoardTile("DoubleWord");
        this.board[2][2] = new BoardTile("DoubleWord");
        this.board[2][12] = new BoardTile("DoubleWord");
        this.board[3][3] = new BoardTile("DoubleWord");
        this.board[3][11] = new BoardTile("DoubleWord");
        this.board[4][4] = new BoardTile("DoubleWord");
        this.board[4][10] = new BoardTile("DoubleWord");
        this.board[10][4] = new BoardTile("DoubleWord");
        this.board[10][10] = new BoardTile("DoubleWord");
        this.board[11][3] = new BoardTile("DoubleWord");
        this.board[11][11] = new BoardTile("DoubleWord");
        this.board[12][2] = new BoardTile("DoubleWord");
        this.board[12][12] = new BoardTile("DoubleWord");
        this.board[13][1] = new BoardTile("DoubleWord");
        this.board[13][13] = new BoardTile("DoubleWord");

        this.board[1][5] = new BoardTile("TripleLetter");
        this.board[1][9] = new BoardTile("TripleLetter");
        this.board[5][1] = new BoardTile("TripleLetter");
        this.board[5][5] = new BoardTile("TripleLetter");
        this.board[5][9] = new BoardTile("TripleLetter");
        this.board[5][13] = new BoardTile("TripleLetter");
        this.board[9][1] = new BoardTile("TripleLetter");
        this.board[9][5] = new BoardTile("TripleLetter");
        this.board[9][9] = new BoardTile("TripleLetter");
        this.board[9][13] = new BoardTile("TripleLetter");
        this.board[13][5] = new BoardTile("TripleLetter");
        this.board[13][9] = new BoardTile("TripleLetter");

        this.board[0][3] = new BoardTile("DoubleLetter");
        this.board[0][11] = new BoardTile("DoubleLetter");
        this.board[2][6] = new BoardTile("DoubleLetter");
        this.board[2][8] = new BoardTile("DoubleLetter");
        this.board[3][0] = new BoardTile("DoubleLetter");
        this.board[3][7] = new BoardTile("DoubleLetter");
        this.board[3][14] = new BoardTile("DoubleLetter");
        this.board[6][2] = new BoardTile("DoubleLetter");
        this.board[6][6] = new BoardTile("DoubleLetter");
        this.board[6][8] = new BoardTile("DoubleLetter");
        this.board[6][12] = new BoardTile("DoubleLetter");
        this.board[7][3] = new BoardTile("DoubleLetter");
        this.board[7][11] = new BoardTile("DoubleLetter");
        this.board[8][2] = new BoardTile("DoubleLetter");
        this.board[8][6] = new BoardTile("DoubleLetter");
        this.board[8][8] = new BoardTile("DoubleLetter");
        this.board[8][12] = new BoardTile("DoubleLetter");
        this.board[11][0] = new BoardTile("DoubleLetter");
        this.board[11][7] = new BoardTile("DoubleLetter");
        this.board[11][14] = new BoardTile("DoubleLetter");
        this.board[12][6] = new BoardTile("DoubleLetter");
        this.board[12][8] = new BoardTile("DoubleLetter");
        this.board[14][3] = new BoardTile("DoubleLetter");
        this.board[14][11] = new BoardTile("DoubleLetter");
    }
}
