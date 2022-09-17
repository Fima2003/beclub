import React from 'react';

export default function SidePanel(props){
    return (
        <div className="side column">
            <ul>
                <li>
                    <button className="side-button" onClick={props.handleClick} id="verify">Verify</button>
                </li>
                <li>
                    <button className="side-button" onClick={props.handleClick} id="clubs">Clubs</button>
                </li>
                <li>
                    <button className="side-button" onClick={props.handleClick} id="users">Users</button>
                </li>
            </ul>
        </div>
    );
}