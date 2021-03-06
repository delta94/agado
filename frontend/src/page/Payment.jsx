import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import moment from 'moment';
import qs from 'qs';
import React, { Component } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import CustomModal from '../component/CustomModal';
import '../css/Payment.css';
import { hotelService } from '../service/hotelService';
import { reservationService } from '../service/reservationService';
import { userService } from '../service/userService';
import Loading from './Loading';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#343a40'
    },
    secondary: {
      main: '#f44336',
    },
  },
});

export default class Payment extends Component {
  async componentWillMount() {
    const pathname = window.location.pathname;
    const search = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    const currentUser = userService.getCurrentUser();
    const hotel = await hotelService.getHotel(Number(search.hotel_id));

    this.setState({
      pathname: pathname,
      search: search,
      currentUser: currentUser,
      hotel: hotel,
      step: 0,
      validUser: search.hotel_id && search.checkin && search.checkout && search.room_id && search.room_id && search.num && currentUser && currentUser.user_type === "traveler"
    });
  }

  getPrice = () => {
    const checkin = this.state.search.checkin;
    const checkout = this.state.search.checkout;
    const interval = Math.max(0, (new Date(checkout) - new Date(checkin)) / 24 / 60 / 60 / 1000);
    const hotel = this.state.hotel;
    const room = hotel.rooms.filter(room => room.room_id === Number(this.state.search.room_id))[0];
    return interval * room.price * Number(this.state.search.num);
  }

  bookNow = async (e) => {
    e.preventDefault();
    const search = this.state.search;
    const reservation = {
      user_id: this.state.currentUser.user_id,
      hotel_id: Number(search.hotel_id),
      checkin: search.checkin,
      checkout: search.checkout,
      room_id: Number(search.room_id),
      num: Number(search.num)
    }
    const hotel = await hotelService.getHotel(reservation.hotel_id, reservation.checkin, reservation.checkout);
    const room = hotel ? hotel.rooms.filter(room => room.room_id === reservation.room_id)[0] : null;
    if (!hotel || !room || room.available_room < reservation.num) {
      this.setState({
        showModal: "not_available_room"
      });
      return;
    }

    if (await reservationService.createReservation(reservation)) {
      this.props.setPreventLeavePage(false);
      this.setState({
        step: 2
      });
    }
  }

  render() {
    if (!this.state) {
      return <Loading />;
    } else if (!this.state.validUser) {
      return (
        <div className="error-bg px-auto hotel-info scroll-snap-child">
          <h1>Permission denied</h1>
          <h4>You have to be a Traveler to access this page.</h4>
        </div>
      )
    } else if (!this.state.hotel || !this.state.hotel.rooms.map(room => room.room_id).includes(Number(this.state.search.room_id))) {
      return (
        <div className="error-bg px-auto hotel-info scroll-snap-child">
          <h1>This page is not exist</h1>
        </div>
      )
    }
    return (
      <>
        <div className="hotel-bg px-auto hotel-info">
          {this.getProgressComponent()}
          {this.getContentComponent()}
        </div>
        <CustomModal
          showModal={this.state.showModal === "not_available_room"}
          closeModal={() => window.location.href = "/search"}
          title="These rooms are not available now"
          body="Please try again later with other rooms." />
      </>
    )
  }

  getProgressComponent = () => {
    return (
      <div className="px-2 px-md-5 scroll-snap-child">
        <MuiThemeProvider theme={theme}>
          <Stepper activeStep={this.state.step} alternativeLabel className="bg-none">
            <Step><StepLabel>Informations</StepLabel></Step>
            <Step><StepLabel>Payment</StepLabel></Step>
            <Step><StepLabel>Completed</StepLabel></Step>
          </Stepper>
        </MuiThemeProvider>
      </div>
    )
  }

  getContentComponent = () => {
    const step = this.state.step;
    if (step === 0) {
      return this.getInfoComponent();
    } else if (step === 1) {
      return this.getPaymentComponent();
    } else if (step === 2) {
      return this.getCompletedComponent();
    }
  }

