import './stylesheets/verify.css';
import { useEffect, useState } from "react";
import { is_signed_in, sign_in } from "./apiCalls/apis";
import AdminPanel from "./screens/adminPanel";
import LogIn from "./screens/logIn";

function App() {

    const [signedIn, setSignedIn] = useState(false);

    useEffect( () => {
        // localStorage.setItem("token", "");
        async function sign_in(){
            let res = await is_signed_in();
            return res;
        }
        sign_in().then(res => setSignedIn(res));
    }, []);

    const handleSignIn = async (data) => {
        let successSignIn = await sign_in(data);
        setSignedIn(successSignIn);
    }
    if(signedIn){
        return <AdminPanel/>;
    }else {
        return <LogIn onSignIn={handleSignIn}/>;
    }
}

export default App;
