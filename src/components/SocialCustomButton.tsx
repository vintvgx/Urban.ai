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
        width: "225px",
        height: "40px",
        display: "flex",
        alignItems: "center",
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
          fontSize: "14px",
          alignSelf: "center",
          fontWeight: "bold",
          height: "15px",
        }}>
        {children}
      </p>
    </button>
  );
};

export default SocialCustomButton;
