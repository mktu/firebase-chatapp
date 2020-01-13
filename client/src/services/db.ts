import {CollectionTransfer} from '../types/core';
export function getCollectionListener<T>(
    onAdded: CollectionTransfer<T>,
    onModified: CollectionTransfer<T>,
    onDeleted: CollectionTransfer<T>
) {
    return function (querySnapshot: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) {
        let added: T[] = [];
        let modified: T[] = [];
        let deleted: T[] = [];
        for (let change of querySnapshot.docChanges()) {
            const data = change.doc.data() as T;
            const room = {
                ...data,
                id: change.doc.id
            };
            if (change.type === 'added') { // !! includes initial snapshot
                added.push(room);
            }
            else if (change.type === 'modified') {
                modified.push(room);
            }
            else if (change.type === 'removed') {
                deleted.push(room)
            }
        }
        if (added.length > 0) {
            onAdded(added);
            return;
        }
        if (modified.length > 0) {
            onModified(modified);
            return;
        }
        if (deleted.length > 0) {
            onDeleted(deleted);
            return;
        }
        onAdded(added);
    }
}