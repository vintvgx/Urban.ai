import React from "react";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import "./AboutView.css";

const AboutView: React.FC = () => {
  return (
    <div className="container">
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
                In a world where hip-hop culture generates billions of dollars
                and plays a significant role in shaping the music industry and
                popular culture, representation becomes paramount. The influence
                of this vibrant and influential culture extends far beyond the
                music charts. It permeates every facet of modern society, from
                fashion to language, and serves as a vital expression of diverse
                voices.
              </p>
              <p style={{ marginTop: "20px" }}>
                At Urban.ai, we recognize the importance of representing this
                cultural phenomenon in a meaningful way. Our mission is to
                provide a space for autonomous knowledge through language that
                caters to a vast and diverse audience. We understand that slang
                is not just an informal approach to communication; it is a
                powerful medium and a unique form of expression that enables
                freedom of speech and creativity.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutView;
