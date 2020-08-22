import { checkContactMatch } from '.';

describe('checkContains', () => {
    it('match contacts', () => {
        const contacts = ['abcde', 'efgh']
        const room = {
            roomName: 'test',
            ownerId: 'testOwner',
            users: [],
            contact: ['efgh','abcde'],
            id: 'test'
        }
        const hasMatch = checkContactMatch(room,contacts);
        expect(hasMatch).toBeTruthy()
    });
    it('not match contacts2', () => {
        const contacts = ['abcde', 'efgh']
        const room = {
            roomName: 'test',
            ownerId: 'testOwner',
            users: [],
            contact: ['abcde','abcde'],
            id: 'test'
        }
        const hasMatch = checkContactMatch(room,contacts);
        expect(hasMatch).toBeFalsy()
    });
    it('not match contacts', () => {
        const contacts = ['abcde', 'efgh']
        const room = {
            roomName: 'test',
            ownerId: 'testOwner',
            users: [],
            contact: ['abcde','12345'],
            id: 'test'
        }
        const hasMatch = checkContactMatch(room,contacts);
        expect(hasMatch).toBeFalsy()
    });
    

})