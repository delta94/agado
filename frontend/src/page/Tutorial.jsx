import qs from 'qs';
import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';
import '../css/Tutorial.css';

export default class Tutorial extends Component {
  componentWillMount() {
    const pathname = window.location.pathname;
    const search = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    this.setState({
      pathname: pathname,
      search: search
    });
  }

  render() {
    return (
      <div className="profile-bg scroll-snap-child">
        <Jumbotron className="h-80 shadow bg-light">
          <h1>Tutorial</h1>
          <iframe title="tutorial" className="video-size" src="https://www.youtube.com/embed/9zmPTNgBZlo" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </Jumbotron>;
      </div>
    )
  }
}