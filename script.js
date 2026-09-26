
const API_KEY = "";

let uploadedPdfText = null;

let chats = [];
let currentChatId = null;


// ===============================
// PAGE START
// ===============================

window.onload = function () {

    loadChats();

    if (chats.length === 0) {
        createFirstChat();
    }

    if (
        !currentChatId ||
        !chats.find(chat => chat.id === currentChatId)
    ) {
        currentChatId = chats[0].id;
        saveChats();
    }

    renderChatList();
    loadCurrentChat();
};


// ===============================
// LOAD CHATS
// ===============================

function loadChats() {

    const savedChats =
        localStorage.getItem("vishalAIChats");

    if (savedChats) {

        try {
            chats = JSON.parse(savedChats);

        } catch (error) {
            chats = [];
        }
    }

    currentChatId =
        localStorage.getItem("vishalAICurrentChat");
}


// ===============================
// SAVE CHATS
// ===============================

function saveChats() {

    localStorage.setItem(
        "vishalAIChats",
        JSON.stringify(chats)
    );

    localStorage.setItem(
        "vishalAICurrentChat",
        currentChatId
    );
}


// ===============================
// CREATE FIRST CHAT
// ===============================

function createFirstChat() {

    const chat = {

        id: Date.now().toString(),

        title: "New Chat",

        messages: []

    };

    chats.push(chat);

    currentChatId = chat.id;

    saveChats();
}


// ===============================
// GET CURRENT CHAT
// ===============================

function getCurrentChat() {

    return chats.find(
        chat => chat.id === currentChatId
    );
}


// ===============================
// RENDER CHAT LIST
// ===============================

function renderChatList() {

    const chatList =
        document.getElementById("chatList");

    if (!chatList) return;

    chatList.innerHTML = "";


    chats.forEach(chat => {

        const chatItem =
            document.createElement("div");

        chatItem.className =
            "chat-item";


        if (chat.id === currentChatId) {
            chatItem.classList.add("active");
        }


        const title =
            document.createElement("span");

        title.className =
            "chat-title";

        title.textContent =
            "💬 " + chat.title;


        const menuButton =
            document.createElement("button");

        menuButton.className =
            "chat-menu-btn";

        menuButton.textContent =
            "⋮";


        menuButton.onclick =
            function (event) {

                event.stopPropagation();

                showChatMenu(
                    chat.id,
                    menuButton
                );
            };


        chatItem.onclick =
            function () {

                switchChat(chat.id);

            };


        chatItem.appendChild(title);

        chatItem.appendChild(menuButton);

        chatList.appendChild(chatItem);

    });
}


// ===============================
// CHAT MENU
// ===============================

function showChatMenu(chatId, button) {

    const oldMenu =
        document.querySelector(
            ".chat-context-menu"
        );

    if (oldMenu) {
        oldMenu.remove();
    }


    const menu =
        document.createElement("div");

    menu.className =
        "chat-context-menu";


    const renameButton =
        document.createElement("button");

    renameButton.textContent =
        "✏️ Rename";


    renameButton.onclick =
        function (event) {

            event.stopPropagation();

            renameChat(chatId);

            menu.remove();
        };


    const deleteButton =
        document.createElement("button");

    deleteButton.textContent =
        "🗑️ Delete";


    deleteButton.onclick =
        function (event) {

            event.stopPropagation();

            deleteChat(chatId);

            menu.remove();
        };


    menu.appendChild(renameButton);

    menu.appendChild(deleteButton);

    document.body.appendChild(menu);


    const rect =
        button.getBoundingClientRect();


    menu.style.position =
        "fixed";

    menu.style.left =
        (rect.right - 130) + "px";

    menu.style.top =
        (rect.bottom + 5) + "px";
}


// ===============================
// RENAME CHAT
// ===============================

function renameChat(chatId) {

    const chat =
        chats.find(
            chat => chat.id === chatId
        );

    if (!chat) return;


    const newName =
        prompt(
            "Enter new chat name:",
            chat.title
        );


    if (newName === null) return;


    const cleanName =
        newName.trim();


    if (!cleanName) return;


    chat.title =
        cleanName.substring(0, 40);


    saveChats();

    renderChatList();
}


