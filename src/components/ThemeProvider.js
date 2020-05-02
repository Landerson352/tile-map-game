import React from 'react';
import {
  CSSReset,
  ThemeProvider as DefaultThemeProvider
} from '@chakra-ui/core';

const ThemeProvider = (props) => (
  <DefaultThemeProvider>
    <CSSReset />
    {props.children}
  </DefaultThemeProvider>
);

export default ThemeProvider;
