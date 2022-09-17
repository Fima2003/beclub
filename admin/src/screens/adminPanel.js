import {useState} from "react";
import Header from "../models/header";
import SidePanel from "../models/sidePanel";
import MainPanel from "../models/mainPanel";

export default function AdminPanel(){
    const [section, setSection] = useState("verify");

    const handleClick = ({target}) => {
        setSection(target.id);
    }

    return (
        <main>
            <Header section={section}/>
            <SidePanel handleClick={handleClick}/>
            <MainPanel section={section}/>
        </main>
    );
}