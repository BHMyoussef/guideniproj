import React from 'react';
import './styles.css';

const EmptyList = () => (
  <div className='emptyList-wrap'>
    <img src={`${window.location.origin}/resources/13525-empty.gif`} alt='empty' />
  </div>
);

export default EmptyList;
