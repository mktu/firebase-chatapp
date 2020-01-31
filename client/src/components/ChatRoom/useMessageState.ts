import { useContext, useState, useCallback } from 'react';
import ProfileContext from '../../contexts/ProfileContext';
import { Profile } from '../../types/profile';
import { Message } from '../../types/message';
import { addReaction } from '../../services/message';

const useMessageState = (
    profiles : Profile[],
    message : Message,
    roomId : string
) => {
    const { profileState } = useContext(ProfileContext);
    const { profile } = profileState;
    const userSent = profiles.find(p => p.id === message.profileId);
    const amISent = userSent?.id === profile?.id;
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
            ()=>{
                console.log(`add ${reactionId} Succedded`);
            }
        )
    }, [roomId,message.id]);

    return {
        time,
        userSent,
        amISent,
        showEmoAction,
        onHoverReceivedMessage,
        onLeaveReceivedMessage,
        handleAddReaction
    }
};

export default useMessageState;