import qs from 'qs';
import React, { Component } from 'react';
import { Badge, Button, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import '../css/HotelCard.css';

export default class HotelCard extends Component {
  getRatingStar = (rating) => {
    rating = Math.round(rating * 2) / 2;

    let ratingStar = [];
    let key = 1;

    for (let i = 0; i < rating - 0.5; ++i) {
      const star = <i className="fas fa-star" key={key++} />;
      ratingStar.push(star);
    }
    if (rating % 1 !== 0) {
      const halfStar = <i className="fas fa-star-half-alt" key={key++} />;
      ratingStar.push(halfStar);
      rating += 0.5;
    }
    for (let i = 0; i < 5 - rating; ++i) {
      const emptyStar = <i className="far fa-star" key={key++} />;
      ratingStar.push(emptyStar);
    }
    return ratingStar;
  }

  getHotelLink = () => {
    const pathname = "/hotel";
    const search = qs.stringify({
      hotel_id: this.props.hotel.hotel_id,
      checkin: this.props.search.checkin,
      checkout: this.props.search.checkout
    }, { addQueryPrefix: true });
    return pathname + search;
  }

  render() {
    const hotel = this.props.hotel;
    return (
      <Card className="shadow">
        <a className="link-only" href={this.getHotelLink()}>
          <Card.Header>
            <Row className="align-items-center text-dark" noGutters={true}>
              <Col className="mr-auto">
                <Card.Title as="h5">{hotel.name.length < 16 ? hotel.name : hotel.name.slice(0, 16) + "..."}</Card.Title>
                <Card.Subtitle as="h6">{hotel.city.length < 16 ? hotel.city : hotel.city.slice(0, 16) + "..."}</Card.Subtitle>
              </Col>
              <OverlayTrigger overlay={<Tooltip>{hotel.total_review} review{hotel.total_review > 1 ? "s" : ""}</Tooltip>}>
                <Button variant="link" className="link-only px-0" href={this.getHotelLink() + "#hotel_reviews"}>
                  {this.getRatingStar(hotel.rating)}
                  <br />
                  <strong>Rating {hotel.rating.toFixed(1)}</strong>
                </Button>
              </OverlayTrigger>
            </Row>
          </Card.Header>
          <div className="ratio4-3">
            {
              !hotel.imgs[0] ?
                <div className="bg-dark abs-center border-none" />
                : <Card.Img className="absolute border-rad-none" src={hotel.imgs[0]} />
            }
          </div>
          <Badge variant="info" className="right-card px-4 py-2">
            <span className="fs-10">Start at</span><br />
            <span className="price">฿ {hotel.start_price}</span>
          </Badge>
        </a>
        <Card.Body className="hotel-desc-body">
          <Card.Text>{hotel.desc.length < 120 ? hotel.desc : hotel.desc.slice(0, 120) + "..."}</Card.Text>
        </Card.Body>
        <Card.Footer>
          <Row className="align-items-center justify-content-center" noGutters={true}>
            {/* <Col xs={5}>
              <i className="fas fa-door-open" />
              <br />
              {hotel.room_left} rooms left
            </Col>
            <Col xs={1} /> */}
            <Col xs={6}>
              <Button className="w-100 py-2" variant="info" href={this.getHotelLink()}>View Hotel</Button>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    )
  }
}
