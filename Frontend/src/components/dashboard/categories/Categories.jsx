import "./Categories.css";
import React, { useContext, useState } from "react";
import { Row, Col, Button, OverlayTrigger, Popover } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getAllCategories, updateCategory } from "../../../api/categories";
import { LoginContext } from "../../../contexts/LoginContext";
import Loading from "../../loading/Loading";
import { Outlet, Link } from "react-router-dom";
import DeleteCategory from "./DeleteCategory";
import CreateSubcategory from "./CreateSubcategory";
import UpdateSubcategory from "./UpdateSubcategory";
import DeleteSub from "./DeleteSub";
import { updateSubcategory } from "../../../api/subcategories";
import toast from "react-hot-toast";
import OverlayLoading from "../../loading/OverlayLoading";

const Categories = () => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCreateSubDialog, setShowCreateSubDialog] = useState(false);
  const [showDeleteSubDialog, setShowDeleteSubDialog] = useState(false);
  const [showUpdateSubDialog, setShowUpdateSubDialog] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState({});
  const [selectedSub, setSelectedSub] = useState({});

  const queryClient = useQueryClient();

  const { userToken } = useContext(LoginContext);

  const { data, isError, isLoading } = useQuery(
    ["categories"],
    () => getAllCategories(userToken),
    { enabled: !!userToken },
  );

  const hideCategoryMutation = useMutation(
    ({ data, id }) => updateCategory(userToken, id, data),
    {
      onSuccess: (data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          queryClient.invalidateQueries(["categories"]);
        }
      },
    },
  );

  const hideSubMutation = useMutation(
    ({ data, id }) => updateSubcategory(userToken, id, data),
    {
      onSuccess: (data) => {
        if (data.error) {
          toast.error(data.error);
        }
      },
    },
  );

  const handleHide = (sub) => {
    sub.status === "Active"
      ? (sub.status = "Inactive")
      : (sub.status = "Active");

    hideSubMutation.mutate({
      data: {
        name: sub.name,
        status: sub.status,
      },
      id: sub._id,
    });
  };

  const handleHideCategory = ({ data, id }) => {
    data.status === "Active"
      ? (data.status = "Inactive")
      : (data.status = "Active");

    const formData = new FormData();
    formData.set("name", data.name);
    formData.set("status", data.status);
    formData.set("id", id);

    hideCategoryMutation.mutate({ data: formData, id });
  };

  if (isLoading || !userToken || !data?.category) {
    return <Loading />;
  }

  if (isError) {
    return (
      <section className="vh-100 d-flex justify-content-center align-items-center">
        <p className="text-danger fs-5">خطأ غير معروف...</p>
      </section>
    );
  }

  const renderedCategories = data.category?.map((categ) => (
    <div
      key={categ._id}
      className="border rounded shadow-sm my-5 p-4 position-relative"
    >
      <Row className="gap-3">
        <Col xs={12} sm={5} md={5} xl={4}>
          <div className="d-flex justify-content-between mb-2">
            <h3 className="fs-4">{categ.name}</h3>
            <Button
              className="d-block status-button p-1"
              onClick={() => {
                handleHideCategory({
                  data: {
                    name: categ.name,
                    status: categ.status,
                  },
                  id: categ._id,
                });
              }}
            >
              {categ.status === "Inactive" ? (
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M12 7C7.60743 7 4.49054 10.5081 3.41345 11.9208C3.15417 12.2609 3.17881 12.7211 3.4696 13.0347C4.66556 14.3243 8.01521 17.5 12 17.5C15.9848 17.5 19.3344 14.3243 20.5304 13.0347C20.8212 12.7211 20.8458 12.2609 20.5865 11.9208C19.5095 10.5081 16.3926 7 12 7Z"
                      stroke="#fff"
                      strokeWidth={2}
                    />{" "}
                    <path
                      d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z"
                      fill="#fff"
                    />{" "}
                  </g>
                </svg>
              ) : (
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10.6484 10.5264L13.4743 13.3523C13.8012 12.9962 14.0007 12.5214 14.0007 12C14.0007 10.8954 13.1053 10 12.0007 10C11.4793 10 11.0045 10.1995 10.6484 10.5264Z"
                      fill="#fff"
                    />{" "}
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M14.1211 18.2422C13.4438 18.4051 12.7343 18.5 12.0003 18.5C9.7455 18.5 7.72278 17.6047 6.14832 16.592C4.56791 15.5755 3.3674 14.3948 2.73665 13.7147C2.11883 13.0485 2.06103 12.0457 2.6185 11.3145C3.05443 10.7428 3.80513 9.84641 4.83105 8.95209L6.24907 10.3701C5.35765 11.1309 4.68694 11.911 4.2791 12.436C4.86146 13.0547 5.90058 14.0547 7.23022 14.9099C8.62577 15.8075 10.2703 16.5 12.0003 16.5C12.1235 16.5 12.2463 16.4965 12.3686 16.4896L14.1211 18.2422ZM15.6656 15.544L17.1427 17.0211C17.3881 16.8821 17.6248 16.7383 17.8522 16.592C19.4326 15.5755 20.6332 14.3948 21.2639 13.7147C21.8817 13.0485 21.9395 12.0457 21.3821 11.3145C20.809 10.563 19.6922 9.25059 18.1213 8.1192C16.5493 6.98702 14.4708 6 12.0003 6C10.229 6 8.65936 6.50733 7.33335 7.21175L8.82719 8.70559C9.78572 8.27526 10.8489 8 12.0003 8C13.9223 8 15.5986 8.76704 16.9524 9.7421C18.2471 10.6745 19.1995 11.7641 19.7215 12.436C19.1391 13.0547 18.1 14.0547 16.7703 14.9099C16.4172 15.137 16.0481 15.3511 15.6656 15.544Z"
                      fill="#fff"
                    />{" "}
                    <path
                      d="M4 5L19 20"
                      stroke="#fff"
                      strokeWidth={2}
                      strokeLinecap="round"
                    />{" "}
                  </g>
                </svg>
              )}
            </Button>
          </div>
          <div className="p-3 mb-3 border rounded-3">
            <img
              className="w-100 rounded-3"
              src={categ.image}
              alt="اضافة منتج"
            />
          </div>

          <div className="category-operations d-flex justify-content-between">
            <Button
              as={Link}
              to={`update/${categ.slug}`}
              state={{ data: categ }}
              variant="secondary"
              className="d-block"
            >
              <span className="ms-2">تعديل</span>
              <svg
                stroke="#fff"
                width="18px"
                height="18px"
                viewBox="0 0 24 24"
                id="update-alt"
                data-name="Flat Line"
                xmlns="http://www.w3.org/2000/svg"
                className="icon flat-line"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="SVGRepo_iconCarrier">
                  <path
                    id="primary"
                    d="M5.07,8A8,8,0,0,1,20,12"
                    style={{
                      fill: "none",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                    }}
                  />
                  <path
                    id="primary-2"
                    data-name="primary"
                    d="M18.93,16A8,8,0,0,1,4,12"
                    style={{
                      fill: "none",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                    }}
                  />
                  <polyline
                    id="primary-3"
                    data-name="primary"
                    points="5 3 5 8 10 8"
                    style={{
                      fill: "none",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                    }}
                  />
                  <polyline
                    id="primary-4"
                    data-name="primary"
                    points="19 21 19 16 14 16"
                    style={{
                      fill: "none",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                    }}
                  />
                </g>
              </svg>
            </Button>

            <Button
              variant="danger"
              className="d-block"
              onClick={() => {
                setSelectedCategory({
                  name: categ.name,
                  id: categ._id,
                });
                setShowDeleteDialog(true);
              }}
            >
              <span className="ms-2">حذف</span>
              <svg
                width="18px"
                height="18px"
                viewBox="0 0 1024 1024"
                className="icon"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                fill="#fff"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="SVGRepo_iconCarrier">
                  <path d="M960 160h-291.2a160 160 0 0 0-313.6 0H64a32 32 0 0 0 0 64h896a32 32 0 0 0 0-64zM512 96a96 96 0 0 1 90.24 64h-180.48A96 96 0 0 1 512 96zM844.16 290.56a32 32 0 0 0-34.88 6.72A32 32 0 0 0 800 320a32 32 0 1 0 64 0 33.6 33.6 0 0 0-9.28-22.72 32 32 0 0 0-10.56-6.72zM832 416a32 32 0 0 0-32 32v96a32 32 0 0 0 64 0v-96a32 32 0 0 0-32-32zM832 640a32 32 0 0 0-32 32v224a32 32 0 0 1-32 32H256a32 32 0 0 1-32-32V320a32 32 0 0 0-64 0v576a96 96 0 0 0 96 96h512a96 96 0 0 0 96-96v-224a32 32 0 0 0-32-32z" />
                  <path d="M384 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0zM544 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0zM704 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0z" />
                </g>
              </svg>
            </Button>
          </div>
        </Col>
        <Col>
          <h3 className="fs-5">الاصناف الفرعية</h3>
          <Row>
            {categ.subcategory.length > 0 ? (
              categ.subcategory.map((sub) => (
                <div
                  key={sub._id}
                  className={`d-flex justify-content-between align-items-center mt-1 py-1 border-bottom 
                  ${sub.status === "Active" ? "" : "inactive-bg rounded"}`}
                >
                  <h4 className="fs-6 m-0">{sub.name}</h4>
                  <div className="sub-operations d-flex gap-2 justify-content-between">
                    <Button
                      className="d-block status-button"
                      onClick={() => handleHide(sub)}
                    >
                      {sub.status === "Active" ? (
                        <svg
                          width="24px"
                          height="24px"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                          <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M10.6484 10.5264L13.4743 13.3523C13.8012 12.9962 14.0007 12.5214 14.0007 12C14.0007 10.8954 13.1053 10 12.0007 10C11.4793 10 11.0045 10.1995 10.6484 10.5264Z"
                              fill="#fff"
                            />{" "}
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M14.1211 18.2422C13.4438 18.4051 12.7343 18.5 12.0003 18.5C9.7455 18.5 7.72278 17.6047 6.14832 16.592C4.56791 15.5755 3.3674 14.3948 2.73665 13.7147C2.11883 13.0485 2.06103 12.0457 2.6185 11.3145C3.05443 10.7428 3.80513 9.84641 4.83105 8.95209L6.24907 10.3701C5.35765 11.1309 4.68694 11.911 4.2791 12.436C4.86146 13.0547 5.90058 14.0547 7.23022 14.9099C8.62577 15.8075 10.2703 16.5 12.0003 16.5C12.1235 16.5 12.2463 16.4965 12.3686 16.4896L14.1211 18.2422ZM15.6656 15.544L17.1427 17.0211C17.3881 16.8821 17.6248 16.7383 17.8522 16.592C19.4326 15.5755 20.6332 14.3948 21.2639 13.7147C21.8817 13.0485 21.9395 12.0457 21.3821 11.3145C20.809 10.563 19.6922 9.25059 18.1213 8.1192C16.5493 6.98702 14.4708 6 12.0003 6C10.229 6 8.65936 6.50733 7.33335 7.21175L8.82719 8.70559C9.78572 8.27526 10.8489 8 12.0003 8C13.9223 8 15.5986 8.76704 16.9524 9.7421C18.2471 10.6745 19.1995 11.7641 19.7215 12.436C19.1391 13.0547 18.1 14.0547 16.7703 14.9099C16.4172 15.137 16.0481 15.3511 15.6656 15.544Z"
                              fill="#fff"
                            />{" "}
                            <path
                              d="M4 5L19 20"
                              stroke="#fff"
                              strokeWidth={2}
                              strokeLinecap="round"
                            />{" "}
                          </g>
                        </svg>
                      ) : (
                        <svg
                          width="24px"
                          height="24px"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                          <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <path
                              d="M12 7C7.60743 7 4.49054 10.5081 3.41345 11.9208C3.15417 12.2609 3.17881 12.7211 3.4696 13.0347C4.66556 14.3243 8.01521 17.5 12 17.5C15.9848 17.5 19.3344 14.3243 20.5304 13.0347C20.8212 12.7211 20.8458 12.2609 20.5865 11.9208C19.5095 10.5081 16.3926 7 12 7Z"
                              stroke="#fff"
                              strokeWidth={2}
                            />{" "}
                            <path
                              d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z"
                              fill="#fff"
                            />{" "}
                          </g>
                        </svg>
                      )}
                    </Button>

                    <Button
                      variant="secondary"
                      className="d-block update-button"
                      onClick={() => {
                        setSelectedSub({
                          name: sub.name,
                          status: sub.status,
                          id: sub._id,
                        });
                        setShowUpdateSubDialog(true);
                      }}
                    >
                      <svg
                        stroke="#fff"
                        width="18px"
                        height="18px"
                        viewBox="0 0 24 24"
                        id="update-alt"
                        data-name="Flat Line"
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon flat-line"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <g id="SVGRepo_iconCarrier">
                          <path
                            id="primary"
                            d="M5.07,8A8,8,0,0,1,20,12"
                            style={{
                              fill: "none",
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              strokeWidth: 2,
                            }}
                          />
                          <path
                            id="primary-2"
                            data-name="primary"
                            d="M18.93,16A8,8,0,0,1,4,12"
                            style={{
                              fill: "none",
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              strokeWidth: 2,
                            }}
                          />
                          <polyline
                            id="primary-3"
                            data-name="primary"
                            points="5 3 5 8 10 8"
                            style={{
                              fill: "none",
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              strokeWidth: 2,
                            }}
                          />
                          <polyline
                            id="primary-4"
                            data-name="primary"
                            points="19 21 19 16 14 16"
                            style={{
                              fill: "none",
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              strokeWidth: 2,
                            }}
                          />
                        </g>
                      </svg>
                    </Button>

                    <Button
                      variant="danger"
                      className="d-block delete-button"
                      onClick={() => {
                        setSelectedSub(sub);
                        setShowDeleteSubDialog(true);
                      }}
                    >
                      <svg
                        width="18px"
                        height="18px"
                        viewBox="0 0 1024 1024"
                        className="icon"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#fff"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <g id="SVGRepo_iconCarrier">
                          <path d="M960 160h-291.2a160 160 0 0 0-313.6 0H64a32 32 0 0 0 0 64h896a32 32 0 0 0 0-64zM512 96a96 96 0 0 1 90.24 64h-180.48A96 96 0 0 1 512 96zM844.16 290.56a32 32 0 0 0-34.88 6.72A32 32 0 0 0 800 320a32 32 0 1 0 64 0 33.6 33.6 0 0 0-9.28-22.72 32 32 0 0 0-10.56-6.72zM832 416a32 32 0 0 0-32 32v96a32 32 0 0 0 64 0v-96a32 32 0 0 0-32-32zM832 640a32 32 0 0 0-32 32v224a32 32 0 0 1-32 32H256a32 32 0 0 1-32-32V320a32 32 0 0 0-64 0v576a96 96 0 0 0 96 96h512a96 96 0 0 0 96-96v-224a32 32 0 0 0-32-32z" />
                          <path d="M384 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0zM544 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0zM704 768V352a32 32 0 0 0-64 0v416a32 32 0 0 0 64 0z" />
                        </g>
                      </svg>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-secondary border-bottom text-center fs-6">
                لا يوجد اصناف فرعية
              </p>
            )}

            <OverlayTrigger
              trigger={["hover", "focus"]}
              overlay={
                <Popover className="p-2 mb-1">
                  اضافة صنف فرعي ل<span>{categ.name}</span>
                </Popover>
              }
            >
              <Button
                className="add-new-btn mt-4"
                onClick={() => {
                  setSelectedCategory({ name: categ.name, id: categ.id });
                  setShowCreateSubDialog(true);
                }}
              >
                <img src="/svgs/plus-sign.svg" />
              </Button>
            </OverlayTrigger>
          </Row>
        </Col>
      </Row>
    </div>
  ));

  return (
    <section className="position-relative">
      {hideCategoryMutation.isLoading && <OverlayLoading />}
      <h2 className="border-bottom pb-2 mt-2">قائمة الاصناف</h2>

      <OverlayTrigger
        trigger={["hover", "focus"]}
        overlay={<Popover className="p-2 mb-1">إضافة صنف جديد</Popover>}
      >
        <Button className="add-new-btn mt-4" as={Link} to="create">
          <img src="/svgs/plus-sign.svg" />
        </Button>
      </OverlayTrigger>
      {renderedCategories}
      <Outlet />
      <DeleteCategory
        show={showDeleteDialog}
        setShow={setShowDeleteDialog}
        selectedCategory={selectedCategory}
      />
      <CreateSubcategory
        selectedCategory={selectedCategory}
        show={showCreateSubDialog}
        setShow={setShowCreateSubDialog}
      />
      <DeleteSub
        selectedSub={selectedSub}
        show={showDeleteSubDialog}
        setShow={setShowDeleteSubDialog}
      />
      <UpdateSubcategory
        selectedSub={selectedSub}
        show={showUpdateSubDialog}
        setShow={setShowUpdateSubDialog}
      />
    </section>
  );
};

export default Categories;
