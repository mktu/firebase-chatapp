import React from 'react';
import Loader, {Props as LoaderProps} from './Loader';
import InactiveRoom, {Props as InactiveRoomProps} from './InactiveRoom';

type Props = LoaderProps & InactiveRoomProps;

const Entry: React.FC<Props> = (props) => {
    
    if (props.room.disabled) {
        return <InactiveRoom room={props.room} show={props.show} onClose={props.onClose}/>;
    }
    return <Loader
        {...props}
    />;
}


export default Entry;