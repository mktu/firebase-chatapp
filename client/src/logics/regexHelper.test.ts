import { findMatches } from './regexHelper';
import { MENTION_REGEX } from '../constants'

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
    expect(matches[0].text).toBe('@target');
    expect(matches[0].start).toBe(9);
    expect(matches[0].end).toBe(16);
});

it('match mention3', () => {
    const matches = findMatches('@you and @me¥r¥n', MENTION_REGEX);
    expect(matches.length).toBe(2);
    expect(matches[0].text).toBe('@you');
    expect(matches[0].start).toBe(0);
    expect(matches[0].end).toBe(4);

    expect(matches[1].text).toBe('@me');
    expect(matches[1].start).toBe(9);
    expect(matches[1].end).toBe(12);
});

it('match mention4', () => {
    const matches = findMatches('@you-and-me test', MENTION_REGEX);
    expect(matches.length).toBe(1);
    expect(matches[0].text).toBe('@you-and-me');
});
