import {CollectionTransfer,DocumentTransfer} from '../../../types/core';
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
            const target = {
                id: change.doc.id,
                ...data
            };
            if (change.type === 'added') { // !! includes initial snapshot
                added.push(target);
            }
            else if (change.type === 'modified') {
                modified.push(target);
            }
            else if (change.type === 'removed') {
                deleted.push(target)
            }
        }
        if (added.length > 0) {
            onAdded(added);
        }
        if (modified.length > 0) {
            onModified(modified);
        }
        if (deleted.length > 0) {
            onDeleted(deleted);
        }
        if(added.length===0 && modified.length===0 && deleted.length===0){
            onAdded(added); // initialize
        }
    }
}

export function getDocumentListener<T>(
    onModified: DocumentTransfer<T>
){
    return function (doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>) {
        if(doc.exists){
            const data = doc.data() as T;
            onModified({
                id : doc.id,
                ...data
            });
        }
    }
}