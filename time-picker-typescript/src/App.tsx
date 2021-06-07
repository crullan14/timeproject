import React, { useState, useContext } from 'react';
import TimePicker from './TimePicker/TimePicker';
import TimeLabel from './TimePicker/TimeLabel';
import Dialog from './TimePicker/Dialog';
import './App.css';
import { ThemeContext } from './ThemeContext';
//import { setTokenSourceMapRange } from 'typescript';

export type clockType = '12' | '24';

function App() {
  // using clock as state only because I wanted a way to showcase the useEffect
  // custom hook inside of TimePicker via just timeout vs changing
  const [clock] = useState<clockType>('12');


  // initialize time to a value, track it with state to share between timepicker and timelabel
  // use valueChangeHandler to lift state back up
  const currentDate = new Date();
  const currentTime = currentDate.toLocaleTimeString('en-US',
    { hour: '2-digit', minute: '2-digit', hour12: clock === '12' ? true : false });
  const [time, setTime] = useState(currentTime);
  function valueChangeHandler(value: string) {
    setTime(value);
  }

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const handleClick = () => {
    setDialogOpen(true);
  }
  function openChangeHandler(value: boolean) {
    setDialogOpen(value);
  }

  const context = useContext(ThemeContext);

  return (
    <div className="App">
      <header className="App-header" style={{ backgroundColor: context.background, color: context.foreground }}>
        <button onClick={handleClick}>Select Time</button>
        <Dialog open={dialogOpen} openChangeHandler={openChangeHandler}>
          <TimePicker value={time} valueChangeHandler={valueChangeHandler} clock={clock} />
        </Dialog>
        <TimeLabel value={time} />
      </header>
    </div>
  );
}

export default App;
