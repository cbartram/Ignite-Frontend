import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter} from 'react-router-dom';
import withContainer from '../../components/withContainer';
import { queryString } from '../../util';
import { updateQuiz, submitQuiz } from '../../actions/actions';
import Log from '../../Log';
import './QuizResults.css';
import Card from "../../components/Card/Card";

const mapStateToProps = (state) => ({
  user: state.auth.user,
  quizzes: state.quizzes.quizList,
  isFetching: state.quizzes.isFetching
});

const mapDispatchToProps = (dispatch) => ({
  updateQuiz: (quiz) => dispatch(updateQuiz(quiz)),
  submitQuiz: (email, quiz) => dispatch(submitQuiz(email, quiz)),
});

/**
 * Renders the page which ingests data from the Quiz engine
 * and displays it for users to interact with
 */
class QuizResults extends Component {
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
      const { q } = queryString();
      const quizId = decodeURI(atob(q));
      const quiz = this.props.quizzes.filter(q => q.id === quizId)[0];

      if (typeof quiz === 'undefined') {
        // More than likely the user messed with the URL Query params -.-
        this.setState({ error: true });
      }

      // The quiz in question (which we will copy to local state)
      this.setState({ quiz });
      // TODO if the user doesn't have an active subscription we cannot provide them access to this content this MUST be done with an API call the server is the only one we can trust
    } catch(err) {
      Log.error('Error mounting the <QuizResults /> component.', err);
      this.setState({ error: true });
    }
  }

  /**
   * Returns the percent the user got correct on their quiz.
   */
  percentCorrect() {
    let numCorrect = this.state.quiz.questions.filter(q => q.correct).length;
    let total = this.state.quiz.questions.length;
    return ((numCorrect / total) * 100).toFixed(0);
  }

  /**
   * Updates the active question index to move the questions either back or forward
   * This in turn updates the page to show the next or previous question.
   * @param type String
   */
  handleQuestionChange(type) {
    // TODO ensure that if a user gets to the last question and clicks next it moves the pointer
    // TODO back to the first question
    if(type === 'next') {
      if(this.state.activeQuestionIndex !== this.state.quiz.questions.length - 1)
        this.setState((prev) => ({activeQuestionIndex: prev.activeQuestionIndex + 1}));
    } else {
      if(this.state.activeQuestionIndex <= 0)
        this.setState({ activeQuestionIndex: 0 });
      else
        this.setState((prev) => ({ activeQuestionIndex: prev.activeQuestionIndex - 1 }));
    }
  }

  render() {
    // If we are still grading the quiz show a loading icon
    if(this.props.isFetching) {
      return (
          <div className="d-flex flex-column align-items-center justify-content-center mt-4">
            <h3 className="common-SectionTitle">
              Grading Quiz One Moment...
            </h3>
            <i className="fa fa-4x fa-circle-notch" style={{color: '#7795f8'}} />
          </div>
      )
    }


    if(this.state.error) {
      return (
          <div className="row">
            <div className="d-flex flex-column align-self-center align-items-center ml-4">
              <i className="fas fa-7x fa-exclamation-triangle d-none d-md-block" style={{ color: '#ffa27b'}} />
            </div>
            <div className="col-md-8">
              <div id="error-block" className="container-lg pb-1">
                <h1 className="common-SectionTitle">Oh No!</h1>
                <h2 className="common-IntroText">We had some trouble processing your quiz.</h2>
                <p className="common-IntroText">
                  Feel free to repeat the quiz and try again or choose a different quiz from the list below.
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
                <div className="progress-bar" role="progressbar" style={{width: `${this.percentCorrect()}%`, backgroundColor: '#7795f8' }} />
              </div>
            </div>
          </div>
          <div className="d-flex flex-column align-items-center justify-content-center">
            <h3 className="common-UppercaseTitle mt-2">You Scored {this.percentCorrect()}%</h3>
            <p className="text-muted">You answered {this.state.quiz.questions.filter(q => q.correct).length} of {this.state.quiz.questions.length} questions correctly.</p>
          </div>
          <Card cardTitle={`${this.state.quiz.name} Results`} classNames={['pt-1']}>
            <h4 className="common-UppercaseTitle mb-3">Per Question Results</h4>
            <div className="d-flex flex-row">
            {
              this.state.quiz.questions.map((question, i) =>{
                if(question.correct)
                  return <div role="button" key={i} className={`question-dot question-dot-correct ${i === this.state.activeQuestionIndex ? 'question-dot-selected': ''}`}><span/></div>;
                else
                  return <div role="button" key={i} className={`question-dot question-dot-incorrect ${i === this.state.activeQuestionIndex ? 'question-dot-selected': ''}`}><span /></div>;
              })
            }
            </div>
            <label className="text-muted my-2">Question {this.state.activeQuestionIndex + 1}</label>
            <p className="question-ask">{this.state.quiz.questions[this.state.activeQuestionIndex].ask}</p>

            <div className="answers">
              <ul>
                {
                  this.state.quiz.questions[this.state.activeQuestionIndex].answers.map(answer => {
                    let isCorrect = this.state.quiz.questions[this.state.activeQuestionIndex].correctAnswer === answer.key;
                    let iconClassName = [];
                    // If it was both correct and the selected answer it should be a green check
                    if(isCorrect)
                      iconClassName.push('fa-check bg-green');

                    // If it was incorrect but NOT selected it should be a grey X
                    if(!answer.checked && !isCorrect)
                      iconClassName.push('fa-times bg-grey');

                    // If it was incorrect and selected it should be a red X
                    if(answer.checked && !isCorrect)
                      iconClassName.push('fa-times bg-red');

                    return (
                      <li className={`question-answer ${answer.checked ? 'answer-selected' : ''}`} key={answer.key}>
                        <div className="d-flex flex-row">
                          <i className={`fas ${iconClassName} mr-2 mt-1`} />
                          <span className="answer-value">{answer.value}</span>
                          {
                            answer.checked && <span className="badge badge-primary ml-2 p-2">Selected</span>
                          }
                        </div>
                      </li>
                    )
                  })
                }
              </ul>
            </div>

            <hr />

            <h4 className="common-UppercaseTitle" style={{fontSize: 15}}>Explanation:</h4>
            <p className="text-muted">
              {
                this.state.quiz.questions[this.state.activeQuestionIndex].explanation
              }
            </p>

            <div className="d-flex flex-row">
              <button className="common-Button common-Button--default mr-2" onClick={() => this.handleQuestionChange('prev')}>
              <i className="fas fa-chevron-left" /> Previous
            </button>
              <button className="common-Button common-Button--default" onClick={() => this.handleQuestionChange('next')}>
                Next <i className="fas fa-chevron-right" />
              </button>
            </div>
          </Card>
        </div>
    )
  }
}

export default withContainer(connect(mapStateToProps, mapDispatchToProps)(withRouter(QuizResults)));

