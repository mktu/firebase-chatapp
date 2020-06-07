import React from 'react';


export const initialTheme = {
    primary : {
        main : '#12293E',
        hover : '#16324b',
        text : '#D5D5D5',
    },
    divider : 'rgba(255,255,255,0.12)'
};

export type ThemeType = typeof initialTheme;

// pallete : https://www.0to255.com/
// contrast : http://colorsafe.co/
const ThemeContext = React.createContext(initialTheme);

export default ThemeContext;