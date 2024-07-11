const signupForm = document.getElementById("signupForm");
signupForm.addEventListener("submit", (event)=>{

    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const Obj = {
        name,
        email,
        password
    }

    axios.post("http://localhost:1000/user/signup", Obj)
        .then((response)=>{
            console.log(response.data);
        })
        .catch((error)=>{
            console.log("Error from Axios Post request: ", error);
        })


});