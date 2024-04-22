import React from "react";
import { GiBlackHoleBolas } from "react-icons/gi";

const Footer = () => {
  return (
    <footer className="footer footer-center p-10 bg-primary text-primary-content">
      <aside>
        <GiBlackHoleBolas className="text-6xl" />
        <p className="font-bold text-xl">
          Smart Pothole Detection & Reporting System <br />
          <span className="text-sm">Saving lives one pothole at a time.</span>
        </p>
        <p>Copyright © 2024 - All right reserved</p>
      </aside>
    </footer>
  );
};

export default Footer;
