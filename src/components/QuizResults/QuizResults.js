import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import withContainer from '../withContainer';
import { queryString } from '../../util';
import { updateQuiz, submitQuiz } from '../../actions/actions';
import Log from '../../Log';
import './QuizResults.css';

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

  percentCorrect() {
    return 55;
  }

  render() {
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
          <div className="d-flex justify-content-center">
            <h3 className="common-UppercaseTitle mt-2">Question</h3>
          </div>
        </div>
    )
  }
}

export default withContainer(connect(mapStateToProps, mapDispatchToProps)(withRouter(QuizResults)));

