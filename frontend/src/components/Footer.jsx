import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import {
  MDBFooter,
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBIcon,
  MDBBtn,
  MDBListGroup,
  MDBListGroupItem,
  MDBInput,
} from 'mdb-react-ui-kit';

let mybutton;

window.onscroll = function () {
  mybutton = document.getElementById('btn-back-to-top');
  scrollFunction(mybutton);
};

function scrollFunction(mybutton) {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = 'block';
  } else {
    mybutton.style.display = 'none';
  }
}

function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

export default function Footer() {
  return (
    <footer className="footer-layout">
      <Button onClick={backToTop} id="btn-back-to-top" className="back-to-top">
        <MDBIcon fas icon="arrow-up" />
      </Button>
      <div className="container">
        <div className="row text-center mb-3">
          <div className="col-md-4 mb-3">
            <ul className="nav flex-column">
              <li className="nav-item">
                <span className="footer-title">Partners</span>
              </li>
              <li className="">
                <Link
                  onClick={backToTop}
                  to="/seller/630f79417a42a911d72fc7f5"
                  className="link-item"
                >
                  Sony
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  onClick={backToTop}
                  to="/seller/630f79417a42a911d72fc7f6"
                  className="link-item"
                >
                  Microsoft
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  onClick={backToTop}
                  to="/seller/630f79417a42a911d72fc7f7"
                  className="link-item"
                >
                  Nintendo
                </Link>
              </li>
              {/* <li className="nav-item">
                <a className="link-item" href="#">
                  Plans & Prices
                </a>
              </li>
              <li className="nav-item">
                <a className="link-item" href="#">
                  Frequently asked questions
                </a>
              </li> */}
            </ul>
          </div>

          <div className="col-md-4 mb-3">
            <ul className="nav flex-column">
              <li className="nav-item">
                <span className="footer-title">About</span>
              </li>
              <li className="nav-item">
                <Link onClick={backToTop} to="/about" className="link-item">
                  About us
                </Link>
              </li>
              <li className="nav-item">
                <Link onClick={backToTop} to="/career" className="link-item">
                  Career
                </Link>
              </li>
              <li className="nav-item">
                <Link onClick={backToTop} to="/contact" className="link-item">
                  Contact
                </Link>
              </li>
              {/* <li className="nav-item">
                <a className="link-item" href="#">
                  News and articles
                </a>
              </li> */}
            </ul>
          </div>

          <div className="col-md-4 mb-3">
            <ul className="nav flex-column">
              <li className="nav-item">
                <span className="footer-title">Contact & Support</span>
              </li>
              <li className="nav-item">
                <a
                  className="link-item"
                  href="https://wa.me/351967389659"
                  target="_blank"
                >
                  <i className="fas fa-phone"></i>+351 967 389 659
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="link-item"
                  href="https://wa.me/351967389659"
                  target="_blank"
                >
                  <i className="fas fa-comments"></i>Live chat
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="link-item"
                  href="https://wa.me/351967389659"
                  target="_blank"
                >
                  <i className="fas fa-envelope"></i>Contact us
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="link-item"
                  href="https://wa.me/351967389659"
                  target="_blank"
                >
                  <i className="fas fa-star"></i>Give feedback
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="row text-center mb-3">
          <div className="col-md-12 box">
            <ul className="list-inline social-buttons">
              <li className="list-inline-item">
                <a href="https://twitter.com/serodio_carlos" target="_blank">
                  <i className="fab fa-twitter"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a href="https://github.com/csalpha" target="_blank">
                  <i className="fab fa-github"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a
                  href="https://linkedin.com/in/carlos-serodio-6b7404126"
                  target="_blank"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </li>

              <li className="list-inline-item">
                <a
                  href="https://www.youtube.com/channel/UCJtSl1227biHNWp2fnSBQdQ"
                  target="_blank"
                >
                  <i className="fab fa-youtube"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a href="https://wa.me/351967389659" target="_blank">
                  <i className="fab fa-whatsapp"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* <div className="row text-center">
          <i className="fas fa-ellipsis-h"></i>
        </div> */}

        <div className="footer-layout row text-center mb-3">
          <div className="col-md-12 box">
            <ul className=" list-inline quick-links">
              <li className="list-inline-item">
                <Link
                  className="footer-link"
                  onClick={backToTop}
                  to="/condictions"
                >
                  Conditions of Use
                </Link>
              </li>
              <li className="list-inline-item">
                <Link className="footer-link" onClick={backToTop} to="/privacy">
                  Privacy Notice
                </Link>
              </li>
              <li className="list-inline-item">
                <Link
                  className="footer-link"
                  onClick={backToTop}
                  to="/interest"
                >
                  Interest-Based Ads
                </Link>
              </li>
              <li className="list-inline-item">
                <Link className="footer-link" onClick={backToTop} to="/about">
                  <span className="copyright quick-links">
                    {' '}
                    &copy; {new Date().getFullYear()}
                    {' CARLOS SERODIO ALL RIGHTS RESERVED'}
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
