import { useContext, useState, useMemo, useCallback } from 'react';
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
    const amISent = userSent?.id === profile!.id;
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
                return profile!.nickname;
            });
            acc[cur] = profilesNames;
            return acc;
        },{});
    },[message.reactions,profiles]);

    return {
        time,
        userSent,
        amISent,
        showEmoAction,
        onHoverReceivedMessage,
        onLeaveReceivedMessage,
        handleAddReaction,
        reactions
    }
};

export default useMessageState;