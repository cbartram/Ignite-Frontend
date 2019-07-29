import React, {Component} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import ReactGA from 'react-ga';
import {Link, withRouter} from 'react-router-dom';
import withContainer from '../../components/withContainer';
import {queryString} from '../../util';
import {submitQuiz, updateQuiz} from '../../actions/actions';
import Log from '../../Log';
import './Quiz.css';

const mapStateToProps = (state) => ({
  user: state.auth.user,
  quizzes: state.quizzes.quizList,
});

const mapDispatchToProps = (dispatch) => ({
  updateQuiz: (quiz) => dispatch(updateQuiz(quiz)),
  submitQuiz: (email, quiz) => dispatch(submitQuiz(email, quiz)),
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


  /**
   * Sets the currently active quiz and
   * checks the users active subscription to allow access to the quiz content
   */
  componentDidMount() {
    // Firstly we need to retrieve the quiz from the URL
    try {
      const { q, retake } = queryString();
      const quizId = decodeURI(atob(q));
      const quiz = this.props.quizzes.filter(q => q.id === quizId)[0];

      if (typeof quiz === 'undefined') {
        // More than likely the user messed with the URL Query params -.-
        this.setState({error: true});
      }

      if(retake === "true") {
        // Update quiz properties to "reset" quiz
        quiz.correct = 0;
        quiz.incorrect = 0;
        quiz.complete = false;
        quiz.score = 0;
        quiz.questions = quiz.questions.map(q => ({ ...q, correct: null, answers: q.answers.map(a => ({ ...a, checked: false })) }));
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
   * Returns true if any of the answers for the active index are selected
   * and false otherwise. This determines
   */
  isAnswered() {
    return this.state.quiz.questions[this.state.activeQuestionIndex].answers.map(a => a.checked).filter(b => b === true).length === 1;
  }

  /**
   * Updates the currently selected answer to the parameter answer and de-selects the rest
   */
  handleSelect(answer) {
    let { quiz, activeQuestionIndex } = this.state;

    // Only perform this operation if the user has not hit "submit"
    if(quiz.questions[activeQuestionIndex].correct === null) {
      // Make them all un-checked
      quiz.questions[activeQuestionIndex].answers = quiz.questions[activeQuestionIndex].answers.map(o => ({
        ...o,
        checked: false
      }));

      // Check the correct one
      let index = _.findIndex(quiz.questions[activeQuestionIndex].answers, o => o.key === answer.key);

      if (index !== -1)
        quiz.questions[activeQuestionIndex].answers[index].checked = true;

      this.setState({quiz});
    }
  }

  /**
   * Computes the percentage of the progress bar to "fill up" based
   * on how many questions the user has completed
   * @returns {string}
   */
  percentComplete() {
    return (((this.state.activeQuestionIndex + 1) / this.state.quiz.questions.length) * 100).toFixed(0);
  }

  /**
   * Determines if the users answer was
   * correct or incorrect and shows them an explanation accordingly
   */
  gradeQuestion() {
    const { quiz, activeQuestionIndex } = this.state;
    const question = quiz.questions[activeQuestionIndex];
    const selectedAnswer = quiz.questions[activeQuestionIndex].answers.filter(question => question.checked)[0];
    // Selected answer will be "undefined" if the user has not chosen and answer
    if(typeof selectedAnswer !== 'undefined') {
      question.correct = selectedAnswer.key === question.correctAnswer; // Boolean value if they got the question right
      question.correct ? quiz.correct += 1 : quiz.incorrect += 1; // Increase/Decrease their score
      quiz.questions[activeQuestionIndex] = question; // Update the question object
      this.setState({ quiz }, () => {
        // If its the last question send off the results to the server
        if(activeQuestionIndex === quiz.questions.length - 1) {
          Log.info('Submitting Quiz results...');
          this.props.updateQuiz(quiz);
          this.props.submitQuiz(this.props.user.pid, quiz);

          ReactGA.event({
            category: 'User',
            action: 'Took a Quiz'
          });

          // Show the user their quiz results!
          this.props.history.push(`/quiz/results?q=${encodeURI(btoa(this.state.quiz.id))}`);
        }
      });
    } else
      this.props.pushAlert('danger', 'Uh Oh', 'You need to select an answer first!');
  }

  render() {
      if(this.state.error) {
        return (
            <div className="row">
              <div className="d-flex flex-column align-self-center align-items-center ml-4">
                <i className="fas fa-7x fa-exclamation-triangle d-none d-md-block" style={{ color: '#ffa27b'}} />
              </div>
              <div className="col-md-8">
                <div id="error-block" className="container-lg pb-1">
                  <h1 className="common-SectionTitle">Oh No!</h1>
                  <h2 className="common-IntroText">We couldn't find that quiz</h2>
                  <p className="common-IntroText">
                    We are having some trouble identifying the correct quiz for you. Please select a proper quiz from our <Link className="common-Link" to="/videos">videos page</Link> or
                    checkout some quizzes below!
                  </p>
                </div>
                {
                  this.props.quizzes.map(quiz => {
                    return (
                        // Purposely render an <a /> instead of <Link /> so that it reloads the page and componentDidMount()
                        <a key={quiz.id} href={`/quiz?q=${btoa(quiz.id)}&retake=true`} className="badge badge-pill badge-primary badge-quiz p-3 ml-4">
                          { quiz.name }
                        </a>
                    )
                  })
                }
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
              <h3 className="common-UppercaseTitle mt-2">Question { this.state.activeQuestionIndex + 1 } of {this.state.quiz.questions.length}</h3>
            </div>
            {/* Q & A Row */}
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
            {/* Back/forwards row */}
            <div className="row mt-4">
              <div className="col-md-6 offset-md-3">
                <div className="d-flex justify-content-center">
                  <button
                      className="common-Button common-Button--default"
                      disabled={!this.isAnswered()}
                      style={{ minWidth: 70 }}
                      onClick={() => {
                          this.gradeQuestion();
                          // On the last question do NOT increment the activeQuestionIndex
                          if(this.state.activeQuestionIndex !== this.state.quiz.questions.length - 1) {
                            this.setState((prev) => ({activeQuestionIndex: prev.activeQuestionIndex + 1}))
                          }
                      }}>
                    {
                      this.state.activeQuestionIndex === this.state.quiz.questions.length - 1 ?
                      <span>Submit Quiz <i className="fas fa-arrow-right" /></span> : <span>Next <i className="fas fa-chevron-right" /></span>
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
      )
  }
}

export default withContainer(connect(mapStateToProps, mapDispatchToProps)(withRouter(Quiz)));

