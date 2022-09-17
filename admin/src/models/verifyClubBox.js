import React from 'react';

export default function VerifyClubBox(props){

    return (
        <div className="box">
            <h1>{props.name}</h1>
            <h4>nick: {props.nick}</h4>
            <h4>website: {props.website}</h4>
            <h4>e-mail: {props.mail}</h4>
            <h4>price: {props.price}$</h4>
            <div className="decision">
                <form id="decision-form">
                    <input type="hidden" name="name" value={props.name}/>
                    <input type="hidden" name="nick" className="nick" value={props.nick}/>
                    <input type="hidden" name="website" value={props.website}/>
                    <input type="hidden" name="support_email" value={props.mail}/>
                    <input type="hidden" name="password" value={props.password}/>
                    <input type="hidden" name="price" value={props.price}/>
                </form>
                <button className="inline verify" onClick={props.onVerify} form="decision-form">Verify</button>
                <button className="inline decline" onClick={props.onUnverify}>Decline</button>
            </div>
        </div>
    );
}