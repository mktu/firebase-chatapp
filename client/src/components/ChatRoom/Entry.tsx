import React from 'react';
import Provider, {Props} from './Provider';
import InactiveRoom from './InactiveRoom';

const Entry: React.FC<Props> = (props) => {
    
    if (props.room.disabled) {
        return <InactiveRoom room={props.room} show={props.show}/>;
    }
    return <Provider
        {...props}
    />;
}


export default Entry;