import React from 'react';
import Svg, { Path } from 'react-native-svg';

const BarbellIcon = (props) => { 
  return (
    <Svg viewBox="0 0 24 24" width={props.width || 40} height={props.height || 40} fill={props.color || "#2196F3"}>
      <Path d="M2,8H4V16H2V8M5,5H7V19H5V5M8,2H16V22H8V2M17,5H19V19H17V5M20,8H22V16H20V8Z" />
    </Svg>
  );
};

export default BarbellIcon;