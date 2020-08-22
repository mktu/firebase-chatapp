import React from 'react';


export const initialTheme = {
    primary : {
        dark : '#0A1723',
        main : '#12293E',
        hover : '#16324b',
        text : '#D5D5D5',
    },
    divider : 'rgba(255,255,255,0.12)',
    paper : 'rgba(17,41,62,0.1)',
    paperText : 'rgba(0,0,0,0.52)',
};

export type ThemeType = typeof initialTheme;

// pallete : https://www.0to255.com/
// contrast : http://colorsafe.co/
const ThemeContext = React.createContext(initialTheme);

export default ThemeContext;