import React, { Component } from 'react';
import './Card.css';

export default class Card extends Component {
  render() {
      return (
          <section className="common-Card pricing-box mx-3 my-3">
              <aside className="common-UppercaseText-Badge profile-badge">{this.props.badgeText}</aside>
              <div className="card-body">
                { this.props.children }
              </div>
          </section>
      )
  }
}
