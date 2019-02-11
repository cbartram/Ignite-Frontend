import React from 'react';
import './Sidebar.css';

const SidebarOverlay = props => <div role="button" className={`overlay ${props.active ? 'overlay-active' : ''}`} onClick={() => props.onClick()} />;

export default SidebarOverlay;
