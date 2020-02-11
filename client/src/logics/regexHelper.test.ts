import { findMatches, buildMatchInfo } from './regexHelper';
import { MENTION_REGEX } from '../constants'

describe('findMentions', () => {
    it('match mention', () => {
        const matches = findMatches('@Target this is test', MENTION_REGEX);
        expect(matches.length).toBe(1);
        expect(matches[0].text).toBe('@Target');
        expect(matches[0].start).toBe(0);
        expect(matches[0].end).toBe(7);
    });

    it('match mention2', () => {
        const matches = findMatches('I am the @target', MENTION_REGEX);
        expect(matches.length).toBe(1);
        expect(matches[0].text).toBe(' @target');
        expect(matches[0].start).toBe(8);
        expect(matches[0].end).toBe(16);
    });

    it('match mention3', () => {
        const matches = findMatches('@you and @me¥r¥n', MENTION_REGEX);
        expect(matches.length).toBe(2);
        expect(matches[0].text).toBe('@you');
        expect(matches[0].start).toBe(0);
        expect(matches[0].end).toBe(4);

        expect(matches[1].text).toBe(' @me');
        expect(matches[1].start).toBe(8);
        expect(matches[1].end).toBe(12);
    });

    it('match mention4', () => {
        const matches = findMatches('@you-and-me test', MENTION_REGEX);
        expect(matches.length).toBe(1);
        expect(matches[0].text).toBe('@you-and-me');
    });
})

describe('buildMatchInfo', ()=>{
    it('build simple pattern', ()=>{
        const ret = buildMatchInfo('@Target this is test', MENTION_REGEX);
        expect(ret.length).toBe(2);
        expect(ret[0].text).toBe('@Target');
        expect(ret[0].matched).toBeTruthy();
        expect(ret[1].text).toBe(' this is test');
        expect(ret[1].matched).toBeFalsy();
    })
    it('build mention in middle', ()=>{
        const ret = buildMatchInfo('Hey @Target this is test', MENTION_REGEX);
        expect(ret.length).toBe(3);
        expect(ret[0].text).toBe('Hey');
        expect(ret[0].matched).toBeFalsy();
        expect(ret[1].text).toBe(' @Target');
        expect(ret[1].matched).toBeTruthy();
        expect(ret[2].text).toBe(' this is test');
        expect(ret[2].matched).toBeFalsy();
    })
    it('build mention in last', ()=>{
        const ret = buildMatchInfo('I am the @target', MENTION_REGEX);
        expect(ret.length).toBe(2);
        expect(ret[0].text).toBe('I am the');
        expect(ret[0].matched).toBeFalsy();
        expect(ret[1].text).toBe(' @target');
        expect(ret[1].matched).toBeTruthy();
    })

    it('build multiple mentions', ()=>{
        const ret = buildMatchInfo('@you¥r¥nand @me', MENTION_REGEX);
        expect(ret.length).toBe(3);
        expect(ret[0].text).toBe('@you');
        expect(ret[0].matched).toBeTruthy();
        expect(ret[1].text).toBe('¥r¥nand');
        expect(ret[1].matched).toBeFalsy();
        expect(ret[2].text).toBe(' @me');
        expect(ret[2].matched).toBeTruthy();
    })
});
