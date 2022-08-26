//User Properties
const user = {
    connection: "Not connected",
    userName: "",
    connectionTime: "",
    serverConnections: {onlineUserUpdate: "", messageUpdate: "", contactUpdate: "", onlinePeople: []},
    sendTo: {node: document.querySelector('.checked'), name: "Todos"}
}

//SideBar Animations
function sideBarComeUp(element)
{
    let sidebar = document.querySelector("nav");
    element.classList.add("block-click");
    setTimeout(()=>{element.classList.remove("block-click");}, 300);
    sidebar.classList.remove("hide-element");
    sidebar.classList.add("block-click");
    sidebar.classList.add("fadeIn");
    sidebar.children[1].classList.add("side-bar-animation-comeIn");
    setTimeout(()=>{sidebar.children[1].classList.remove("side-bar-animation-comeIn");}, 790);
    setTimeout(()=>{sidebar.classList.remove("block-click");}, 790);
    setTimeout(()=>{sidebar.classList.remove("fadeIn");}, 790);
}
function sideBarReturn()
{
    let sidebar = document.querySelector("nav");
    sidebar.children[1].classList.add("side-bar-animation-comeOut");
    sidebar.classList.add("fadeOut");
    setTimeout(()=>{sidebar.children[1].classList.remove("side-bar-animation-comeOut");}, 800);
    setTimeout(()=>{sidebar.classList.add("hide-element");}, 780);
    setTimeout(()=>{sidebar.classList.remove("fadeOut");}, 780);

}

//Recall Functions
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
        user.serverConnections.onlineUserUpdate = setInterval(()=>{axios.post('https://mock-api.driven.com.br/api/v6/uol/status', {name: username})}, 5000);
        user.serverConnections.messageUpdate = setInterval(()=>{populateChat()}, 5000);
        user.serverConnections.contactUpdate = [setInterval(()=>{axios.get('https://mock-api.driven.com.br/api/v6/uol/participants').then(response => user.serverConnections.onlinePeople = response.data).catch(error => axiosError(error))}, 5000), setInterval(() => {updateContactList()}, 10000)];
        document.querySelector(".entry-page").classList.add("logIn-screen-animation");
        setTimeout(()=>{document.querySelector(".entry-page").classList.add("hide-element");}, 1000);
        setTimeout(()=>{document.querySelector(".entry-page").classList.remove("logIn-screen-animation");}, 1000);
        document.querySelector(".main-chat").classList.toggle("hide-element");
        populateChat();
        axios.get('https://mock-api.driven.com.br/api/v6/uol/participants').then(response => user.serverConnections.onlinePeople = response.data).catch(error => axiosError(error));
        setTimeout(updateContactList, 500);
        document.querySelector('textarea').addEventListener("keypress", (event)=>{event.key === 'Enter'? sendMessage(): event});
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

function populateChat(chatHistory)
{
    chatHistory = chatHistory || 0;
    if (chatHistory === 0)
    {
        axios.get('https://mock-api.driven.com.br/api/v6/uol/messages').then((response)=>{populateChat(response.data)});
    }
    else
    {
        let messagesDiv = document.querySelector(".messages-container");
        let tmpElement;
        messagesDiv.innerHTML = "";
        for (let i = 0; i < chatHistory.length; i++)
        {
            tmpElement = document.createElement("li");
            tmpElement.classList.add("message");
            if (chatHistory[i].type === 'message')
            {
                tmpElement.classList.add("normal-message");
                tmpElement.innerHTML =
                `<span class='message-time'>(${chatHistory[i].time})</span>
                <span class='message-person'>${chatHistory[i].from}</span> para 
                <span class='message-person'>${chatHistory[i].to}</span>: 
                ${chatHistory[i].text}`;
            }
            else if (chatHistory[i].type === 'status')
            {
                tmpElement.classList.add("status");
                tmpElement.innerHTML =
                `<span class='message-time'>(${chatHistory[i].time})</span>
                <span class='message-person'>${chatHistory[i].from}</span>  
                ${chatHistory[i].text}`;
            }
            else if (chatHistory[i].type === 'private_message')
            {
                if(chatHistory[i].from === user.userName||chatHistory[i].to === user.userName || chatHistory[i].to === 'Todos' || chatHistory[i].to === 'todos')
                {
                    tmpElement.classList.add("private-message");
                    tmpElement.innerHTML =
                    `<span class='message-time'>(${chatHistory[i].time})</span>
                    <span class='message-person'>${chatHistory[i].from}</span> 
                    reservadamente para 
                    <span class='message-person'>${chatHistory[i].to}</span>: 
                    ${chatHistory[i].text}`;
                }
                else{
                    tmpElement.classList.add("hide-element");
                }
            }
            messagesDiv.appendChild(tmpElement);
            tmpElement.scrollIntoView();
        }
    }
}

