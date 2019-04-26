import qs from 'qs';
import React, { Component } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import '../css/Home.css';
import { userService } from '../service/userService';

export default class Home extends Component {
  componentWillMount() {
    const pathname = window.location.pathname;
    const search = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    this.setState({
      pathname: pathname,
      search: search
    });

    const currentUser = userService.getCurrentUser();
    if (currentUser && currentUser.user_type === "hotel_manager") {
      window.location.href = "/myhotel";
    }
  }

  getSearchLink = () => {
    const pathname = "/search";
    const search = qs.stringify({
      hotel_name: this.state.search.hotel_name
    }, { addQueryPrefix: true });
    return pathname + search;
  }

  render() {
    return (
      <div className="home-bg vertical-center text-center scroll-snap-child">
        <Container>
          <Row>
            <Col className="text-center">
              <div className="title">Choose your destination</div>
            </Col>
          </Row>
          <Form onSubmit={(e) => { e.preventDefault(); window.location.href = this.getSearchLink(); }}>
            <Row className="justify-content-center">
              <Col xs={9} sm={9} md={8} lg={7} xl={6} className="my-2">
                <Form.Control
                  className="not-form-control"
                  type="text"
                  onChange={(e) => this.setState({ search: { ...this.state.search, hotel_name: e.currentTarget.value } })}
                  placeholder="Hotel or Destination"
                  autoFocus />
              </Col>
              <Col xs={2} sm={2} md={2} lg={1} xl={1} className="my-2">
                <Button type="submit" variant="light" tabIndex={-1}><i className="fas fa-search" /></Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    )
  }
}
