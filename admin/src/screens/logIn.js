import {useState} from "react";

export default function LogIn(props){
    const [data, setData] = useState({nick: "", password: ""});

    const handleChange = ({ target }) => {
        const {name, value} = target;
        setData(prev => ({...prev, [name]: value}));
    }

    return (
        <main>
            <input type="text" name="nick" placeholder="Nick" value={data.nick} onChange={handleChange}/>
            <input type="password" name="password" placeholder="Password" value={data.password} onChange={handleChange}/>
            <button onClick={() => {
                props.onSignIn(data)
            }}>Sign In</button>
        </main>
    );
}