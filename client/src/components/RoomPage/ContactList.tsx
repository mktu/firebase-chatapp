import React, { useContext, useState, } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import CustomTheme, { ThemeType } from './ThemeContext';
import { ContactContext } from '../../contexts/ProfileContext';
import { Add } from '@material-ui/icons';
import { ContactProfile } from '../../../../types/profile';
import Searchbox from './SearchBox';


type Props = {
    showAddContact: () => void,
    renderContactListItem: (contact: ContactProfile) => React.ReactElement,
};

type WrapperProps = {
    customtheme: ThemeType,
    theme: any
}

const ListSubTitle = styled.div`
    padding :${({ theme }) => `${theme.spacing(1)}px`};
    & > button{
        width : 100%;
        display : flex;
        justify-content : flex-start;
        align-items : center;
        :hover {
            background-color : ${({ customtheme }: WrapperProps) => `${customtheme.primary.hover}`};
        }
    }
`;

const Wrapper = styled.div`
    height : 100%;
    overflow : auto;
    display : flex;
    flex-direction : column;
    & > .menu-header{
        padding : ${({ theme }) => `${theme.spacing(1)}px ${theme.spacing(2)}px`};
        display : flex;
        justify-content : center;
        align-items : center;
    }

    & >.menu-list{
        max-height : 80%;
        overflow-y : scroll;
    }

    & >.menu-footer{
        margin-top : auto;
        display : flex;
        align-items : center;
        justify-content : flex-end;
        padding-bottom : 1.5em;
        padding-right : 1.5em;
    }
`;

const Divider = styled.div`
    border-bottom : 1px solid rgba(255,255,255,0.12);
    width : 100%;
`;

const AddButton = styled(Button)`
    padding : ${({ theme }) => `${theme.spacing(0.5)}px`};
    min-width : 0;
`;

export default ({
    showAddContact,
    renderContactListItem,
}: Props) => {
    const customtheme = useContext(CustomTheme);
    const contacts = useContext(ContactContext);
    const [filter,setFilter] = useState('');
    const filteredContacts = Boolean(filter) ?  contacts.filter(c=>c.nickname.includes(filter)) : contacts;
    return (
        <Wrapper>
            <div className='menu-header'>
                <Searchbox placeholder='Filter contact' onChange={setFilter} value={filter} variant='filter'/>
            </div>
            <Divider />
            <div className='menu-list'>
                <div className='menu-contacts'>
                    <ListSubTitle customtheme={customtheme}>
                        <Typography variant='caption'>
                            {`Contacts (${contacts.length})`}
                        </Typography>
                    </ListSubTitle>
                    <List>
                        {filteredContacts.filter(c => c.enable).map(renderContactListItem)}
                    </List>
                </div>
            </div>
            <div className='menu-footer'>
                <div>
                    <AddButton color='secondary' variant='contained' onClick={showAddContact}>
                        <Add />
                    </AddButton>
                </div>
            </div>
        </Wrapper>
    )
};