import React from "react";

export default function Header(props){
    return (
        <div className="header">
            <h1>Admin Panel - {props.section}</h1>
        </div>
    );
}