function sendMessage()
{
    let messageText = document.querySelector('.footer-text-divs>textarea').value;
    let message = {
        from: user.userName,
	    to: document.querySelector("#message-directioning").querySelector(".checked>div").children[1].innerHTML,
	    text: messageText,
	    type: document.querySelector("#message-visibility").querySelector(".checked>div").children[1].innerHTML === 'Público'?'message':'private_message'
    };
    axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', message).then(populateChat()).catch((error) => {axiosError(error)});
}

function resetData()
{
    document.querySelector(".entry-page").classList.remove("hide-element");
    document.querySelector(".entry-page").classList.add("logOut-screen-animation");
    document.querySelector('.footer-text-divs>textarea').value = '';
    setTimeout(()=>{window.location.reload()}, 1100);

}

function changeContactSelection(element)
{
    element.parentNode.querySelector(".checked").classList.add("unchecked");
    element.parentNode.querySelector(".checked").classList.remove("checked");
    element.classList.add("checked");
    element.classList.remove("unchecked");
    user.sendTo.node = element;
    user.sendTo.name = element.querySelector("p").innerHTML;

    if (document.querySelector("#message-visibility").querySelector(".checked").querySelector('p').innerHTML === 'Privado')
    {
        document.querySelector(".directioning-message").innerHTML = `Enviando para ${document.querySelector("#message-directioning").querySelector('.checked').querySelector('p').innerHTML} (privado)`
    }
    else
    {
        document.querySelector(".directioning-message").innerHTML = "";
    }

}

function updateContactList()
{
    let clickedElement;
    let tmpElement;
    document.querySelector('#message-directioning').innerHTML = 
    `
    <p>Escolha um contato para enviar mensagem:</p>
    <div class="selection-div">
        <div class="side-bar-selection clickable-element checked all-unmutable-class" onclick="changeContactSelection(this)">
            <div>
                <ion-icon name="people"></ion-icon>
                <p>Todos</p>
            </div>
            <div><img src="imgs/Vector.png" alt="" width="11px" height="9px"></div>
        </div>
    </div>
    `;
    for (let i = 0; i < user.serverConnections.onlinePeople.length; i++)
    {
        if (user.sendTo.name === user.serverConnections.onlinePeople[i].name)
        {
            clickedElement = document.querySelector(".all-unmutable-class").insertAdjacentElement('afterend', user.sendTo.node);
            if (!(i === user.serverConnections.onlinePeople.length - 1));
            {
                i++;
            }
            if (user.serverConnections.onlinePeople[i] === undefined)
            {
                changeContactSelection(clickedElement);
                return;
            }
        }
        tmpElement = document.createElement('div');
        tmpElement.classList.add('side-bar-selection', 'clickable-element', 'unchecked');
        tmpElement.setAttribute('onclick', 'changeContactSelection(this)');

        tmpElement.innerHTML = 
        `
        <div>
            <ion-icon name="people"></ion-icon>
            <p>${user.serverConnections.onlinePeople[i].name}</p>
        </div>
        <div><img src="imgs/Vector.png" alt="" width="11px" height="9px"></div>
        `;

        document.querySelector('.selection-div').appendChild(tmpElement);
    }

    if (clickedElement)
    {
        changeContactSelection(clickedElement);
    }
    else
    {
        changeContactSelection(document.querySelector('.all-unmutable-class'));
    }
}
//Handle Console.log Axios Errors
function axiosError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);
  }