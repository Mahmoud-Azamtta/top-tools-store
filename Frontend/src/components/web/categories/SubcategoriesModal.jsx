import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useQuery } from 'react-query';
import Loading from '../../loading/Loading.jsx';
import { getActiveSubcategories } from '../../../api/subcategories.js';

const SubcategoriesModal = ({ show, onHide, selectedCategory, handleSubcategoryClick }) => {

  const { data, isLoading, error } = useQuery(
    ['subcategories', selectedCategory._id],
    () => getActiveSubcategories(selectedCategory._id), 
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <section>
        <h2>خطأ في استرجاع البيانات</h2>
      </section>
    );
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title className="m-auto text-center"> الفئة التي تريدها لعرض منتجاتها <br />لـ <span className='text-danger text-center'>{selectedCategory.name}</span></Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        
        {data?.map((subcategory) => (
          <Button
            variant="warning"
            key={subcategory._id}
            onClick={() => handleSubcategoryClick(selectedCategory, subcategory)}
            className="m-1 w-50 fw-bold"
          >
            {subcategory.name}
          </Button>
        ))}
      </Modal.Body>
    </Modal>
  );
};

export default SubcategoriesModal;
