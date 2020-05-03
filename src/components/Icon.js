import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { find } from 'lodash';

import {
  faArrowAltRight,
  faSignOutAlt,
} from '@fortawesome/pro-light-svg-icons';

const icons = [
  faArrowAltRight,
  faSignOutAlt,
];

library.add(...icons);

/*
  When we render the icon with an un-prefixed name,
    we look up the name in the library,
    and add the appropriate prefix
 */

const getIcon = (icon) => {
  if (typeof icon !== 'string') return icon;

  console.log(icons, icon);

  const libraryIcon = find(icons, { iconName: icon });
  if (!libraryIcon) return icon;
  return [libraryIcon.prefix, icon];
};

const Icon = (props) => {
  const { icon, ...restProps } = props;
  return <FontAwesomeIcon icon={getIcon(icon)} {...restProps} />;
};

export default Icon;
