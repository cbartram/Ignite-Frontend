import React, { Component } from 'react';
import Card from "react-bootstrap/Card";
import './LinkPreview.css';

/**
 * Shows a rich image preview of a link
 */
export default class LinkPreview extends Component {
  constructor(props) {
      super(props);

      this.state = {
          imageHeight: 100, // Default to 100 for now
          imageUrl: '',
          loading: false,
      };

      this.containerRef = React.createRef();
  }

  /**
   * Retrieves data from the API and computes the rendered height of an image.
   */
  componentDidMount() {
      this.setState({ imageHeight: this.containerRef.current.clientHeight + 1, loading: true }, async () => {
         const data = await ( await fetch(`https://api.linkpreview.net?key=5d038e4200dc84c1458c7790c67dc2fa524443a81e2a4&q=${this.props.link.link}`)).json();
         this.setState({ imageUrl: data.image, loading: false });
      });
  }


  /**
   * Opens a link programatically in a new tab.
   */
  openLink() {
      const win = window.open(this.props.link.link, '_blank');
      win.focus();
  }

    render() {

      if(this.state.loading)
          return (
              <Card className="p-0 link-preview" onClick={() => this.openLink()}>
                  <Card.Body className="mt-0 p-0" ref={this.containerRef}>
                      <div className="d-flex flex-row justify-content-start">
                          <div className="skeleton-box skeleton-loading" />
                          <div className="flex-column pt-3 px-3 card-detail-skeleton">
                              <h3 className="skeleton-title skeleton-loading" />
                              <p className="pl-3 skeleton-text skeleton-loading" />
                              <p className="pl-3 skeleton-text skeleton-loading" />
                          </div>
                      </div>
                  </Card.Body>
              </Card>
          );

      return (
          <Card className="p-0 link-preview" onClick={() => this.openLink()}>
            <Card.Body className="mt-0 p-0" ref={this.containerRef}>
              <div className="d-flex flex-row justify-content-start">
                <img alt="placeholder" className="img-fluid" style={{ borderTopLeftRadius: 8, borderBottomLeftRadius: 8, height: this.state.imageHeight }} width="150" src={this.state.imageUrl} />
                <div className="flex-column py-3 pl-2">
                    <h3>{this.props.link.name}</h3>
                    <p className="common-BodyText">{this.props.link.description}</p>
                </div>
              </div>
            </Card.Body>
          </Card>
      )
  }
}
