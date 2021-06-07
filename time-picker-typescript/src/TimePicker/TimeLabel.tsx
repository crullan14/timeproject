import React, { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';


interface TimeLabelProps {
  value: string
}

function TimeLabel(props: TimeLabelProps) {
  const context = useContext(ThemeContext);
  return (
    <div>
      <span>The selected time is: <b style={{ color: context.label }}>{props.value}</b></span>
    </div>
  );
}

export default TimeLabel;
