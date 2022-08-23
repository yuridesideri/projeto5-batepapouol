console.log("Hello World!")

const user = {
    connection: "Not connected",
    userName: "",
    connectionTime: ""
}

//Run-Time Functions:
function logIn(username)
{
    console.log(username); //Remover Depois
    if (username.length <= 20 && username !== "" && !(username.includes(" ")))
    {
        user.connection = "Connected";
        user.userName = username;
    }
    else{
        let warning = document.createElement("p")
        warning.innerHTML = "Digite um username válido!"
        warning.classList.add("logIn-warning");
        let parent = document.querySelector(".entry-page")
        parent.appendChild(warning);
        setTimeout(() => {parent.removeChild(warning)}, 1100);
    }
}