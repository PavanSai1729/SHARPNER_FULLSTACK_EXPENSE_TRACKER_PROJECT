
const forgetForm = document.getElementById("forget");
forgetForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    const email = document.getElementById("forget_email").value;

    axios.post("http://localhost:1000/password/forgotpassword", { email })
        .then((response)=>{
            if(response.status === 202){
                document.body.innerHTML += '<div style="color:red;">Mail Successfully sent</div>'; 
            }
            else{
                throw new Error("Something went wrong");
            }
            
        })
        .catch((error)=>{
            console.log("forget password post request failed from front end:", error);
            document.body.innerHTML += `<div style="color: red;">${error}</div>`;
        });
});