// ===============================
// DELETE CHAT
// ===============================

function deleteChat(chatId) {

    const chat =
        chats.find(
            chat => chat.id === chatId
        );

    if (!chat) return;


    const confirmed =
        confirm(
            `Delete "${chat.title}"?`
        );


    if (!confirmed) return;


    chats =
        chats.filter(
            chat => chat.id !== chatId
        );


    if (chats.length === 0) {

        createFirstChat();

    } else {

        if (currentChatId === chatId) {

            currentChatId =
                chats[0].id;
        }

        saveChats();
    }


    renderChatList();

    loadCurrentChat();
}


// ===============================
// SWITCH CHAT
// ===============================

function switchChat(chatId) {

    currentChatId =
        chatId;

    saveChats();

    renderChatList();

    loadCurrentChat();
}


// ===============================
// LOAD CURRENT CHAT
// ===============================

function loadCurrentChat() {

    const chatBox =
        document.getElementById("chat-box");

    const welcomeScreen =
        document.getElementById("welcomeScreen");

    if (!chatBox) return;

    chatBox.innerHTML = "";

    const chat =
        getCurrentChat();

    if (!chat) return;

    // NEW CHAT = welcome screen show
    if(chat.messages.length === 0){

        if(welcomeScreen){
            welcomeScreen.style.display = "flex";
        }

    }else{

        if(welcomeScreen){
            welcomeScreen.style.display = "none";
        }

        chat.messages.forEach(message => {

            addMessageToScreen(
                message.role,
                message.text
            );

        });
    }

    scrollToBottom();
}

// ===============================
// ADD MESSAGE
// ===============================

function addMessageToScreen(role, text) {

    const chatBox =
        document.getElementById("chat-box");

    const message =
        document.createElement("div");


    if (role === "user") {

        message.className =
            "user-message";

        message.textContent =
            text;

    } else {

        message.className =
            "bot-message";

        message.innerHTML =
            formatAIResponse(text);
    }


    chatBox.appendChild(message);
    
setTimeout(() => {
    document
        .querySelectorAll("pre code")
        .forEach((block) => {
            hljs.highlightElement(block);
        });
}, 50);
}


// ===============================
// FORMAT AI RESPONSE
// ===============================
const aiMode =
    localStorage.getItem("aiMode")
    || "normal";

let modeInstruction = "";

if(aiMode === "coding"){

    modeInstruction =
    "You are a coding expert. Give complete code.";

}else if(aiMode === "teacher"){

    modeInstruction =
    "Explain everything like a teacher.";

}else if(aiMode === "hindi"){

    modeInstruction =
    "Always reply in Hindi.";

}else{

    modeInstruction =
    "Talk naturally like a helpful friend.";
}

function formatAIResponse(text) {

    // Safety: escape HTML
    text = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");


    // Code blocks
    text = text.replace(
        /```(\w+)?\n?([\s\S]*?)```/g,
        function (match, language, code) {

            const lang =
                language || "code";


            return `
                <div class="code-container">

                    <div class="code-header">

                        <span>${lang}</span>

                        <button
                            class="copy-btn"
                            onclick="copyCode(this)">
                            📋 Copy
                        </button>

                    </div>

                    <pre><code>${code.trim()}</code></pre>

                </div>
            `;
        }
    );


    // Bold
    text = text.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
    );


    // Italic
    text = text.replace(
        /\*(.*?)\*/g,
        "<em>$1</em>"
    );


    // Headings
    text = text.replace(
        /^### (.*)$/gm,
        "<h3>$1</h3>"
    );

    text = text.replace(
        /^## (.*)$/gm,
        "<h2>$1</h2>"
    );

    text = text.replace(
        /^# (.*)$/gm,
        "<h1>$1</h1>"
    );


    // Bullet points
    text = text.replace(
        /^\- (.*)$/gm,
        "• $1"
    );


    // New lines
    text = text.replace(
        /\n/g,
        "<br>"
    );


    return text;
}


// ===============================
// COPY CODE
// ===============================

