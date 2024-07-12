const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async(event)=>{
    try{
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const Obj = {
        email,
        password
    }

    const response = await axios.post("http://localhost:1000/user/login", Obj);
        
        if (response.data.success) {
            window.location.href = response.data.redirectUrl; // Redirect to expense.html
        } else {
            alert(response.data.message);
        }
    
    }
    catch(error){
            //console.log(JSON.stringify(error));

            let errorMessage = "An error occurred";
            if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
           }

            document.body.innerHTML += `<div style="color:red;">${errorMessage}</div>`;

        }


});