import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import userImage from "../images/user.png";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const User = (props) => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [shop, setShop] = useState("");
  const [name, setName] = useState("Name");
  const [email, setEmail] = useState("Email");
  const [shopName, setShopName] = useState(null);
  const [shopAddress, setShopAddress] = useState(null);
  const [shopContact, setShopContact] = useState(null);
  const [GSTNum, setGSTNum] = useState(null);

  const user = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = () => {
    try {
      if (user) {
        setName(user.name);
        setEmail(user.email);
      }

      const userAddCon = JSON.parse(
        localStorage.getItem(`userAdd_${user.name}`)
      );

      if (userAddCon) {
        setShopContact(userAddCon.contact);
        setShopAddress(userAddCon.address);
        setShopName(userAddCon.shopName);
      }
    } catch (error) {
      alert(error);
    }
  };

  const handleAdd = () => {
    try {
      const userDataString = JSON.stringify({
        address: address,
        contact: contact,
        shopName: shop,
      });

      localStorage.setItem(`userAdd_${user.name}`, userDataString);
      setShopAddress(address);
      setShopContact(contact);
      setShopName(shop);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("userData");
      localStorage.removeItem("userAdd");
      props.setLogin(false);
    } catch (error) {
      console.log(error);
    }
  };

  const inputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const savedImage = localStorage.getItem(`profilePicture_${user.name}`);
    const GSTIN = localStorage.getItem(`GSTIN`);
    if (GSTIN) {
      setGSTNum(GSTIN);
    }

    if (savedImage) {
      setImagePreview(savedImage);
    }
  }, []);

  const handleFileChange = () => {
    const input = inputRef.current;

    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const imageBase64 = e.target.result;
        setImagePreview(imageBase64);
        localStorage.setItem(`profilePicture_${user.name}`, imageBase64);
      };

      reader.readAsDataURL(input.files[0]);
    }
  };

  const handleImageClick = () => {
    const input = inputRef.current;
    if (input) {
      input.click();
    }
  };

  function validateGSTNumber(gstNumber) {
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    return gstRegex.test(gstNumber);
  }

  const fetchGST = async () => {
    const isValid = validateGSTNumber(GSTNum);

    if (isValid) {
      const options = {
        method: "POST",
        url: "https://gst-verification.p.rapidapi.com/v3/tasks/sync/verify_with_source/ind_gst_certificate",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key":
            "1d0fe5cd7cmshfacc63fd8cb7723p192bccjsnaf6b60222410",
          "X-RapidAPI-Host": "gst-verification.p.rapidapi.com",
        },
        data: {
          task_id: "74f4c926-250c-43ca-9c53-453e87ceacd1",
          group_id: "8e16424a-58fc-4ba4-ab20-5bc8e7c3c41e",
          data: {
            gstin: `${GSTNum}`,
          },
        },
      };

      try {
        const response = await axios.request(options);

        const res = await fetch("http://localhost:8000/auth/gstvalidation", {
          method: "POST",
          body: JSON.stringify({ GSTIN: GSTNum }),
          headers: {
            "Content-Type": "application/json",
            jwtoken: localStorage.getItem("userData").jwtoken,
          },
        });

        const data = await res.json();

        if (!data.error) {
          localStorage.setItem("GSTIN", data.GSTIN);
          toast.success(`GSTIN validate successfully`);
        } else {
          toast.error(`GSTIN not validating properly try again`);
        }
      } catch (error) {
        toast.error(`Use the valid GSTIN`);
      }
    } else {
      toast.error("Invalid GST Number");
    }
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="back-div backdiv-width">
        <span className="back back-n" onClick={() => navigate(-1)}>
          &larr;
        </span>
        <span className="mx-5 h6 back">Profile</span>
        <span
          onClick={handleLogout}
          className="logout float-end me-4 text-primary fw-bold h5 mt-2"
        >
          Logout
        </span>
      </div>

      <div className="login-update-user-detail">
        <div className="d-flex justify-content-center">
          <div
            className="user-div user-detail-div"
            style={{
              boxShadow: "0px 2px 7px #524a58",
              background:
                "repeating-linear-gradient(-45deg, #0000000a, transparent 100px)",
            }}
          >
            {" "}
            <div className="container">
              <div className="picture-container">
                <label htmlFor="" className="picture">
                  <input
                    type="file"
                    id="wizard-picture-input"
                    className=""
                    ref={inputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <img
                    src={imagePreview}
                    alt=""
                    className="picture-src"
                    style={{ display: "block", maxWidth: "300px" }}
                    onClick={handleImageClick}
                  />
                </label>
              </div>
            </div>
            <div className="user-child-div">
              <div
                className="text-center"
                style={{
                  width: "100%",
                  background: "linear-gradient(45deg, #52c4ef1f, #343a4000)",
                  color: "darkmagenta",
                }}
              >
                <h5 className="user-name m-4">{name}</h5>
                <h5 className="email m-4">{email}</h5>
              </div>

              <div className="gst-container my-4 w-100 text-center">
                <label htmlFor="gst-num" className="py-2 fw-bold">
                  GST Number (Optional)
                </label>
                <div className="d-flex justify-content-center">
                  <input
                    onChange={(event) => setGSTNum(event.target.value)}
                    type="text"
                    value={GSTNum ? GSTNum : ""}
                    style={{
                      height: "44px",
                      borderRadius: "18px 0 0 18px",
                      paddingLeft: "10px",
                    }}
                    name="gst-num"
                    id="gst-num"
                  />
                  <button
                    onClick={fetchGST}
                    className="btn gst-fetch-btn"
                    style={{
                      borderRadius: "0 18px 18px 0",
                      background: "black",
                      height: "44px",
                      color: "white",
                    }}
                  >
                    Fetch
                  </button>
                </div>
              </div>

              <div className="text-center w-100">
                <h5 className="shopName m-4">{shopName}</h5>
                <h5 className="address m-4">{shopAddress}</h5>
                <h5 className="contact m-4">{shopContact}</h5>
              </div>
            </div>
          </div>

          <div className="detail-div user-detail-div user-add">
            <div style={{ margin: "11px", padding: "10px" }}>
              <h4>Add or Update your shop details</h4>
            </div>
            <div className="form-outline user-n m-4">
              <label className="form-label" htmlFor="address">
                Address
              </label>
              <input
                type="text"
                onChange={(e) => setAddress(e.target.value)}
                value={address}
                id="address"
                className="form-control"
              />
            </div>

            <div className="form-outline user-n m-4">
              <label className="form-label" htmlFor="contact">
                Contact
              </label>
              <input
                type="text"
                onChange={(e) => setContact(e.target.value)}
                value={contact}
                id="contact"
                className="form-control"
              />
            </div>

            <div className="form-outline user-n m-4">
              <label className="form-label" htmlFor="contact">
                Shop Name
              </label>
              <input
                type="text"
                onChange={(e) => setShop(e.target.value)}
                value={shop}
                id="contact"
                className="form-control"
              />
            </div>

            <button onClick={handleAdd} className="btn btn-primary w-75 mt-4">
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default User;
