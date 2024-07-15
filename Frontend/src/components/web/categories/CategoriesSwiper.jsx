// CategoriesSwiper.js
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./categories.css";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { useQuery } from "react-query";
import { getActiveCategories } from "../../../api/categories.js";
import Loading from "../../loading/Loading.jsx";
import SubcategoriesModal from "./SubcategoriesModal.jsx";
import Products from "../products/Products.jsx";

const CategoriesSwiper = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { data, isLoading, error } = useQuery(
    ["categories"],
    getActiveCategories
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error || !data) {
    return (
      <section>
        <h2>خطأ في استرجاع البيانات</h2>
      </section>
    );
  }

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    // console.log(selectedCategory)
    setShowModal(true);
  };

  const handleSubcategoryClick = (category, subcategory) => {
    setShowModal(false);
    const categorySlug = encodeURIComponent(category.slug);
    const subcategorySlug = encodeURIComponent(subcategory.slug);

    navigate(`/${subcategorySlug}/${categorySlug}`, {
      state: { subcategoryId: subcategory._id },
    });
  };

  return (
    <div className="category-swiper-container mb-5">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        loop={true}
        pagination={{ clickable: true, el: ".swiper-custom-pgination" }}
        autoplay={{ delay: 2000 }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 10,
          },
          1024: {
            slidesPerView: 5.5,
            spaceBetween: 10,
          },
        }}
      >
        {data?.category?.map((category) => (
          <SwiperSlide
            key={category._id}
            className="d-flex justify-content-center align-items-center"
            onClick={() => handleCategoryClick(category)}
          >
            <div className="category m-auto text-center">
              <img src={category.image} className="rounded-circle shadow" />
              <p className="category-name text-center fw-bold mt-1">
                {category.name}
              </p>
            </div>
          </SwiperSlide>
        ))}
        <div className="swiper-custom-pgination text-center mt-4"></div>
      </Swiper>
      {/*console.log(selectedCategory)*/}
      {selectedCategory && (
        <SubcategoriesModal
          show={showModal}
          onHide={() => setShowModal(false)}
          selectedCategory={selectedCategory}
          handleSubcategoryClick={handleSubcategoryClick}
        />
      )}
    </div>
  );
};

export default CategoriesSwiper;
