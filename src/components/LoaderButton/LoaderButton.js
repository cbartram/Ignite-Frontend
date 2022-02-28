import React from 'react';
import './LoaderButton.css';

/**
 * Button used to allow a click event when moused down and houses state for when it is disabled and a loading event
 * is taking place.
 * @param isLoading
 * @param text
 * @param loadingText
 * @param className
 * @param disabled
 * @param noCommon removes the common button class from the loader
 * @param props
 * @returns {*}
 */
export default ({ isLoading, text, loadingText, noCommon, className = '', disabled = false, ...props }) =>
    <button
        className={`LoaderButton ${!noCommon ? 'common-Button common-Button--default' : ''} ${className}`}
        disabled={disabled || isLoading}
        {...props}
    >
        {isLoading && <i className="fas fa-circle-notch" />}
        {!isLoading ? text : loadingText}
    </button>;
