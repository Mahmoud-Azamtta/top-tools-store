import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Container, Carousel, Row, Col } from "react-bootstrap";

const MotionCol = motion(Col);

function Header() {
  const [headerImage, setHeaderImage] = useState(null);

  const headerImages = [
    "/images/vector-art-1.png",
    "/images/vector-art-3.png",
    "/images/vector-art-4.png",
    "/images/vector-art-5.png",
    "/images/vector-art-7.png",
    "/images/vector-art-8.png",
    "/images/vector-art-9.png",
  ];

  useEffect(() => {
    const rand = Math.floor(Math.random() * 7);
    setHeaderImage(headerImages[rand]);
  }, []);

  return (
    <Container className="overflow-hidden">
      <Row className="justify-content-center align-items-around h-100">
        <MotionCol
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
          xs={12}
          lg={6}
          className="d-flex justify-content-center align-items-center pt-5"
        >
          <Carousel
            className="m-auto"
            data-bs-theme="dark"
            slide={true}
            controls={false}
            indicators={false}
            interval={10000}
          >
            <Carousel.Item>
              <p className="text-center fs-3">
                &quot;استعد للإبداع مع متجرنا للمعدات الحرفية! اكتشف تشكيلتنا
                المتنوعة من المعدات ذات الجودة العالية والتي تلبي احتياجات كل
                حرفي.&quot;
              </p>
            </Carousel.Item>
            <Carousel.Item>
              <p className="text-center fs-3">
                &quot;ابنِ أعمالك الفنية بكل ثقة واطمئنان مع معداتنا الموثوقة
                التي تضمن لك الأداء الأمثل في كل مشروع. &quot;
              </p>
            </Carousel.Item>
          </Carousel>
        </MotionCol>
        <MotionCol
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
          xs={12}
          lg={6}
          className="p-5"
        >
          <img src={headerImage} alt="" className="header-image" />
        </MotionCol>
      </Row>
    </Container>
  );
}

export default Header;
