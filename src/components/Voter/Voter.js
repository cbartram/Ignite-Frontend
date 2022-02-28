import React from 'react';
import './Voter.css';

/**
 * Shows chevrons for voting a post up or down
 * @param props
 * @returns {*}
 * @constructor
 */
const Voter = (props) => (
    <div className="d-flex flex-column">
      <button className={`btn ${props.votedUp ? 'voted' : ''}`} disabled={!props.allowVoting} onClick={() => props.up()}>
        <i className="fas fa-2x fa-chevron-up" />
      </button>
        {
            props.showAcceptButton ?
                <button className="btn" onClick={() => props.onAccept()}>
                    <i className="fas fa-2x fa-check" />
                </button>
                : null
        }
      <button className={`btn ${props.votedDown ? 'voted' : ''}`} disabled={!props.allowVoting} onClick={() => props.down()}>
        <i className="fas fa-2x fa-chevron-down" />
      </button>
    </div>
);

export default Voter;
