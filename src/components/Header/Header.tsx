import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

interface HeaderProps {
  onViewHistory?: () => void; // New prop to handle view history
}

const Header: React.FC<HeaderProps> = ({ onViewHistory }) => {
  const navigate = useNavigate();

  //* Redux toolkit getUser
  // const dispatch = useDispatch<AppDispatch>();

  // const user = useAppSelector((state: RootState) => state.user.user); // Assuming your slice state is at user.value

  // useEffect(() => {
  //   if (user) {
  //     console.log(`${user.uid}`);
  //   } else {
  //     console.log("NO USER.");
  //   }
  // }, [user]);

  // const [showDropdown, setShowDropdown] = useState(false);

  const handleReturnToHome = () => {
    navigate("/");
  };

  // const handleProfileClick = () => {
  //   if (user) {
  //     setShowDropdown(!showDropdown);
  //   } else {
  //     navigate("/auth");
  //   }
  // };

  // const handleLogout = () => {
  //   dispatch(logout());
  // };

  return (
    <div className="header">
      <h2>Urban.AI</h2>
      <div className="profile-circle" onClick={handleReturnToHome}>
        <h3>Sign Up / Login</h3>
      </div>
    </div>
  );
};

export default Header;
