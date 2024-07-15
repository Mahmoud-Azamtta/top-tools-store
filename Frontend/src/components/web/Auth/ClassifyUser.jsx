import "./auth.css";
import { useState } from "react";
import { Container, ToggleButton } from "react-bootstrap";

function ClassifyUser() {
  const [activeTap, setActiveTap] = useState("userType");
  const userTypes = {
    craftsman: "صاحب حرفة",
    hobbyist: "هاوي",
    other: "غير ذلك",
  };

  const [userToggles, setUserToggles] = useState(
    Object.keys(userTypes).reduce((acc, cur) => {
      acc[cur] = false;
      return acc;
    }, {}),
  );

  const interests = {
    carpentry: "نجارة",
    blacksmith: "حدادة",
    farmer: "زراعة",
    electrician: "كهربائي",
    painting: "دهان",
    heavy: "أدوات ثقيلة",
  };

  const [interestsToggles, setInterestsToggles] = useState(
    Object.keys(interests).reduce((acc, cur) => {
      acc[cur] = false;
      return acc;
    }, {}),
  );

  const [selectedOptions, setSelectedOptions] = useState({
    userTypes: [],
    interests: [],
  });

  const handleUsersToggles = (type) => {
    setUserToggles((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
    const newUserTypes = !userToggles[type]
      ? [...selectedOptions.userTypes, type]
      : selectedOptions.userTypes.filter((prevType) => prevType !== type);
    setSelectedOptions((prev) => ({ ...prev, userTypes: newUserTypes }));
  };

  const handleInterestsToggles = (interest) => {
    setInterestsToggles((prev) => ({
      ...prev,
      [interest]: !prev[interest],
    }));
    const newUserInterests = !interestsToggles[interest]
      ? [...selectedOptions.interests, interest]
      : selectedOptions.interests.filter(
          (prevInterest) => prevInterest !== interest,
        );
    setSelectedOptions((prev) => ({ ...prev, interests: newUserInterests }));
  };

  console.log(selectedOptions);
  const userTogglesButtons = Object.keys(userTypes).map((type) => (
    <ToggleButton
      key={type}
      className={`ms-3 mt-2 ${userToggles[type] ? "toggle-checked" : "toggle"}`}
      id={type}
      type="checkbox"
      variant="outline"
      checked={userToggles[type]}
      onChange={() => handleUsersToggles(type)}
    >
      {userTypes[type]}
    </ToggleButton>
  ));

  const interestsTogglesButtons = Object.keys(interests).map((interest) => (
    <ToggleButton
      key={interest}
      className={`ms-3 mt-2 ${interestsToggles[interest] ? "toggle-checked" : "toggle"}`}
      id={interest}
      type="checkbox"
      variant="outline"
      checked={interestsToggles[interest]}
      onChange={() => handleInterestsToggles(interest)}
    >
      {interests[interest]}
    </ToggleButton>
  ));

  return (
    <Container>
      <section className="auth-wrapper min-vh-100">
        <div className="auth-card bg-white border shadow-sm rounded-4">
          <h2 className="auth-title pb-2">صِف نفسك</h2>
          <p>ساعدنا في معرفة اهتماماتك</p>
          <p>اختار احد الخيارات (خيار واحد او اكثر)</p>
          <article>
            <div className="options">
              {activeTap === "userType"
                ? userTogglesButtons
                : interestsTogglesButtons}
            </div>
            <nav className="options-navs pt-3 d-flex justify-content-between mt-4">
              {activeTap !== "userType" && (
                <button
                  className="btn nav-btn ms-auto"
                  onClick={() => setActiveTap("userType")}
                >
                  <svg
                    width="18px"
                    height="18px"
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
                        d="M6 12H18M18 12L13 7M18 12L13 17"
                        stroke="#000000"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />{" "}
                    </g>
                  </svg>
                  رجوع
                </button>
              )}
              <button
                className="btn nav-btn me-auto"
                onClick={() => setActiveTap("interests")}
              >
                التالي
                <svg
                  width="18px"
                  height="18px"
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
                      d="M6 12H18M6 12L11 7M6 12L11 17"
                      stroke="#000000"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />{" "}
                  </g>
                </svg>
              </button>
            </nav>
          </article>
        </div>
      </section>
    </Container>
  );
}

export default ClassifyUser;
