//User Properties
const user = {
    connection: "Not connected",
    userName: "",
    connectionTime: "",
    statusUpdate: ""
}

//Run-Time Functions:
function logIn(username, check)
{
    check = check || 0;
    let inputBox = document.querySelector(".entry-page input");
    let loadGif = document.querySelector(".entry-page>img");
    if (check === 400) //Falhou no LogIn - nome em uso
    {
        inputBox.classList.toggle('hide-element');
        loadGif.classList.toggle('hide-element');
        let warning = document.createElement("p")
        warning.innerHTML = "Este nome está em uso!"
        warning.classList.add("logIn-warning");
        let parent = document.querySelector(".entry-page")
        parent.appendChild(warning);
        setTimeout(() => {parent.removeChild(warning)}, 1100);
    }
    else if (check === 200) //Sucesso no LogIn
    {
        inputBox.classList.toggle('hide-element');
        loadGif.classList.toggle('hide-element');
        user.connection = "Connected";
        user.userName = username;
        user.statusUpdate = setInterval(()=>{axios.post('https://mock-api.driven.com.br/api/v6/uol/status', {name: username})}, 5000);
        document.querySelector(".entry-page").classList.add("logIn-screen-animation");
        setTimeout(()=>{document.querySelector(".entry-page").classList.add("hide-element");}, 1000);
        setTimeout(()=>{document.querySelector(".entry-page").classList.remove("logIn-screen-animation");}, 1000);
        document.querySelector(".main-chat").classList.toggle("hide-element");
    }

    else if (check === 0 & username.length <= 20 && username !== "" && !(username.includes(" "))) //Bom nome, checando se está em uso.
    {
        inputBox.classList.toggle('hide-element');
        loadGif.classList.toggle('hide-element');
        let promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', {name: username});
        promise.then((response)=>{logIn(username, response.status)});
        promise.catch((response)=>{logIn(username, response.response.status)});
    }   
    else //Falha no LogIn nome com caracteres ruins
    { 
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