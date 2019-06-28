import React, { Component } from 'react';
import _ from "lodash";
import { Pagination } from "semantic-ui-react";
import ForumRow from "./ForumRow";

const ITEMS_PER_PAGE = 5;

/**
 * Handles the state and logic for opening and closing
 * the question/answer dropdown wells in the Watch page.
 */
export default class ForumContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expandedQuestion: {},
            activePage: 1,
        }
    }

    /**
     * Handles expanding a questions dropdown to show the answers for the question.
     * @param id String id of the row to expand
     */
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

    /**
     * Returns true if the expanded row is open and false otherwise
     * @param question_id String the id of the row in question.
     * @returns {boolean|*}
     */
    isOpen(question_id) {
        if(_.isUndefined(this.state.expandedQuestion[question_id]))
            return false;
        return this.state.expandedQuestion[question_id];
    }

    render() {
        if (this.props.questions.length === 0)
            return (
                <div className="d-flex flex-column align-items-center justify-content-center my-3">
                    <h3>No Questions asked!</h3>
                    <button className="common-Button common-Button--default" onClick={() => this.props.onQuestionAsk()}>
                        Ask a Question
                    </button>
                </div>
            );

        let firstIndex = ((this.state.activePage - 1) * ITEMS_PER_PAGE);
        let lastIndex = firstIndex + ITEMS_PER_PAGE;
        let data = this.props.questions.slice(firstIndex, lastIndex);
        let totalPages =  Math.ceil(this.props.questions.length / ITEMS_PER_PAGE);

        return (
            <div className="p-2">
                {
                    data.map((post, idx) => {
                        let answers = null;
                        if(_.isUndefined(post.answers))
                            answers = [];

                        else
                            answers = post.answers;

                        return <ForumRow
                                open={this.isOpen(post.sid)}
                                answers={answers}
                                onClick={(id) => this.expandRow(id)}
                                post={post}
                                key={idx}
                                user={this.props.user}
                                onAccept={(answer) => this.props.onAccept(answer)}
                                onUpVote={(answer) => this.props.onUpVote(answer)}
                                onDownVote={(answer) => this.props.onDownVote(answer)}
                                onReply={(answer) => this.props.onAnswerPosted({ ...post, ...answer})}
                               />
                    })
                }
                <Pagination
                    defaultActivePage={1}
                    onPageChange={(e, { activePage }) => this.setState({ activePage })}
                    firstItem={null}
                    lastItem={null}
                    siblingRange={2}
                    totalPages={totalPages}
                />
                <div className="d-flex justify-content-center mt-3">
                    <button className="common-Button common-Button--default" onClick={() => this.props.onQuestionAsk()}>
                        Ask a Question
                    </button>
                </div>
            </div>
        )
    }
}
