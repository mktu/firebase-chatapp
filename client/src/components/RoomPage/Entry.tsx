import React from 'react';
import Provider from './Provider';
import Container, {Props} from './Container';

const Entry: React.FC<Props> = (props) => {
    
    return (
        <Provider>
            <Container {...props}/>
        </Provider>
    )
}


export default Entry;