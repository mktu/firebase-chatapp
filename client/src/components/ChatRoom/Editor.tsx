import React, { useState, useCallback, useEffect } from 'react';
import {
    Editor,
    EditorState,
    ContentBlock,
    ContentState,
    CompositeDecorator,
    CharacterMetadata,
    Modifier
} from 'draft-js';
import { LinkPreview } from '../LinkPreview';

const connectLinkComponent = () => {
    const Link: React.FC<{
        contentState: ContentState,
        entityKey: string
    }> = ({ contentState, entityKey, children }) => {

        const { url } = contentState.getEntity(entityKey).getData();
        
        return (
            <React.Fragment>
                <a href={url}>
                    {children}
                </a>
                <LinkPreview url={url}/>
            </React.Fragment>
        );
    };
    return Link;
}


function findLinkEntities(
    contentBlock: ContentBlock,
    callback: (start: number, end: number) => void,
    contentState: ContentState
) {
    contentBlock.findEntityRanges(
        (character: CharacterMetadata) => {
            const entityKey = character.getEntity();
            return (
                entityKey !== null &&
                contentState.getEntity(entityKey).getType() === 'LINK'
            );
        },
        callback
    );
}

const ChatEditor = ({
    notifyTextChanged,
    onMounted
}: {
    notifyTextChanged: (text: string) => void,
    onMounted : (
        inserter : (characters:string)=>void,
        initializer : ()=>void
        )=>void
}) => {

    const constructDecorator = useCallback(() => {
        return new CompositeDecorator([
            {
                strategy: findLinkEntities,
                component: connectLinkComponent(),
            },
        ]);
    }, []);

    const [editorState, setEditorState] = useState(
        EditorState.createEmpty(constructDecorator())
    );

    const onChange = (editorState: EditorState) => {
        setEditorState(editorState);
        notifyTextChanged(editorState.getCurrentContent().getPlainText());
    }

    useEffect(()=>{
        onMounted((characters)=>{
            const selectionState = editorState.getSelection();
            const newContentState = Modifier.insertText(editorState.getCurrentContent(),selectionState,characters);
            const newEditorState = EditorState.set(editorState, { currentContent: newContentState });
            setEditorState(newEditorState);
        },()=>{
            setEditorState(EditorState.createEmpty(constructDecorator()));
        })
    },[onMounted,setEditorState,editorState,constructDecorator]);

    return (<Editor
        editorState={editorState}
        onChange={onChange}
    />)
}

export { ChatEditor }