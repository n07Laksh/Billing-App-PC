import { useNavigate } from 'react-router-dom';

const NavigationHandler = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  // Additional logic or state handling if needed

  return null; // This component doesn't render anything, it's just for handling navigation
};

export default NavigationHandler;

