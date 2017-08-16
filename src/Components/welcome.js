import React from 'react';

const button = (props) => {
  if(props.buttonType === 'logout')
    window.localStorage.clear()
  else
    props.history.goBack();
}

const Welcome = (props) => {
  let message = props.message.toUpperCase();
  
  return (
    <div className='jumbotron' style={header}>
      <div style={{ width: '100px', height: '100px' }}>
        <a href='#' className='btn btn-danger' style={{ position: 'absolute', margin: '5px', left: '0', width: '90px', height: '90px' }} onClick={() => button(props)}>
          <div className='buttonContentCenter'>
            <i className={props.buttonType === 'logout' ? 'fa fa-sign-out fa-4x' : 'fa fa-backward fa-4x'}></i>
          </div>
        </a>
      </div>
      <h1 className='display-3' style={{ position: 'absolute', margin: '0 auto' }}>{message}</h1>
    </div>
  );
}

const header = {
  textAlign: 'center',
  backgroundColor: '#e0dbb1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100px'
}

export default Welcome;