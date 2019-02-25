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
              <div className="row">
                <div className="col-md-4 offset-md-3">
                  <div className="d-flex flex-column">
                    <div className="d-flex flex-row answer m-3">
                      <input type="radio" className="question-input" />
                      <p className="question-text">Here is a question</p>
                    </div>
                    <div className="d-flex flex-row answer m-3">
                      <input type="radio" />
                      <p className="question-text">Here is a question</p>
                    </div>
                    <div className="d-flex flex-row answer m-3">
                      <input type="radio" />
                      <p className="question-text">Here is a question</p>
                    </div>
                  </div>
                </div>
              </div>
              </div>
          </div>
      )
  }
}

export default withContainer(connect(mapStateToProps, mapDispatchToProps)(Quiz));

