import react, { useEffect, useState } from "react";
import "./sideNavBar.scss";
import { Link, useLocation } from "react-router-dom";
const SideNavBar = () => {
  const [pathName, setPathName] = useState<any>();
  const location = useLocation();
  useEffect(() => {
    setPathName(location.pathname);
  }, [location, pathName]);
  return (
    <div>
      <div className="sidebar">
        <div className="side-bar-wrapper">
          <div>{/* <img src="../../assets/images/zlogo" /> */}</div>
          <Link to="/home">
            <div
              className={
                pathName === "/home"
                  ? "side-bar-icon-wrapper-active"
                  : "side-bar-icon-wrapper"
              }
            >
              <i className="fa-solid fa-house"></i>
            </div>
          </Link>
          <Link to="/dashboard">
            <div
              className={
                pathName === "/dashboard"
                  ? "side-bar-icon-wrapper-active"
                  : "side-bar-icon-wrapper"
              }
            >
              <i className="fa-solid fa-gauge"></i>
            </div>
          </Link>

          <Link to="/softPhone">
            <div
              className={
                pathName === "/softPhone"
                  ? "side-bar-icon-wrapper-active"
                  : "side-bar-icon-wrapper"
              }
            >
              <i className="fa-solid fa-phone"></i>
            </div>
          </Link>
          <Link to="/chat">
            <div
              className={
                pathName === "/chat"
                  ? "side-bar-icon-wrapper-active"
                  : "side-bar-icon-wrapper"
              }
            >
              <i className="fa-solid fa-comment"></i>
            </div>
          </Link>
          <Link to="/email">
            <div
              className={
                pathName === "/email"
                  ? "side-bar-icon-wrapper-active"
                  : "side-bar-icon-wrapper"
              }
            >
              <i className="fa-solid fa-envelope"></i>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SideNavBar;
