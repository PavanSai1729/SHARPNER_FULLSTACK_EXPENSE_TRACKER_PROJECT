

function showPremiumuserMessage(){
    document.getElementById("buyBtn").style.visibility = "hidden";
    document.getElementById("message").innerHTML = "You are a premium user";
}



function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


//get Request

window.addEventListener("DOMContentLoaded", (event)=>{
  const objUrlParams=new URLSearchParams(window.location.search);
  const page =objUrlParams.get("page") || 1;
  const token  = localStorage.getItem('token')
  //console.log("token======>",token)
  const decodeToken = parseJwt(token)
  //console.log(decodeToken)
  //console.log(decodeToken.ispremiumuser)
  if(decodeToken.ispremiumuser){
    showPremiumuserMessage();
    showLeaderboard();
    reportGeneration();
  }
  axios.get(`http://localhost:1000/expense/get-expenses?page=${page}`, { headers: {"Authorization" : token} })
  .then((response)=>{
    
    console.log(response);
    for(var i=0;i<response.data.allExpenses.length;i++){
        showExpenseOnScreen(response.data.allExpenses[i]);
    }
    //console.log(response.data);
    showPagination(response.data);
  })
  .catch((err)=>{
    console.log(err);
  })
})



function showPagination({currentPage,hasNextPage,nextPage,hasPreviousPage,previousPage,lastPage}){
    const pagination = document.getElementById('pagination');
    if (!pagination) {
        console.error('Pagination element not found');
        return;
    }

    pagination.innerHTML='';
    if(hasPreviousPage){
      
      const btn2=document.createElement('button')
      btn2.className="btn btn-info"
      btn2.style.margin="5px"
      btn2.innerHTML=previousPage
      btn2.addEventListener('click',()=> getProducts(previousPage))
      pagination.appendChild(btn2)
    }
    const btn1=document.createElement('button')
    btn1.className="btn btn-info"
    btn1.style.margin="5px"
    btn1.innerHTML=`<h3>${currentPage}</h3>`
    btn1.addEventListener('click',()=> getProducts(currentPage))
    pagination.appendChild(btn1)
    if(hasNextPage){
      
      const btn3=document.createElement('button')
      btn3.style.margin="5px"
      btn3.className="btn btn-info"
      btn3.innerHTML=nextPage
      btn3.addEventListener('click',()=> getProducts(nextPage))
      pagination.appendChild(btn3)
    }
  }

  function getProducts(page){
    const parentNode=document.getElementById('ul');
    parentNode.innerHTML='';
    const token  = localStorage.getItem('token')
    axios.get(`http://localhost:1000/expense/get-expenses?page=${page}`, { headers: {"Authorization" : token} })
    .then((response)=>{
      
      console.log(response);
      for(var i=0;i<response.data.allExpenses.length;i++){
        showExpenseOnScreen(response.data.allExpenses[i]);
      }
      showPagination(response.data);
    })
    .catch((err)=>{
      console.log(err);
    })
  }


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


//show expenses on screen

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

    pElement.appendChild(newElement);
  
}

//premium functionality

document.getElementById("buyBtn").onclick = async function(event){
    try{
    const token = localStorage.getItem("token");
    const response = await axios.get('http://localhost:1000/purchase/premiummembership', { headers: { "Authorization": token }});
    
    var options = {
        "key" : response.data.key_id,
        "order_id" : response.data.order.id,
        "handler" : async function(paymentResponse){
            try{
            const res = await axios.post('http://localhost:1000/purchase/updatetransactionstatus', {
                order_id : options.order_id,
                payment_id: paymentResponse.razorpay_payment_id
            }, { headers: { "Authorization": token }});

            alert("you are Premium User Now");
            document.getElementById("buyBtn").style.visibility = "hidden";
            document.getElementById("message").innerHTML = "You are a premium user";
            localStorage.setItem("token", res.data.token);
            showLeaderboard();
        }
        catch(error){
            console.log(error);
            alert("Error updating transactioin status");
        }
    }
}; 
  

    const rzp1 = new Razorpay(options);
    rzp1.open();
    event.preventDefault();

    rzp1.on("payment.failed", function(response){
        console.log(response);
        alert("something went wrong with the payment");
    });
}
catch(error){
    console.log(error);
    alert("Error initiating purchase");
}
};


// premium user feature

function showLeaderboard(){
    const inputElement = document.createElement("input");
    inputElement.type = "button";
    inputElement.value = "Show Leaderboard";
    inputElement.onclick = async() =>{
        try{
        const token = localStorage.getItem("token");
        const userLeaderBoardArray = await axios.get('http://localhost:1000/premium/showLeaderBoard', { headers: { "Authorization": token }});
        console.log(userLeaderBoardArray);

        var leaderboardElement = document.getElementById("leaderboard");
        leaderboardElement.innerHTML = "<h1> Leader Board </h1>";
        userLeaderBoardArray.data.forEach((userDetails)=>{
        leaderboardElement.innerHTML += `<li>Name - ${userDetails.name} & Total Expense - ${userDetails.total_cost || 0}</li>`;
        });
    }
        catch(error){
            console.log("error from getting leader board from front end:", error);

        }
       
        }
    
    document.getElementById("message").appendChild(inputElement);
}


// report generation

function reportGeneration(){
    const token = localStorage.getItem("token");
    const inputElement = document.createElement("input");
    inputElement.type = "button";
    inputElement.value = "Report Generation";
    inputElement.onclick = () =>{
        try{

            axios.get('http://localhost:1000/user/download', { headers: {"Authorization" : token} })
                .then((response) => {
                if(response){
          //the bcakend is essentially sending a download link
          //  which if we open in browser, the file would download
                    var a = document.createElement("a");
                     a.href = response.data.fileURL;
                     a.download = 'myexpense.txt';
                     a.click();
      } else {
          console.log("Something went wrong")
      }

  })
  .catch((err) => {
      console.log(err);
  });

           
    }
        catch(error){
            console.log("report generation failed:", error);

        }
       
        }
    
    document.getElementById("message").appendChild(inputElement);
}




