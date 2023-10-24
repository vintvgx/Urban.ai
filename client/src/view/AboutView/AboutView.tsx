import React from "react";
import Header from "../../components/Header/Header";
import "./AboutView.css";

const AboutView: React.FC = () => {
  return (
    <div className="about-view">
      <Header setPadding={true} />
      <div className="about-title-section">
        <span className="about-title">
          Our platform is your AI agent dedicated to representation.
        </span>
      </div>
      <div className="about-content-section">
        <div className="left-column">
          <div className="about-content-title">
            <span className="about-content-title-text">Why Urban AI?</span>
          </div>
        </div>
        <div className="right-column">
          <div className="about-content">
            <p>
              URBAN.ai is a platform that uses artificial intelligence to
              represent the urban environment. We use machine learning to
              understand the urban environment and to create a digital
              representation of it.
            </p>
            <p>
              We use this digital representation to create new urban experiences
              and to help people make better decisions about the urban
              environment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutView;
