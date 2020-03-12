import React from 'react';
import { addDecorator } from '@storybook/react';
import deepPurple from '@material-ui/core/colors/deepPurple';
import { ThemeProvider, createMuiTheme, StylesProvider } from '@material-ui/core/styles';
import { ThemeProvider as StyledThemeProvider } from "styled-components";

const theme = createMuiTheme({
    palette: {
        primary: deepPurple,
    },
});

addDecorator(storyFn => (
    <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
            <StyledThemeProvider theme={theme}>
                {storyFn()}
            </StyledThemeProvider>
        </ThemeProvider>
    </StylesProvider>
));