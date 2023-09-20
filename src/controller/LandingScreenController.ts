interface LandingScreenControllerProps {
  navigate: (to: string) => void;
}

const LandingScreenController = ({
  navigate,
}: LandingScreenControllerProps) => {
  const goToChatView = () => {
    navigate("/chatview");
  };

  return {
    goToChatView,
  };
};

export default LandingScreenController;
