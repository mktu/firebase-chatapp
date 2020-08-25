import React from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Search from '../Search';

const StyledSearch = styled(Search)`
    height : 80vh;
`;

type Props = {
    keyword ?: string,
    onSelect : (roomId:string, messageId:string, isContact: boolean)=>void
};

function SearchContainer({
    keyword,
    onSelect
}: Props) {
    return (
        <React.Fragment>
            <DialogContent>
                <StyledSearch 
                    keyword={keyword}
                    onSelecRoom={onSelect}
                />
            </DialogContent>
        </React.Fragment >
    );
};

type DialogProps = {
    children: React.ReactElement,
    show: boolean,
    onClose: () => void
}

const SearchDialog: React.FC<DialogProps> = ({
    children,
    onClose,
    show
}) => (
        <Dialog fullWidth open={show} onClose={onClose} >
            {children}
        </Dialog>
    )

export {
    SearchContainer,
    SearchDialog
}