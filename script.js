console.log("Hello World!")

//User Properties
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
        document.querySelector(".entry-page").classList.add("logIn-screen-animation");
        setTimeout(()=>{document.querySelector(".entry-page").classList.add("hide-element");}, 1000);
        setTimeout(()=>{document.querySelector(".entry-page").classList.remove("logIn-screen-animation");}, 1000);
        document.querySelector(".main-chat").classList.toggle("hide-element");
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


//SideBar Functions
function sideBarComeUp(element)
{
    let sidebar = document.querySelector("nav");
    element.classList.add("block-click");
    setTimeout(()=>{element.classList.remove("block-click");}, 300);
    sidebar.classList.remove("hide-element");
    sidebar.classList.add("block-click");
    sidebar.children[1].classList.add("side-bar-animation-comeIn");
    setTimeout(()=>{sidebar.children[1].classList.remove("side-bar-animation-comeIn");}, 790);
    setTimeout(()=>{sidebar.classList.remove("block-click");}, 790);
}

function sideBarReturn()
{
    let sidebar = document.querySelector("nav");
    sidebar.children[1].classList.add("side-bar-animation-comeOut");
    setTimeout(()=>{sidebar.children[1].classList.remove("side-bar-animation-comeOut");}, 800);
    setTimeout(()=>{sidebar.classList.add("hide-element");}, 780);

}