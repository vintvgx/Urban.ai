// MyCustomButton.js

import React from "react";

interface SocialCustomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  imageURL?: string;
}

const SocialCustomButton: React.FC<SocialCustomButtonProps> = ({
  children,
  onClick,
  imageURL,
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: "white",
        color: "black",
        padding: "1rem",
        border: "1px solid #ddd",
        // boxShadow: "2px 2px 10px rgba(0,0,0,0.3)",
        borderRadius: "5px",
        width: "100%",
        height: "40px",
        display: "flex",
        alignItems: "left",
        justifyContent: "center",
        textAlign: "center",
        // margin: "20px",
        marginBottom: "10px",
      }}>
      <img
        src={imageURL}
        alt="Google"
        style={{
          width: "20px",
          height: "20px",
          marginRight: "10px",
          alignSelf: "center",
        }}
      />
      <p
        style={{
          color: "black",
          alignSelf: "center",
          fontWeight: "normal",
          height: "15px",
          fontSize: "15px",
        }}>
        {children}
      </p>
    </button>
  );
};

export default SocialCustomButton;
