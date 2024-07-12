const signupForm = document.getElementById("signupForm");
signupForm.addEventListener("submit", async(event)=>{

    try{
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const Obj = {
        name,
        email,
        password
    }

    const response = await axios.post("http://localhost:1000/user/signup", Obj);
        if(response.status === 201){
            window.location.href="../login/login.html";
        }
        else{
            throw new Error("Failed to login");
        }
    }
    catch(error){
        let errorMessage = "An Error Occuresd";

        if(error.response && error.response.data && error.response.data.message){
            errorMessage = error.response.data.message;
        }

        document.body.innerHTML += `<div style="color: red;">${errorMessage}</div>`;
    }


});