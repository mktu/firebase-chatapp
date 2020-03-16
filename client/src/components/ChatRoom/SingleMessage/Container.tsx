import React, { useMemo,useContext, useState, useCallback } from 'react';
import ListItem from '@material-ui/core/ListItem';
import * as Presenters from './Presenters';
import { Profile } from '../../../../../types/profile';
import { Message } from '../../../../../types/message';
import ProfileContext from '../../../contexts/ProfileContext';
import { addReaction } from '../../../services/message';

const Container: React.FC<{
    className?: string,
    roomId: string,
    profiles: Profile[],
    message: Message
}> = React.forwardRef(({
    className,
    profiles,
    message,
    roomId
}, ref: any) => {

    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;
    const sender = profiles.find(p => p.id === message.profileId);
    const amISender = sender?.id === profile!.id;
    const date = new Date(message.date);
    const time = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    const [showEmoAction, setShowEmoAction] = useState(false);

    const onHoverReceivedMessage = useCallback(() => {
        setShowEmoAction(true);
    }, []);
    const onLeaveReceivedMessage = useCallback(() => {
        setShowEmoAction(false);
    }, []);

    const handleAddReaction = useCallback((reactionId:string) => {
        addReaction(
            roomId,
            message.id,
            reactionId,
            profile!.id,
            ()=>{
                console.log(`add ${reactionId} Succedded`);
            }
        )
    }, [roomId,message.id,profile]);

    const reactions : {[s:string]:string[]} = useMemo(()=>{
        const reactionsBase = message.reactions || {};
        const keys = Object.keys(reactionsBase);
        return keys.reduce<{[s:string]:string[]}>((acc,cur)=>{
            const profileIds =  reactionsBase[cur];
            const profilesNames = profileIds.map(id=>{
                const profile = profiles.find(p=>p.id===id);
                return profile?.nickname || 'Unknown';
            });
            acc[cur] = profilesNames;
            return acc;
        },{});
    },[message.reactions,profiles]);

return useMemo(() =>
    (
        <ListItem className={className} ref={ref}>
            {amISender ? (
                <Presenters.SentMessage
                    time={time}
                    handleAddReaction={handleAddReaction}
                    sender={sender!.nickname}
                    message={message.message}
                    reactions={reactions}
                />
            ) : (
                    <Presenters.ReceivedMessage
                        time={time}
                        onHoverReceivedMessage={onHoverReceivedMessage}
                        onLeaveReceivedMessage={onLeaveReceivedMessage}
                        handleAddReaction={handleAddReaction}
                        sender={sender?.nickname || 'Unknown'}
                        message={message.message}
                        reactions={reactions}
                        showEmoAction={showEmoAction}
                    />
                )}
        </ListItem >
    ), [
    message,
    amISender,
    className,
    reactions,
    onHoverReceivedMessage,
    onLeaveReceivedMessage,
    showEmoAction,
    handleAddReaction,
    time,
    sender,
    ref
])
});

export default Container;