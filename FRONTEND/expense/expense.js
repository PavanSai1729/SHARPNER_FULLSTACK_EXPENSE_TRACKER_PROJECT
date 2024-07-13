//get Request

window.addEventListener("DOMContentLoaded", (event)=>{
    const token = localStorage.getItem("token");

    axios.get("http://localhost:1000/expense/get-expenses", { headers: {"Authorization" : token }})
        .then((result)=>{
           //console.log(result.data.allExpenses);

            for(var i=0; i<result.data.allExpenses.length; i++){
                showExpenseOnScreen(result.data.allExpenses[i]);
            }
        })
        .catch((error) => {
            console.log("get request failed from axios", error);
        })
});


//put request

const form = document.getElementById("expenseForm");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const amount = document.getElementById("amount").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    //const UserId = 1;
    

    const expenseObj = {
        amount,
        description,
        category,
        //UserId
        
    }
    //console.log("EXPENSE DETAILS: ", expenseObj);

    const token = localStorage.getItem("token");
    axios.post("http://localhost:1000/expense/add-expense", expenseObj, { headers: {"Authorization" : token}} ) 
        .then((result) => {
            //console.log(result);
            showExpenseOnScreen(result.data.newExpenseDetails);
        })
        .catch((error) => {
            console.log("post request error from axios :", error);
        });
});




function showExpenseOnScreen(expense){
    const pElement = document.getElementById("ul");
    const newElement = document.createElement("li");
    newElement.textContent = `${expense.amount} - ${expense.description} - ${expense.category}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete Expense";
    newElement.appendChild(deleteBtn);

    // delete request

    deleteBtn.addEventListener("click", (event)=>{
        const currentElement = event.target.parentElement;
        const pElement = document.getElementById("ul");
        const token = localStorage.getItem("token");

        axios.delete(`http://localhost:1000/expense/delete-expense/${expense.id}`, { headers: { "Authorization": token }})
            .then((result) => {
                console.log(result);
                pElement.removeChild(currentElement);
            })
            .catch((error) => {
                console.log("delete request fail from axios", error);
            });
    });


    // const editBtn = document.createElement("button");
    // editBtn.textContent = "Edit Expense";
    // newElement.appendChild(editBtn);

    // editBtn.addEventListener("click", (event) => {
    //     const currentElement = event.target.parentElement;
    //     const pElement = document.getElementById("ul");

    //     axios.delete(`http://localhost:1111/delete-expense/${expense.id}`)
    //         .then((result) => {
    //             console.log(result);
    //             console.log("edit request: ", result.data);
    //             pElement.removeChild(currentElement);
                
    //         })
    //         .catch((error) => {
    //             console.log("edit request fail from axios", error);
    //         });
    // });

    pElement.appendChild(newElement);
  
}

//premium functionality

const buyBtn = document.getElementById("buyBtn");
buyBtn.onclick = async function(event){
    const token = localStorage.getItem("token");
    const response = await axios.get('http://localhost:1000/purchase/premiummembership', { headers: { "Authorization": token }});
    var options = {
        "key" : response.data.key_id,
        "order_id" : response.data.order.id,
        "handler" : async function(response){
            const res = await axios.post('http://localhost:1000/purchase/updatetransactionstatus', {
                order_id : options.order_id,
                payment_id: response.razorpay_payment_id
            }, { headers: { "Authorization": token }});

            alert("you are Premium User Now");
            // document.getElementById("buyBtn").style.visibility = "hidden";
            // //document.getElementById("message").innerHTML = "You are a premium user";
            // localStorage.setItem("token", res.data.token);
        }
    }

    // const rzp1 = new Razorpay(options);
    // rzp1.open();
    // event.preventDefault();

    // rzp1.on("payment.failed", function(response){
    //     console.log(response);
    //     alert("something went wrong");
    // });
}