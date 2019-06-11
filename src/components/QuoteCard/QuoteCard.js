import React, { Component } from 'react';
import './QuoteCard.css';

export default class QuoteCard extends Component {
  render() {
      return (
          <div className="QuoteCard MediaElement">
            <a href="#instructor" className="QuoteCard__card">
              <div className="QuoteCard__image Helm__background--cyan5">
                <img src={this.props.imageUrl} className="image" alt="Christian Bartram" />
                  <div className="QuoteCard__icon">
                    <span className="Helm-Icon Helm-Icon--xsmall Helm-Icon__quote Helm__background--transparent Helm-Icon--full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="14" viewBox="0 0 19 14" fill="#61b0e3">
                        <path fillRule="evenodd"
                            d="M17.7202275,13 L17.7202275,15.272269 C16.5167366,15.272269 15.3964826,15.6541326 14.359432,16.4178713 C13.3223813,17.1816099 12.8038637,18.0936643 12.8038637,19.1540618 C12.8038637,19.7852508 13.0599218,20.1008406 13.5720456,20.1008406 C13.6872734,20.1008406 13.9177257,20.056658 14.2634092,19.9682916 C14.6218959,19.8925489 14.9099612,19.8546781 15.1276138,19.8546781 C15.831784,19.8546781 16.4943342,20.135553 17.1152843,20.6973112 C17.7362344,21.2590694 18.0467048,22.0322643 18.0467048,23.0169191 C18.0467048,23.9763264 17.7266323,24.8000156 17.0864775,25.4880116 C16.4463228,26.1760076 15.5693239,26.5200005 14.4554547,26.5200005 C13.1239328,26.5200005 12.048489,26.0245245 11.229091,25.0335578 C10.4096929,24.0425911 10,22.6634639 10,20.8961347 C10,18.4597452 10.7521705,16.5504272 12.2565342,15.1681233 C13.7608978,13.7858194 15.5821107,13.0631189 17.7202275,13 Z M28.2635233,13 L28.2635233,15.272269 C27.1240479,15.272269 26.0197976,15.6478208 24.9507391,16.3989357 C23.8816807,17.1500506 23.3471595,18.0684168 23.3471595,19.1540618 C23.3471595,19.7852508 23.6032176,20.1008406 24.1153414,20.1008406 C24.2305692,20.1008406 24.4610215,20.056658 24.806705,19.9682916 C25.1651917,19.8925489 25.453257,19.8546781 25.6709096,19.8546781 C26.4134891,19.8546781 27.0856415,20.1450207 27.687387,20.7257145 C28.2891324,21.3064084 28.5900006,22.0701356 28.5900006,23.0169191 C28.5900006,23.9763264 28.2699281,24.8000156 27.6297733,25.4880116 C26.9896186,26.1760076 26.1126198,26.5200005 24.9987505,26.5200005 C23.6672287,26.5200005 22.5917848,26.0245245 21.7723868,25.0335578 C20.9529887,24.0425911 20.5432958,22.6634639 20.5432958,20.8961347 C20.5432958,18.4597452 21.2954663,16.5504272 22.79983,15.1681233 C24.3041936,13.7858194 26.1254065,13.0631189 28.2635233,13 Z"
                            transform="translate(-10 -13)" />
                      </svg>
                    </span>
                  </div>
              </div>
              <div className="QuoteCard__body">
                <div className="QuoteCard__text">
                  <p className="common-IntroText mt-2">
                    { this.props.quote }
                  </p>
                </div>
                <div className="QuoteCard__byContainer common-UppercaseText">
                  <span className="QuoteCard__by">
                    { this.props.by }
                  </span>
                </div>
              </div>
            </a>
            <div className="QuoteCard__stripes" aria-hidden="true">
              <div></div>
              <div></div>
            </div>
          </div>
      )
  }
}
