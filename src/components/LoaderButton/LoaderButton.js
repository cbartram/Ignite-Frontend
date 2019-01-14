import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import './LoaderButton.css';

export default ({ isLoading, text, loadingText, className = '', disabled = false, ...props }) =>
    <Button
        className={`LoaderButton ${className}`}
        disabled={disabled || isLoading}
        {...props}
    >
        {isLoading && <i className="fas fa-circle-notch" />}
        {!isLoading ? text : loadingText}
    </Button>;