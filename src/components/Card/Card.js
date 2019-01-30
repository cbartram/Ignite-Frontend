import React, { Component } from 'react';
import './Card.css';

export default class Card extends Component {
  render() {
      return (
          <section className={`common-Card pricing-box mx-3 my-3 ${this.props.cardTitle ? 'px-0' : ''}`}>
              {
                  this.props.badgeText &&
                  <aside className="common-UppercaseText-Badge profile-badge">{this.props.badgeText}</aside>
              }
              {
                  this.props.cardTitle &&
                   <div className="content-header">
                      <div className="d-flex flex-row justify-content-left ml-3 pl-3">
                          <h4 className="card-title">{this.props.cardTitle}</h4>
                      </div>
                   </div>
              }
              <div className={`card-body ${this.props.classNames && this.props.classNames.join(' ')}`}>
                { this.props.children }
              </div>
          </section>
      )
  }
}
