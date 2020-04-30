import React from 'react';
import {
  CSSReset,
  ThemeProvider as DefaultThemeProvider
} from '@chakra-ui/core';

export {
  Avatar,
  Button,
  Heading,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  Text,
  useDisclosure
} from '@chakra-ui/core';

export const ThemeProvider = (props) => (
  <DefaultThemeProvider>
    <CSSReset />
    {props.children}
  </DefaultThemeProvider>
);
