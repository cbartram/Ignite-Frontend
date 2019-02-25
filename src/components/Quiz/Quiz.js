import React, { Component } from 'react';
import { connect } from 'react-redux';
import withContainer from '../withContainer';
import './Quiz.css';

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

});

class Quiz extends Component {
  static percentComplete({ questions, correct }) {
    return ((questions / correct) * 100).toFixed(0);
  }

  render() {
      return (
          <div>
            <div className="d-flex flex-column justify-content-center mt-4">
              <h3 className="common-SectionTitle">
                Quiz
              </h3>
              <div className="progress" style={{height: 5 }}>
                <div className="progress-bar" role="progressbar" style={{width: `${Quiz.percentComplete({ questions: 10, correct: 7 })}%`, backgroundColor: '#7795f8' }} />
              </div>
              <div className="d-flex flex-column">
                <div className="d-flex flex-row question">
                  <input type="radio" />
                  <p>Here is a question</p>
                </div>
                <div className="d-flex flex-row">
                  <input type="radio" />
                  <p>Here is a question</p>
                </div>
                <div className="d-flex flex-row">
                  <input type="radio" />
                  <p>Here is a question</p>
                </div>
              </div>
              </div>
          </div>
      )
  }
}

export default withContainer(connect(mapStateToProps, mapDispatchToProps)(Quiz));

