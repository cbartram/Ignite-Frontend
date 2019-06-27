import React, { Component } from 'react';
import moment from "moment";
import Markdown from "react-markdown";
import {
    Pagination,
    Image,
    Segment
} from "semantic-ui-react";
import Voter from '../../../src/components/Voter/Voter';

const ITEMS_PER_PAGE = 5;

export default class ForumRow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            answerText: '',
            preview: false,
            activePage: 1,
        }
    }

    /**
     * Renders a basic well which shows
     * all the answers to the question contained
     * in this forum row.
     * @returns {*}
     */
    renderWell() {
        let firstIndex = ((this.state.activePage - 1) * ITEMS_PER_PAGE);
        let lastIndex = firstIndex + ITEMS_PER_PAGE;
        let data = this.props.answers.slice(firstIndex, lastIndex);
        let totalPages =  Math.ceil(this.props.answers.length / ITEMS_PER_PAGE);

        return (
            <div className="well">
                <Segment.Group>
                    <Segment>
                        <div className="d-flex flex-row justify-content-start">
                            <div>
                                <h3>{this.props.post.title}</h3>
                                <Markdown source={ this.props.post.content } />
                            </div>
                        </div>
                    </Segment>
                    {
                        this.props.answers.length === 0 ? null :
                        data.map((answer, idx) => {
                            return (
                                <Segment className={`d-flex flex-row ${answer.answered ? 'answered': ''}`} key={idx}>
                                    <Voter
                                        // Show the accept button if you are the one who asked the question
                                        showAcceptButton={this.props.user.pid === this.props.post.content_creator.id}
                                    />
                                    <div className="flex-column ml-2 mt-1">
                                        <Markdown source={answer.content} />
                                        <p className="text-muted">
                                            Posted By <strong>{answer.content_creator.first_name} {answer.content_creator.last_name}</strong> on <strong>{moment(answer.createdAt).format('MMM DD, YYYY')}</strong>
                                        </p>
                                    </div>
                                    <div className="flex-column ml-auto mt-1 mr-2">
                                        <p className="answer-count">{answer.up_votes}</p>
                                        <p className="text-muted">Votes</p>
                                    </div>
                                </Segment>
                            )
                        })
                    }
                </Segment.Group>

                <Pagination
                    defaultActivePage={1}
                    onPageChange={(e, { activePage }) => this.setState({ activePage })}
                    firstItem={null}
                    lastItem={null}
                    siblingRange={2}
                    totalPages={totalPages}
                />
                <div className="d-flex justify-content-center mb-3">
                    <div className="btn-group btn-group-toggle" data-toggle="buttons">
                        <label className="btn btn-secondary active" onClick={() => this.setState({ preview: false })}>
                            <input type="radio" name="options" id="option1" autoComplete="off" />
                            Write &nbsp;
                            <i className="fas fa-pencil-alt" />
                        </label>
                        <label className="btn btn-secondary" onClick={() => this.setState({ preview: true })}>
                            <input type="radio" name="options" id="option2" autoComplete="off" />
                            Preview &nbsp;
                            <i className="fa fa-eye" />
                        </label>
                    </div>
                </div>
                {
                    this.state.preview ? <Markdown source={this.state.answerText} /> :
                    <div className="form-group">
                        <textarea className="form-control" value={this.state.answerText} placeholder="Draft Answer..." rows="8" onChange={({target}) => this.setState({ answerText: target.value })} />
                        <small className="form-text text-muted">Hint: You can use <a href="https://guides.github.com/features/mastering-markdown/" target="_blank" rel="noopener noreferrer">markdown</a> here!</small>
                        <div className="d-flex justify-content-end">
                            <button className="common-Button common-Button--default" onClick={() => {
                                this.props.onReply({ question_id: this.props.post.sid, content: this.state.answerText,  type: 'ANSWER'});
                                this.setState({ answerText: '' }); // Reset the form fields
                            }}>
                                Reply <i className="fas fa-reply" />
                            </button>
                        </div>
                    </div>
                }
            </div>
        )
    }

    render() {
        return (
            <div>
                <div className="d-flex" style={{ cursor: 'pointer' }} role="button" onClick={() => this.props.onClick(this.props.post.sid)}>
                    <div className="avatar-container sm-avatar-container m-2">
                        <Image src="https://secure.gravatar.com/avatar/7762d0145e4f9da9b9957fbca1b76865?s=96&amp;d=https%3A%2F%2Fstatic.teamtreehouse.com%2Fassets%2Fcontent%2Fdefault_avatar-ea7cf6abde4eec089a4e03cc925d0e893e428b2b6971b12405a9b118c837eaa2.png&amp;r=pg" />
                    </div>
                    <div className="flex-column ml-2 mt-1">
                        <h5 className="question-title">
                            {this.props.post.title}
                        </h5>
                        <p className="text-muted">Posted
                            on <strong>{moment(this.props.post.createdAt).format('MMM DD, YYYY')}</strong> by <strong>{this.props.post.content_creator.first_name} {this.props.post.content_creator.last_name}</strong>
                        </p>
                    </div>
                    <div className="flex-column ml-auto mt-1 mr-2">
                        <p className="answer-count">{this.props.post.up_votes}</p>
                        <p className="text-muted">Votes</p>
                    </div>
                </div>
                <hr style={this.props.open ? { marginBottom: 0} : {} }/>
                {
                    this.props.open && this.renderWell()
                }
            </div>
        )
    }
}
