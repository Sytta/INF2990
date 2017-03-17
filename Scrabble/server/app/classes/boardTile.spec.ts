/**
 * boardTile.spec.ts
 *
 * @authors Yawen Hou et Pierre To
 * @date 2017/03/15
 */

import { BoardTile } from './boardTile';
import { Letter } from './letter';

import { expect } from 'chai';

describe('BoardTile', () => {


    describe('Default constructor', () => {
        it('should construct a BoardTile object.', done => {
            let boardTile = new BoardTile("Basic");
            expect(boardTile).to.not.be.undefined;
            expect(boardTile).to.be.an.instanceOf(BoardTile);
            expect(boardTile.getTileType()).to.be.equal("Basic");
            expect(boardTile.isEmpty()).to.be.true;
            done();
        });
    });

    describe('putLetter()', () => {
        it('should put a Letter on a BoardTile object.', done => {
            let boardTile = new BoardTile("Basic");
            let letter = new Letter("A");
            boardTile.putLetter(letter);

            expect(boardTile.getLetter()).to.equal(letter);
            done();
        });
    });

    describe('countPoint()', () => {
        it('should return twice the value of the letter on a DoubleLetter tile.', done => {
            let boardTile = new BoardTile("DoubleLetter");
            let letter = new Letter("A");
            boardTile.putLetter(letter);

            expect(boardTile.countTilePoint()).to.equal(2);
            // Bonus desactive
            expect(boardTile.countTilePoint()).to.equal(1);
            done();
        });
        it('should return three times the value of the letter on a TripleLetter tile.', done => {
            let letter = new Letter("A");
            let boardTile = new BoardTile("TripleLetter");
            boardTile.putLetter(letter);

            expect(boardTile.countTilePoint()).to.equal(3);
            // Bonus desactive
            expect(boardTile.countTilePoint()).to.equal(1);
            done();
        });
    });
});