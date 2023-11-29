import React from "react";
import { useNavigate } from "react-router-dom";

import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useEffect } from "react";

function Dashboard() {
  const navigate = useNavigate();

  const currentURL = window.location.href;
  const segments = currentURL.split("/");
  // Get the last segment after splitting by '/'
  const route = segments[segments.length - 1];

  const [value, setValue] = React.useState("home");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const ChangeRoute = (route) => {
    navigate(`/${route}`);
  };

  useEffect(() => {
    if (route) {
      setValue(route);
    } else {
      setValue("home");
    }
  }, [route]);

  return (
    <>
      <div className="bottom-navigation">
        <BottomNavigation
          sx={{
            width: "100%",
            position: "sticky",
            bottom: 0,
            left: 0,
            color: "white",
            background: "var(--primary-bg)",
          }}
          value={value}
          onChange={handleChange}
        >
          <BottomNavigationAction
            label="Home"
            value="home"
            icon={<HomeIcon />}
            onClick={() => ChangeRoute("")}
            sx={{ color: "white" }}
          />
          <BottomNavigationAction
            label="Sale"
            value="saleinvoice"
            icon={<LocalMallIcon />}
            onClick={() => ChangeRoute("saleinvoice")}
            sx={{ color: "white" }}
          />
          <BottomNavigationAction
            label="Purchase"
            value="purchase"
            icon={<ShoppingCartIcon />}
            onClick={() => ChangeRoute("purchase")}
            sx={{ color: "white" }}
          />
          <BottomNavigationAction
            label="User"
            value="user"
            icon={<AccountCircleIcon />}
            onClick={() => ChangeRoute("user")}
            sx={{ color: "white" }}
          />

        </BottomNavigation>
      </div>
    </>
  );
}

export default Dashboard;
