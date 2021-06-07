import React, { useState, useContext, useEffect } from 'react';
import { clockType } from '../App';
import './TimePicker.css';
import { ThemeContext } from '../ThemeContext';

// custom hook using 'use' prefix, reacts to clock property changes
function useClockTimes(clock: clockType) {
  // method to get clock times from the type of clock 
  function getClockTimes(clock: clockType): Array<string> {
    // these seem like in a more complex component they would be props for customization
    // min max could be useful as well
    const interval = 30;
    const start = 0;
    // 1440 total minutes in a day
    const dayLength = 1440;

    let timesArray = [];
    let currentTime = start;
    while (currentTime < dayLength) {
      let hours = Math.floor(currentTime / 60);
      let minutes: string | number = currentTime % 60;  // converts to string later
      let suffix = "";
      if (clock === '12') {
        suffix = currentTime < (dayLength / 2) ? 'AM' : ' PM';
        if (hours > 12) {
          hours -= 12;
        } else if (hours === 0) {
          hours = 12;
        }
      }

      // ensure second 0 on time
      minutes = minutes === 0 ? '00' : minutes;

      let timeString = hours + ':' + minutes + suffix;
      timesArray.push(timeString)

      currentTime += interval;
    }
    return timesArray;
  }

  // keep clockTimes as state and track clocks changes
  const [clockTimes, setClockTimes] = useState(getClockTimes(clock));
  useEffect(() => {
    setClockTimes(getClockTimes(clock));
  }, [clock]);

  return clockTimes;
}

interface TimePickerProps {
  value: string;
  valueChangeHandler: Function;
  clock: clockType;
}

function TimePicker(props: TimePickerProps) {
  const context = useContext(ThemeContext);
  const [currentValue, setCurrentValue] = useState(props.value);
  const [valid, setValid] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  // custom hook
  const clockTimes = useClockTimes(props.clock);

  // for determining opening upwards on downwards with the popup I'm not sure there's a pure css
  // way to do so, unsure of how to do it without DOM measurement, checked out datalist as well which just works
  // or position fixed?
  const openUp = false;

  // consider moving validate up a level to be a prop for custom time validation
  const validate = (value: string): boolean => {
    let regex = "^([01]?[0-9]|2[0-3]):[0-5][0-9](\\s*)$";
    if (props.clock === '12') {
      regex = "^(1[012]|[1-9]):[0-5][0-9](\\s)?(am|pm|AM|PM)(\\s*)$";
    }
    return new RegExp(regex).test(value);
  }

  // handle input changes during typing
  const handleChange = (e: any) => {
    const value = e.target.value;
    setCurrentValue(value);
    if (validate(value)) {
      setValid(true);
      props.valueChangeHandler(e.target.value);
    } else {
      setValid(false);
    }
  }

  // handle list item click
  const handleClick = (e: any) => {
    let value = e.target.getAttribute('data-value');
    setValid(true);
    setCurrentValue(value);
    props.valueChangeHandler(value);
  }

  let timeout: any;
  const handleFocus = (e: any) => {
    setDropdownVisible(true);
    if (timeout != null) {
      clearTimeout(timeout)
    }
  }

  const handleBlur = (e: any) => {
    // I know this is kind of gross but when the pick list gets clicked 
    // we get a blur event we only want to proccess if its outside of the input
    timeout = setTimeout(() => {
      setDropdownVisible(false);
    }, 250);
  }

  let timePickerList;
  if (dropdownVisible) {
    // in an ideal world this list / dropdown are their own list and popup component
    // allow for more features like keyboard focus and managment, better blur handling
    let timesListItems = clockTimes.map((value) => {
      return (<li onClick={handleClick} data-value={value} key={value} className='time-picker-list-item'>{value}</li>);
    });

    let timePickerPopupClassName = 'time-picker-popup';
    if (openUp) {
      timePickerPopupClassName += ' open-up';
    }

    timePickerList = (
      <div className={timePickerPopupClassName} style={{ backgroundColor: context.background, borderColor: context.foreground }}>
        <ul className='time-picker-list'>{timesListItems}</ul>
      </div>);

    // didn't know datalist was a thing but seems like a good choice here as well instead of li
    // timePickerList = (<datalist id="inputList">{clockTimes.map((value) =><option key={value} value={value}/>)}</datalist>);
  }

  // should probably store these strings as constants outside of component
  let timePickerInputClassName = 'time-picker-input';
  if (!valid) {
    timePickerInputClassName += ' time-picker-input-invalid';
  }

  return (
    <div onFocus={handleFocus} onBlur={handleBlur}>
      <input type="text" className={timePickerInputClassName} aria-invalid={valid} value={currentValue} onChange={handleChange}></input>
      {timePickerList}
    </div>);
}

export default TimePicker;
