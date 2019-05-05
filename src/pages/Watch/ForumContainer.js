import React, { Component } from 'react';
import _ from "lodash";
import ForumRow from "./ForumRow";

/**
 * Handles the state and logic for opening and closing
 * the question/answer dropdown wells in the Watch page.
 */
export default class ForumContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expandedQuestion: {},
        }
    }

    expandRow(id) {
            const { expandedQuestion } = this.state;
            let tablesExpanded = expandedQuestion;

            if(tablesExpanded[id]) {
                tablesExpanded[id] = !tablesExpanded[id];
            } else {
                tablesExpanded[id] = true;
            }

            // Close all other drawers that aren't the drawer that was open
            Object.keys(tablesExpanded).forEach(key => {
                if(key !== id) {
                   tablesExpanded[key] = false;
                }
            });

            this.setState({
                expandedQuestion: tablesExpanded
            });
    }

    isOpen(question_id) {
        if(_.isUndefined(this.state.expandedQuestion[question_id]))
            return false;
        return this.state.expandedQuestion[question_id];
    }

    render() {
        if(_.isUndefined(this.props.questions))
            return (
                <div className="d-flex flex-column align-items-center" style={{height: '100%', width: '100%'}}>
                    <span className="fa fa-2x fa-circle-notch mt-4" style={{ color: '#6772e5' }} />
                    <h4 className="common-UppercaseTitle mt-3">Loading...</h4>
                </div>
            );

        if (this.props.questions.length === 0)
            return (
                <div className="d-flex flex-column align-items-center justify-content-center my-3">
                    <h3>No Questions asked!</h3>
                    <button className="common-Button common-Button--default" onClick={() => this.props.onQuestionAsk()}>
                        Ask a Question
                    </button>
                </div>
            );

        return (
            <div className="p-2">
                {
                    this.props.questions.map((post, idx) => {
                        let answers = null;
                        if(_.isUndefined(post.answers))
                            answers = [];

                        else
                            answers = post.answers;

                        return <ForumRow
                            open={this.isOpen(post.sort_id)}
                            onClick={(id) => this.expandRow(id)}
                            post={post}
                            key={idx}
                            onReply={(answer) => this.props.onAnswerPosted({ ...post, ...answer})}
                            answers={answers}
                        />
                    })
                }
                <div className="d-flex justify-content-center">
                    <button className="common-Button common-Button--default" onClick={() => this.props.onQuestionAsk()}>
                        Ask a Question
                    </button>
                </div>
            </div>
        )
    }
}
