import {useEffect, useState} from "react";
import VerifyClubBox from "./verifyClubBox";
import {fetchUnVerifiedClubs, unverifyClub, verifyClub} from "../apiCalls/apis";
import {LineWave} from "react-loader-spinner";

export default function VerifyPanel(){
    const [clubsToVerify, setClubsToVerify] = useState([]);
    const [fetched, setFetched] = useState(false);
    useEffect(() => {
        fetchUnVerifiedClubs().then(r => {
            setClubsToVerify(r);
            setFetched(true);
        });
    }, []);
    const handleVerify = async (target) => {
        target.preventDefault();
        let data = {};
        Array.from(target.target.parentElement.getElementsByTagName("input"))
            .forEach(el => {
                data[el.name] = el.value;
            });
        let results = await verifyClub(data);
        setClubsToVerify(results);
    };

    const handleUnverify = async (target) => {
        target.preventDefault();
        let data = {};
        let el = target.target.parentElement.getElementsByClassName("nick").item(0);
        data[el.name] = el.value;
        let results = await unverifyClub(data);
        setClubsToVerify(results);
    };

    if(fetched){
        return (
            clubsToVerify.length === 0
                ? <h3>No clubs to verify</h3>
                : clubsToVerify.map(e => <VerifyClubBox
                    name={e.name}
                    nick={e.nick}
                    website={e.website}
                    mail={e.support_email}
                    password={e.password}
                    price={e.price}
                    key={e.nick}
                    onVerify={handleVerify}
                    onUnverify={handleUnverify}
                />)
        );
    }else{
        return <LineWave/>
    }
}