import React from "react";

import "@fontsource/open-sans/800.css";
import "@fontsource/open-sans/300.css";

const ThankYouPage: React.FC = () => {
  return (
    <div className="frame">
      <div className="circle"></div>
      <div className="line left"></div>
      <div className="line right"></div>
      <div className="bracket left"></div>
      <div className="bracket right"></div>
      <div className="small top">
        <i className="fa fa-home"></i>
      </div>
      <div className="big">Gracias</div>
      <div className="small bottom">por su compra!</div>
      <div className="hide top"></div>
      <div className="hide bottom"></div>
    </div>
  );
};

export default ThankYouPage;
