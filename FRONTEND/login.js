const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", (event)=>{

    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const Obj = {
        email,
        password
    }

    axios.post("http://localhost:1000/user/login", Obj)
        .then((response)=>{
            console.log("login successful ", response.data);

        })
        .catch((error)=>{
            console.log("Error from Axios login request: ", error);
        })


});