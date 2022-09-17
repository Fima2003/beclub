import React from "react";
import VerifyPanel from "./verifyPanel";

export default function MainPanel(props){
    let mainWidget;
    switch(props.section){
        case "verify":
            mainWidget = <VerifyPanel/>;
            break;
        default:
            mainWidget=<h3>To be implemented...</h3>;
    }

    return (
        <div className="main column">
            {mainWidget}
        </div>
    );
}