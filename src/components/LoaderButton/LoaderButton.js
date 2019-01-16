import React from 'react';
import { Button } from 'react-bootstrap';
import './LoaderButton.css';

/**
 * Button used to allow a click event when moused down and houses state for when it is disabled and a loading event
 * is taking place.
 * @param isLoading
 * @param text
 * @param loadingText
 * @param className
 * @param disabled
 * @param props
 * @returns {*}
 */
export default ({ isLoading, text, loadingText, className = '', disabled = false, ...props }) =>
    <Button
        className={`LoaderButton common-Button common-Button--default ${className}`}
        disabled={disabled || isLoading}
        {...props}
    >
        {isLoading && <i className="fas fa-circle-notch" />}
        {!isLoading ? text : loadingText}
    </Button>;
