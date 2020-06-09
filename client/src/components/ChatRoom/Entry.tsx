import React from 'react';
import Loader, {Props} from './Loader';
import InactiveRoom from './InactiveRoom';

const Entry: React.FC<Props> = (props) => {
    
    if (props.room.disabled) {
        return <InactiveRoom room={props.room} show={props.show}/>;
    }
    return <Loader
        {...props}
    />;
}


export default Entry;