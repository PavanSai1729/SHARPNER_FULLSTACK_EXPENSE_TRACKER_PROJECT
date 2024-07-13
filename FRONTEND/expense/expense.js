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