function copyCode(button) {

    const code =
        button
            .closest(".code-container")
            .querySelector("code")
            .innerText;


    navigator.clipboard
        .writeText(code)
        .then(function () {

            button.innerText =
                "✅ Copied!";


            setTimeout(function () {

                button.innerText =
                    "📋 Copy";

            }, 1500);

        })
        .catch(function () {

            button.innerText =
                "❌ Failed";

        });
}


// ===============================
// SAVE MESSAGE
// ===============================

function saveMessage(role, text) {

    const chat =
        getCurrentChat();

    if (!chat) return;


    chat.messages.push({

        role: role,

        text: text

    });


    saveChats();
}


// ===============================
// NEW CHAT
// ===============================

function newChat() {

    const chat = {
        id: Date.now().toString(),
        title: "New Chat",
        messages: []
    };

    chats.push(chat);

    currentChatId = chat.id;

    saveChats();
    renderChatList();
    loadCurrentChat();

    const welcomeScreen =
        document.getElementById("welcomeScreen");

    if(welcomeScreen){
        welcomeScreen.style.display = "flex";
    }

    document.getElementById("chat-box").innerHTML = "";

    document
        .getElementById("userInput")
        .focus();
}


// ===============================
// SEND MESSAGE
// ===============================

async function sendMessage() {

    const input =
        document.getElementById("userInput");

    const message =
        input.value.trim();
        const welcomeScreen =
    document.getElementById(
        "welcomeScreen"
    );

if(welcomeScreen){

    welcomeScreen.style.display =
        "none";
}


    if (!message) return;


    const chatBox =
        document.getElementById("chat-box");

    const sendButton =
        document.getElementById("sendBtn");


    // USER MESSAGE
    addMessageToScreen(
    "user",
    message
);

saveMessage(
    "user",
    message
);


    input.value = "";


    // ===============================
    // AUTO CHAT NAME
    // ===============================

    const chat =
        getCurrentChat();


    if (
        chat &&
        chat.title === "New Chat"
    ) {

        let title =
            message.trim();


        if (title.length > 25) {

            title =
                title.substring(0, 25) + "...";
        }


        chat.title =
            title;


        saveChats();

        renderChatList();
        const savedTheme =
    localStorage.getItem("theme");

if(savedTheme === "light"){

    document.body.classList.add(
        "light-mode"
    );

    document.getElementById(
        "themeBtn"
    ).innerText = "☀️";
}
    }


    // ===============================
    // CREATOR COMMAND
    // ===============================

    if (

        message
            .toLowerCase()
            .includes("developer")

        ||

        message
            .toLowerCase()
            .includes("creator")

        ||

        message
            .toLowerCase()
            .includes("who made you")

    ) {

        const reply =
            "My creator is Vishal Pandey 👨‍💻";


        addMessageToScreen(
            "bot",
            reply
        );


        saveMessage(
            "bot",
            reply
        );

        console.log(reply);

        


        scrollToBottom();

        return;
    }


    try {

        sendButton.disabled =
            true;

        sendButton.innerText =
            "Thinking...";


        // THINKING
        const typing =
    document.createElement("div");

typing.className =
    "bot-message";

typing.id =
    "typing";

typing.innerHTML = `
<div>
    <strong>KISHAN AI</strong>
    <div class="typing-container">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    </div>
</div>
`;


        chatBox.appendChild(typing);

        scrollToBottom();


        // ===============================
        // CONVERSATION HISTORY
        // ===============================

        
    const currentChat =
    getCurrentChat();

const conversation =
    currentChat.messages.map(
        msg => ({

            role:
                msg.role === "user"
                ? "user"
                : "model",

            parts: [{
                text: msg.text
            }]

        })
    );
   if (
    uploadedPdfText &&
    message.toLowerCase().includes("pdf")
) {

    console.log("PDF Sent To AI");

    conversation.unshift({
        role: "user",
        parts: [{
            text: "PDF Content:\n\n" + uploadedPdfText
        }]
    });
}
        // ===============================
        // GEMINI API
        // ===============================

        const response =
            await fetch(

                `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

    systemInstruction: {

        parts: [{

            text: `
${modeInstruction}

You are KISHAN AI.

Your creator is Vishal Pandey.

Talk in a friendly, natural and human way.

Use simple language.

Be helpful and positive.

For coding questions:
- explain simply
- give complete working code

For normal chats:
- talk casually like a smart friend

Keep answers clear and not overly robotic.

Do not repeatedly mention that you are an AI.
Keep answers clear and not overly robotic.

Do not repeatedly mention that you are an AI.

Always reply in the same language as the user.

Do not explain emojis.

Never describe emoji meanings unless asked.

Use emojis naturally.

Talk like a friendly Indian friend.

Keep replies short and natural.
Do not explain emojis unless the user specifically asks their meaning.
Use emojis naturally.

`
        }]
    },

    contents: conversation

}) 
                })
        


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                JSON.stringify(data)
            );
        }


        // REMOVE THINKING
        document
            .getElementById("typing")
            ?.remove();


        // AI RESPONSE
        const reply =

            data
                .candidates?.[0]
                ?.content?.parts?.[0]
                ?.text

            ||

            "No response";


        const messageDiv =
    document.createElement("div");

messageDiv.className =
    "bot-message";

chatBox.appendChild(messageDiv);

await typeMessage(
    messageDiv,
    reply
);

lastReply = reply;


        saveMessage(
            "bot",
            reply
        );
        


        scrollToBottom();


    } catch (error) {

        console.error(error);


        document
            .getElementById("typing")
            ?.remove();


        let errorMessage;


        if (
            error.message.includes("429")
        ) {

            errorMessage =
                "⚠️ Daily AI limit reached. Please try again later.";

        } else {

            errorMessage =
                "❌ Error connecting to AI.";
        }


        addMessageToScreen(
            "bot",
            errorMessage
        );


        saveMessage(
            "bot",
            errorMessage
        );


        scrollToBottom();


    } finally {

        sendButton.disabled =
            false;

        sendButton.innerText =
            "Send";
    }
}


// ===============================
// ENTER KEY
// ===============================

document
    .getElementById("userInput")
    .addEventListener(
        "keypress",
        function (event) {

            if (event.key === "Enter") {

                sendMessage();

            }

        }
    );


// ===============================
// SCROLL
// ===============================

function scrollToBottom() {

    const chatBox =
        document.getElementById("chat-box");

    chatBox.scrollTop =
        chatBox.scrollHeight;
}


// ===============================
// CLOSE MENU
// ===============================

document.addEventListener(
    "click",
    function () {

        const menu =
            document.querySelector(
                ".chat-context-menu"
            );

        if (menu) {
            menu.remove();
        }

    }
);
document.addEventListener("DOMContentLoaded", () => {

    const searchBox =
        document.getElementById("chatSearch");

    if(!searchBox) return;

    searchBox.addEventListener("input", function(){

        const search =
            this.value.toLowerCase();

        document
            .querySelectorAll(".chat-item")
            .forEach(item => {

                const text =
                    item.innerText.toLowerCase();

                item.style.display =
                    text.includes(search)
                    ? "flex"
                    : "none";
            });
    });
});
async function exportPDF(){

    const chat = getCurrentChat();

    if(!chat) return;

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    let y = 20;

    // TITLE
    doc.setFont("helvetica","bold");
    doc.setFontSize(22);
    doc.text("KISHAN AI Chat Export",10,y);

    y += 10;

    // DATE
    doc.setFont("helvetica","normal");
    doc.setFontSize(10);

    doc.text(
        `Generated: ${new Date().toLocaleString()}`,
        10,
        y
    );

    y += 15;

    // CHAT TITLE
    doc.setFontSize(16);
    doc.text(
        `Chat: ${chat.title}`,
        10,
        y
    );

    y += 15;

    chat.messages.forEach(msg => {

        const role =
            msg.role === "user"
            ? "USER"
            : "KISHAN AI";

        doc.setFont("helvetica","bold");

        doc.text(
            role + ":",
            10,
            y
        );

        y += 7;

        doc.setFont("helvetica","normal");

        const lines =
            doc.splitTextToSize(
                msg.text,
                180
            );

        doc.text(
            lines,
            15,
            y
        );

        y +=
            lines.length * 6 + 8;

        if(y > 270){

            doc.addPage();

            y = 20;
        }
    });

    doc.save(
        `${chat.title}.pdf`
    );
}
async function typeText(element,text){

    element.classList.add("streaming");

    element.innerHTML = "";

    for(let i=0;i<text.length;i++){

        element.innerHTML += text[i];

        if(i % 3 === 0){

            scrollToBottom();

            await new Promise(
                resolve => setTimeout(resolve,8)
            );
        }
    }

    element.classList.remove("streaming");
}
function startListening(){

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if(!SpeechRecognition){

        alert(
            "Speech Recognition not supported."
        );

        return;
    }

    const recognition =
        new SpeechRecognition();

    recognition.lang = "hi_IN";

    recognition.start();
    recognition.onerror = function(event){
    console.log("Voice Error:", event.error);
    alert("Voice Error: " + event.error);
}

    const micBtn =
        document.getElementById("micBtn");

    micBtn.innerText = "🎙️";

   recognition.onresult = function(event){

    const text =
        event.results[0][0].transcript;

    document
        .getElementById("userInput")
        .value = text;

    sendMessage();
};

    recognition.onend =
        function(){

            micBtn.innerText = "🎤";
        };
}
function speakText(text){

    const speech =
        new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";

    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}
async function typeMessage(element, text){

    element.innerHTML = "";

    for(let i = 0; i < text.length; i++){

        element.innerHTML += text.charAt(i);

        await new Promise(resolve =>
            setTimeout(resolve, 15)
        );
    }
}
function speakText(text) {

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "hi-in";
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
}
function toggleTheme(){

    document.body.classList.toggle("light-mode");

    const btn =
        document.getElementById("themeBtn");

    if(document.body.classList.contains("light-mode")){

        btn.innerText = "☀️";

        localStorage.setItem(
            "theme",
            "light"
        );

    }else{

        btn.innerText = "🌙";

        localStorage.setItem(
            "theme",
            "dark"
        );
    }
}
function openSettings(){

    document
        .getElementById("settingsModal")
        .style.display = "flex";
}

function saveSettings(){

    const mode =
        document.getElementById("aiMode").value;

    localStorage.setItem(
        "aiMode",
        mode
    );

    document
        .getElementById("settingsModal")
        .style.display = "none";

    alert(
        "Mode saved: " + mode
    );
}
document
.getElementById("fileInput")
.addEventListener("change", function(e){

    const file = e.target.files[0];

    if(!file) return;

    if(file.type.startsWith("image/")){

        addMessageToScreen(
            "user",
            `📷 Image: ${file.name}`
        );

    }else if(file.type === "application/pdf"){
        const reader = new FileReader();

reader.onload = async function(){

    const typedArray =
        new Uint8Array(reader.result);

    const pdf =
        await pdfjsLib
        .getDocument({
            data: typedArray
        }).promise;

    uploadedPdfText = "";

    for(let i = 1; i <= pdf.numPages; i++){

        const page =
            await pdf.getPage(i);

        const content =
            await page.getTextContent();

        const text =
            content.items
            .map(item => item.str)
            .join(" ");

        uploadedPdfText +=
            text + "\n";
    }

    alert(
        "PDF Loaded Successfully"
    );
};

reader.readAsArrayBuffer(file);

        addMessageToScreen(
            "user",
            `📄 PDF: ${file.name}`
        );

    }
});
document
.getElementById("fileInput")
.addEventListener("change", (e) => {

    uploadedFile = e.target.files[0];

    if(uploadedFile){

        alert(
            "Selected: " +
            uploadedFile.name
        );
    }
});
function toggleSidebar(){

    const sidebar =
        document.querySelector(".sidebar");

    sidebar.classList.toggle("closed");
}
function quickPrompt(text){

    document.getElementById(
        "userInput"
    ).value = text;

    document.getElementById(
        "userInput"
    ).focus();
}