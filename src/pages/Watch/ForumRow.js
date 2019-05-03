import React, { Component } from 'react';
import moment from "moment";

export default class ForumRow extends Component {

    /**
     * Renders a basic well which shows
     * all the answers to the question contained
     * in this forum row.
     * @returns {*}
     */
    renderWell() {
        return (
            <div className="well">
                <h3>Im the well!</h3>
            </div>
        )
    }

    render() {
        return (
            <div style={{ cursor: 'pointer' }} role="button" onClick={() => this.props.onClick(this.props.post.question_id)}>
                <div className="d-flex">
                    <div className="avatar-container sm-avatar-container m-2">
                        <img
                            alt="profile_picture"
                            className="avatar-image avatar-image-sm"
                            src="https://secure.gravatar.com/avatar/7762d0145e4f9da9b9957fbca1b76865?s=96&amp;d=https%3A%2F%2Fstatic.teamtreehouse.com%2Fassets%2Fcontent%2Fdefault_avatar-ea7cf6abde4eec089a4e03cc925d0e893e428b2b6971b12405a9b118c837eaa2.png&amp;r=pg"
                        />
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
                <hr/>
                {
                    this.props.open && this.renderWell()
                }
            </div>
        )
    }
}
