import { Container, Row, Col } from "react-bootstrap";
import "./footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
      <footer className="bg-dark rounded ">
        <Container className="py-4">
          <Row className="text-white">
            <Col xs={12} md={6} lg={4}>
              <ul className="contact-info">
                <li className="contact-info-item my-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className=""
                  >
                    <path
                      fillRule="evenodd"
                      d="m7.539 14.841.003.003.002.002a.755.755 0 0 0 .912 0l.002-.002.003-.003.012-.009a5.57 5.57 0 0 0 .19-.153 15.588 15.588 0 0 0 2.046-2.082c1.101-1.362 2.291-3.342 2.291-5.597A5 5 0 0 0 3 7c0 2.255 1.19 4.235 2.292 5.597a15.591 15.591 0 0 0 2.046 2.082 8.916 8.916 0 0 0 .189.153l.012.01ZM8 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="me-2">طولكرم - بلعا</span>
                </li>
                <li className="contact-info-item my-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                    />
                  </svg>

                  <span className="me-2 " dir="ltr">
                    +970 599 782 086
                  </span>
                </li>
                <li className="contact-info-item my-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25"
                    />
                  </svg>

                  <Link
                    to="https://mail.google.com/mail/u/0/?ogbl#inbox?compose=CllgCJfmrptCNrVMzTpGfSBrqLncxxPZvpTmqqGjGwHrKrHhRvLscsshsFRtvlPwjgDFxcWfMqV"
                    className="me-2 text-email"
                  >
                    toptools2009@gmail.com
                  </Link>
                </li>

                <li className="contact-info-item my-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25"
                    />
                  </svg>

                  <Link
                    to="https://mail.google.com/mail/u/0/?ogbl#inbox?compose=CllgCJqbzqvnPqsCJwqsDTkDklzmdMxFkRdJGPXhqjJRjhXDfClMLXhNMMRsjCDjtTcWCBXBNqV"
                    className="me-2 text-email"
                  >
                    shahrorsami@gmail.com
                  </Link>
                </li>
              </ul>
            </Col>
            <Col xs={12} md={6} lg={4}>
              <div className="hoursWork py-3">
                <h5 className="text-main-dark me-4">ساعات العمل:</h5>
                <ul>
                  <li>السبت - الخميس: 7 صباحاً - 6 مساءً</li>
                  <li> الجمعة: مغلق</li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
}

export default Footer;