  getInfoComponent = () => {
    const currentUser = this.state.currentUser;
    const hotel = this.state.hotel;
    const room = hotel.rooms.filter(room => room.room_id === Number(this.state.search.room_id))[0];
    return (
      <>
        <div className="px-payment">
          <h4>Your information:</h4>
          <div className="ml-3 ml-md-5">
            <h6>Full name: {currentUser.first_name + " " + currentUser.last_name}</h6>
            <h6>Gender: {currentUser.gender}</h6>
            <h6>Email: {currentUser.email}</h6>
            <h6>Tel: {currentUser.phone_num}</h6>
          </div>
          <br />
          <h4>Booking information:</h4>
          <div className="ml-3 ml-md-5">
            <h6>Date: {moment(this.state.search.checkin).format("D MMM YYYY") + " - " + moment(this.state.search.checkout).format("D MMM YYYY")}</h6>
            <h6>Hotel: {hotel.name}</h6>
            <h6>Room: {room.name}</h6>
            <h6>Number of room: {Number(this.state.search.num)}</h6>
            <h6>Price: ฿ {this.getPrice()}</h6>
          </div>
        </div>
        <br />
        <Row className="justify-content-center">
          <Col className="text-right">
            <Button variant="dark" className="mx-4 px-3" onClick={() => window.history.go(-1)}>Back</Button>
          </Col>
          <Col>
            <Button variant="dark" className="mx-5 px-3" onClick={() => this.setState({ step: 1 })}>Next</Button>
          </Col>
        </Row>
      </>
    )
  }

  getPaymentComponent = () => {
    const payment = this.state.payment;
    return (
      <Form id="payment" onSubmit={this.bookNow}>
        <div className="px-payment">
          <h4>Payment information:</h4>
          <div className="mx-3 mx-md-5">
            <Row className="align-items-center">
              <Col xs={7} md={5}><h6 className="my-0">Payment method: </h6></Col>
              <Col>
                <Form.Control as="select" onChange={(e) => this.setState({ payment: { ...payment, method: e.currentTarget.value } })} required>
                  <option>VISA</option>
                  <option>mastercard</option>
                  <option>JCB</option>
                  <option>American Express</option>
                </Form.Control>
              </Col>
            </Row>
            <br />
            <Row className="align-items-center">
              <Col><h6>Number of credit/debit card: </h6></Col>
              <Col xs={12}>
                <Form.Control
                  pattern="^[0-9]{16}$"
                  maxLength={16}
                  type="text"
                  onChange={(e) => this.setState({ payment: { ...payment, number: e.currentTarget.value.replace(/\D/g, '') } })}
                  value={payment ? payment.number : ""}
                  required />
                <Form.Text className={"text-danger " + (!payment || !payment.number || /^[0-9]{16}$/.test(payment.number) ? "d-none" : "")}>
                  Format: contains 16 digits
                </Form.Text>
              </Col>
            </Row>
            <br />
            <Row className="align-items-center">
              <Col><h6>Name on the card:</h6></Col>
              <Col xs={12}>
                <Form.Control type="text" onChange={(e) => this.setState({ payment: { ...payment, name: e.currentTarget.value } })} required />
              </Col>
            </Row>
            <br />
            <Row className="align-items-start">
              <Col><h6>Expired date:</h6></Col>
              <Col><h6>CVC/CVV code:</h6></Col>
            </Row>
            <Row className="align-items-start">
              <Col>
                <Row className="align-items-center">
                  <Col>
                    <Form.Control as="select">
                      {Array(12).fill().map((_, i) => <option>{moment().month(i).format('MM')}</option>)}
                    </Form.Control>
                  </Col>
                  /
                  <Col>
                    <Form.Control as="select">
                      {Array(10).fill().map((_, i) => <option>{String(moment().year() + i).substr(2, 2)}</option>)}
                    </Form.Control>
                  </Col>
                </Row>
                <Form.Text className={"text-danger " + (!payment || !payment.exp || /^[0-9]{2}\/[0-9]{2}$/.test(payment.exp) ? "text-transparent" : "")}>
                  Format: MM/YY
                </Form.Text>
              </Col>
              <Col>
                <Form.Control
                  pattern="^[0-9]{3}$"
                  maxLength={3}
                  type="text"
                  onChange={(e) => this.setState({ payment: { ...payment, cvc: e.currentTarget.value.replace(/\D/g, '') } })}
                  value={payment ? payment.cvc : ""}
                  required />
                <Form.Text className={"text-danger " + (!payment || !payment.cvc || /^[0-9]{3}$/.test(payment.cvc) ? "text-transparent" : "")}>
                  Format: contains 3 digits
                </Form.Text>
              </Col>
            </Row>
          </div>
        </div>
        <br />
        <Row className="justify-content-center">
          <Col className="text-right">
            <Button variant="dark" className="mx-4 px-3" onClick={() => this.setState({ step: 0 })}>Back</Button>
          </Col>
          <Col>
            <Button type="submit" form="payment" variant="success" className="mx-4 px-3">Book now</Button>
          </Col>
        </Row>
      </Form>
    )
  }

  getCompletedComponent = () => {
    return (
      <>
        <div className="px-payment">
          <h4>Booking completed</h4>
          <div className="mx-3 mx-md-5 text-left">
            Thank you for choosing us, you can check the information of this booking at the Reservation Menu.
          </div>
        </div>
        <br />
        <Row className="justify-content-center">
          <Button variant="success" href="/reservation">View Reservation</Button>
        </Row>
      </>
    )
  }
}