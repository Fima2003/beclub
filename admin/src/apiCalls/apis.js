exports.is_signed_in = async function(){
    let response = await fetch(
        "http://localhost:8080/",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem("token")
            },
        }
    )
    if(response){
        let body = await response.json();
        if(body) {
            return body.code === 200;
        }
    }
}


exports.sign_in = async (data) => {
    let result = await fetch('http://localhost:8080/api/users/sign_in',{
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
    });
    let fetchedData = await result.json();
    localStorage.setItem("token", fetchedData.token);
    return fetchedData.code === 200;
}

exports.fetchUnVerifiedClubs = async function (){
    let result = await fetch("http://localhost:8080/api/admin/unVerifiedClubs", {
        headers: {
            "x-access-token": localStorage.getItem("token"),
            "Content-Type": "application/json",
        }
    });
    return await result.json();
}

exports.verifyClub = async function(data){
    let results = await fetch("http://localhost:8080/api/vcm/verify",{
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token")
        }
    });
    if(results.ok) {
        let body = await results.json();
        /** DO NOT DELETE THIS LINE*/
        console.log("password for " + data.nick + ": " + body.password);
        return body.results;
    }
}

exports.unverifyClub = async function (data){
    let results = await fetch("http://localhost:8080/api/vcm/unverify",{
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token")
        }
    });
    if(results.ok){
        let body = await results.json();
        return body.results;
    }
}