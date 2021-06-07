import './Dialog.css';
import { ThemeContext } from '../ThemeContext';
import { useContext } from 'react';

function Dialog(props: any) {
  const context = useContext(ThemeContext);

  // click in modal, not targeted at content means close
  const handleClick = (e: any) => {
    const element = e.target;
    if (element?.classList.contains('modal')) {
      props.openChangeHandler(false);
    }
  };

return props.open ? (<div className='modal' onClick={ handleClick }>
    <div className='dialog' style={{ backgroundColor: context.background, color: context.foreground, borderColor: context.foreground }}>
      {props.children}
    </div></div>) : null;
}

export default Dialog;
