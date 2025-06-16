// Configuration for Google Gemini API
const API_KEY = "AIzaSyA1AVBdWuNY_fPOF_9LEjX4xKM4ZYMs8I8"; // Your provided API key
const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";
const MODEL = "gemini-1.5-flash"; // Using free model instead of pro

// DOM Elements
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatContainer = document.getElementById("chatContainer");
const newChatButton = document.getElementById("newChatButton");
const exampleCards = document.querySelectorAll(".example-card");
const chatHistoryContainer = document.querySelector(".chat-history");
const medicalDisclaimer = document.querySelector(".medical-disclaimer");
const exampleQuestions = document.querySelector(".example-questions");

// Chat data structure
let chats = [];
let currentChatId = null;

// Initialize chat
document.addEventListener("DOMContentLoaded", () => {
    // Load chats from localStorage
    loadChats();

    // Hide chat container initially
    chatContainer.style.display = "none";

    // Add event listeners
    chatForm.addEventListener("submit", handleChatSubmit);
    newChatButton.addEventListener("click", startNewChat);

    // Add click events to example cards
    exampleCards.forEach(card => {
        card.addEventListener("click", () => {
            const question = card.textContent.trim();
            userInput.value = question.replace(/"/g, '');
            chatForm.dispatchEvent(new Event("submit"));
        });
    });

    // Render chat history
    renderChatHistory();
});

// Handle form submission
async function handleChatSubmit(e) {
    e.preventDefault();

    const message = userInput.value.trim();
    if (!message) return;

    // Create a new chat if none exists
    if (!currentChatId) {
        createNewChat();
    }

    // Hide medical disclaimer and example questions when chat starts
    medicalDisclaimer.style.display = "none";
    exampleQuestions.style.display = "none";

    // Show chat container if hidden
    chatContainer.style.display = "flex";

    // Display user message
    appendMessage(message, "user");

    // Save message to current chat
    saveMessageToChat(message, "user");

    // Clear input
    userInput.value = "";

    // Show typing indicator
    const typingIndicator = appendTypingIndicator();

    try {
        // Get AI response
        const response = await getGeminiResponse(message);

        // Remove typing indicator
        chatContainer.removeChild(typingIndicator);

        // Display AI response
        appendMessage(response, "assistant");

        // Save AI response to current chat
        saveMessageToChat(response, "assistant");

        // Update chat history display
        updateChatHistoryDisplay();

        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    } catch (error) {
        // Remove typing indicator
        chatContainer.removeChild(typingIndicator);

        // Display error message
        const errorMessage = "I'm sorry, I couldn't process your request. Please try again later.";
        appendMessage(errorMessage, "assistant");
        saveMessageToChat(errorMessage, "assistant");
        console.error("Error:", error);
    }
}

// Get response from Google Gemini API
async function getGeminiResponse(message) {
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: "You are Doctor AI, a helpful medical assistant. Provide informative and educational responses about health topics. Always include a disclaimer that you are not a substitute for professional medical advice. The user's query is: " + message
                            }
                        ]
                    }
                ],
                generationConfig: {
                    maxOutputTokens: 500,
                    temperature: 0.7
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        // Extract the response text from Gemini's response format
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

// Append message to chat container
function appendMessage(message, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", `${sender}-message`);

    const messageContent = document.createElement("div");
    messageContent.classList.add("message-content");
    messageContent.textContent = message;

    messageDiv.appendChild(messageContent);
    chatContainer.appendChild(messageDiv);

    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Append typing indicator
function appendTypingIndicator() {
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("message", "assistant-message");

    const typingContent = document.createElement("div");
    typingContent.classList.add("message-content", "typing-indicator");
    typingContent.textContent = "Typing...";

    typingDiv.appendChild(typingContent);
    chatContainer.appendChild(typingDiv);

    return typingDiv;
}

// Start new chat
function startNewChat() {
    // Clear chat container
    chatContainer.innerHTML = "";
    chatContainer.style.display = "none";

    // Show medical disclaimer and example questions again
    medicalDisclaimer.style.display = "block";
    exampleQuestions.style.display = "block";

    // Clear input
    userInput.value = "";

    // Create a new chat
    createNewChat();

    // Focus on input
    userInput.focus();
}

// Create a new chat
function createNewChat() {
    // Generate a unique ID for the chat
    const chatId = 'chat_' + Date.now();

    // Create a new chat object
    const newChat = {
        id: chatId,
        title: 'New Chat',
        messages: [],
        timestamp: Date.now()
    };

    // Add to chats array
    chats.unshift(newChat);

    // Set as current chat
    currentChatId = chatId;

    // Save chats to localStorage
    saveChats();

    // Update chat history display
    renderChatHistory();
}

// Save message to current chat
function saveMessageToChat(message, sender) {
    // Find current chat
    const chatIndex = chats.findIndex(chat => chat.id === currentChatId);

    if (chatIndex !== -1) {
        // Add message to chat
        chats[chatIndex].messages.push({
            sender: sender,
            content: message,
            timestamp: Date.now()
        });

        // Update chat title if it's the first user message
        if (sender === 'user' && chats[chatIndex].messages.filter(msg => msg.sender === 'user').length === 1) {
            // Use first 30 characters of message as title
            chats[chatIndex].title = message.length > 30 ? message.substring(0, 27) + '...' : message;
        }

        // Save chats to localStorage
        saveChats();
    }
}

// Save chats to localStorage
function saveChats() {
    // Keep only the 10 most recent chats
    if (chats.length > 10) {
        chats = chats.slice(0, 10);
    }

    localStorage.setItem('doctorAI_chats', JSON.stringify(chats));
}

// Load chats from localStorage
function loadChats() {
    const savedChats = localStorage.getItem('doctorAI_chats');

    if (savedChats) {
        chats = JSON.parse(savedChats);
    }
}

// Render chat history in sidebar
function renderChatHistory() {
    // Clear existing chat history
    chatHistoryContainer.innerHTML = '';

    // Add each chat to the sidebar
    chats.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.classList.add('chat-history-item');
        chatItem.dataset.chatId = chat.id;

        // Add icon
        const icon = document.createElement('i');
        icon.classList.add('fas', 'fa-comment-dots');
        chatItem.appendChild(icon);

        // Add title
        const span = document.createElement('span');
        span.textContent = chat.title;
        chatItem.appendChild(span);

        // Add click event to load chat
        chatItem.addEventListener('click', () => loadChat(chat.id));

        // Add to container
        chatHistoryContainer.appendChild(chatItem);
    });
}

// Update chat history display after new messages
function updateChatHistoryDisplay() {
    // Find current chat in sidebar
    const chatItems = document.querySelectorAll('.chat-history-item');
    const currentChat = chats.find(chat => chat.id === currentChatId);

    if (currentChat) {
        // Update title if needed
        chatItems.forEach(item => {
            if (item.dataset.chatId === currentChatId) {
                const titleSpan = item.querySelector('span');
                titleSpan.textContent = currentChat.title;
            }
        });
    }
}

// Load a chat from history
function loadChat(chatId) {
    // Find the chat
    const chat = chats.find(chat => chat.id === chatId);

    if (chat) {
        // Set as current chat
        currentChatId = chatId;

        // Clear chat container
        chatContainer.innerHTML = '';

        // Hide medical disclaimer and example questions when loading a chat
        medicalDisclaimer.style.display = "none";
        exampleQuestions.style.display = "none";

        // Show chat container
        chatContainer.style.display = 'flex';

        // Display messages
        chat.messages.forEach(message => {
            appendMessage(message.content, message.sender);
        });

        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}