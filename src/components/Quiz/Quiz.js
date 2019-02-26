import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withRouter, Link } from 'react-router-dom';
import withContainer from '../withContainer';
import Log from '../../Log';
import './Quiz.css';

const mapStateToProps = (state) => ({
  quizzes: state.quizzes.quizList,
});

const mapDispatchToProps = (dispatch) => ({

});

/**
 * Renders the page which ingests data from the Quiz engine
 * and displays it for users to interact with
 */
class Quiz extends Component {
  constructor(props) {
    super(props);

    // Have a default quiz object
    this.state = {
      activeQuestionIndex: 0,
      quiz: {
        id: '', // A unique identifier for this quiz
        name: '',
        description: '',
        chapter: 1, // The chapter this quiz applies to
        score: 0,
        completed: false,
        correct: 0,
        incorrect: 0,
        questions: [{
          type: 'single',
          ask: '',
          correct: null,
          correctAnswer: 'C',
          answers: [
            { key: 'A', checked: false, value:''},
            { key: 'B', checked: false, value:''},
            { key: 'C', checked: false, value:''},
            { key: 'D', checked: false, value:''},
          ],
          explanation: '',
        }]
      },
      error: false
    }
  }


  componentDidMount() {
    // Firstly we need to retrieve the quiz from the URL
    try {
      const quizId = decodeURI(atob(this.props.location.search.substring(this.props.location.search.indexOf('=') + 1, this.props.location.search.length)));
      const quiz = this.props.quizzes.filter(q => q.id === quizId)[0];

      if (typeof quiz === 'undefined') {
        // More than likely the user messed with the URL Query params -.-
        this.setState({error: true});
      }
      // The quiz in question (which we will copy to local state)
      this.setState({ quiz });
      // TODO if the user doesn't have an active subscription we cannot provide them access to this content this MUST be done with an API call the server is the only one we can trust
    } catch(err) {
      Log.error('Error mounting the <Quiz /> component.', err);
      this.setState({ error: true });
    }
  }

  /**
   * Updates the currently selected answer to the parameter answer and de-selects the rest
   */
  handleSelect(answer) {
    let { quiz, activeQuestionIndex } = this.state;
    // Make them all un-checked
    quiz.questions[activeQuestionIndex].answers = quiz.questions[activeQuestionIndex].answers.map(o => ({ ...o, checked: false }));

    // Check the correct one
    let index = _.findIndex(quiz.questions[activeQuestionIndex].answers, o => o.key === answer.key);

    if(index !== -1)
      quiz.questions[activeQuestionIndex].answers[index].checked = true;

    this.setState({ quiz });
  }

  /**
   * Computes the percentage of the progress bar to "fill up" based
   * on how many questions the user has completed
   * @returns {string}
   */
  percentComplete() {
    return ((this.state.activeQuestionIndex / this.state.quiz.questions.length) * 100).toFixed(0);
  }

  render() {
      if(this.state.error) {
        return (
            <div className="row">
              <div className="d-flex flex-column align-self-center align-items-center ml-4">
                <i className="fas fa-7x fa-exclamation-triangle d-none d-md-block" style={{ color: '#ffa27b'}} />
              </div>
              <div className="col-md-8">
                <div id="error-block" className="container-lg 404">
                  <h1 className="common-SectionTitle">Oh No!</h1>
                  <h2 className="common-IntroText">We couldn't find that quiz</h2>
                  <p className="common-IntroText">
                    We are having some trouble identifying the correct quiz for you. Please select a proper quiz from our <Link className="common-Link" to="/videos">videos page</Link>
                  </p>
                </div>
              </div>
            </div>
        )
      }
      return (
          <div>
            <div className="d-flex justify-content-center mt-4">
              <h3 className="common-SectionTitle">
                { this.state.quiz.name }
              </h3>
            </div>
            {/* Progress Bar row */}
            <div className="row">
              <div className="col-md-4 offset-md-4">
                <div className="progress" style={{height: 5 }}>
                  <div className="progress-bar" role="progressbar" style={{width: `${this.percentComplete()}%`, backgroundColor: '#7795f8' }} />
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <h3 className="common-UppercaseTitle">Question { this.state.activeQuestionIndex + 1 } of {this.state.quiz.questions.length}</h3>
            </div>
            <div className="row">
              <div className="col-md-8 offset-md-2">
                <div className="d-flex flex-column">
                  <div className="d-flex flex-row justify-content-center m-3">
                    <p className="common-BodyText question-text">
                      { this.state.quiz.questions[this.state.activeQuestionIndex].ask }
                    </p>
                  </div>
                  {
                    this.state.quiz.questions[this.state.activeQuestionIndex].answers.map(answer => {
                      return (
                          <div className="d-flex flex-row justify-content-start align-items-center answer m-3" onClick={() => this.handleSelect(answer)} key={answer.key}>
                            <p className="question-text mt-2">
                              <input type="radio" className="question-input mr-3" onChange={() => {}} checked={answer.checked} />
                              { answer.value }
                            </p>
                          </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>
          </div>
      )
  }
}

export default withContainer(connect(mapStateToProps, mapDispatchToProps)(withRouter(Quiz)));

