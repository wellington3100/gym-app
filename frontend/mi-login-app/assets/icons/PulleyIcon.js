import React from 'react';
import Svg, { Path } from 'react-native-svg';

const PulleyIcon = (props) => {
  return (
    <Svg viewBox="0 0 24 24" width={props.width || 40} height={props.height || 40} fill={props.color || "#2196F3"}>
      <Path d="M12,5V9L9,7L12,5M12,3C11.45,3 10.95,3.22 10.59,3.59L6.59,7.59C6.22,7.95 6,8.45 6,9C6,9.55 6.22,10.05 6.59,10.41L10.59,14.41C10.95,14.78 11.45,15 12,15C12.55,15 13.05,14.78 13.41,14.41L17.41,10.41C17.78,10.05 18,9.55 18,9C18,8.45 17.78,7.95 17.41,7.59L13.41,3.59C13.05,3.22 12.55,3 12,3M13,19H11V17H13V19M15,15V17H9V15H15M3,21H21V23H3V21Z" />
    </Svg>
  );
};

export default PulleyIcon;