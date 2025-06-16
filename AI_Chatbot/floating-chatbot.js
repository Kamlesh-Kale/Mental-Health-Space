// Floating Chatbot Functionality

// DOM Elements for Floating Chatbot
const floatingChatbot = document.getElementById('floatingChatbot');
const floatingChatbotToggle = document.getElementById('floatingChatbotToggle');
const floatingChatbotHeader = document.getElementById('floatingChatbotHeader');
const minimizeChatbot = document.getElementById('minimizeChatbot');
const closeChatbot = document.getElementById('closeChatbot');
const floatingChatForm = document.getElementById('floatingChatForm');
const floatingUserInput = document.getElementById('floatingUserInput');
const floatingChatbotMessages = document.getElementById('floatingChatbotMessages');

// Variables for dragging functionality
let isDragging = false;
let offsetX, offsetY;

// Initialize floating chatbot
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for floating chatbot
    floatingChatbotToggle.addEventListener('click', toggleChatbot);
    minimizeChatbot.addEventListener('click', minimizeChatbotWindow);
    closeChatbot.addEventListener('click', closeChatbotWindow);
    floatingChatForm.addEventListener('submit', handleFloatingChatSubmit);

    // Make the chatbot draggable
    floatingChatbotHeader.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);

    // Touch support for mobile devices
    floatingChatbotHeader.addEventListener('touchstart', startDragTouch);
    document.addEventListener('touchmove', dragTouch);
    document.addEventListener('touchend', stopDrag);
});

// Toggle chatbot visibility
function toggleChatbot() {
    floatingChatbot.classList.toggle('active');
    floatingChatbotToggle.classList.toggle('active');
}

// Minimize chatbot
function minimizeChatbotWindow() {
    floatingChatbot.classList.remove('active');
    floatingChatbotToggle.classList.remove('active');
}

// Close chatbot
function closeChatbotWindow() {
    floatingChatbot.classList.remove('active');
    floatingChatbotToggle.classList.remove('active');
}

// Start dragging the chatbot (mouse)
function startDrag(e) {
    isDragging = true;

    // Calculate the offset of the mouse pointer relative to the chatbot header
    const rect = floatingChatbot.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    // Prevent text selection during drag
    e.preventDefault();
}

// Start dragging the chatbot (touch)
function startDragTouch(e) {
    isDragging = true;

    // Calculate the offset of the touch point relative to the chatbot header
    const rect = floatingChatbot.getBoundingClientRect();
    offsetX = e.touches[0].clientX - rect.left;
    offsetY = e.touches[0].clientY - rect.top;

    // Prevent default touch behavior
    e.preventDefault();
}

// Drag the chatbot (mouse)
function drag(e) {
    if (!isDragging) return;

    // Calculate new position
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;

    // Apply new position
    floatingChatbot.style.left = `${x}px`;
    floatingChatbot.style.top = `${y}px`;
    floatingChatbot.style.right = 'auto';
    floatingChatbot.style.bottom = 'auto';
}

// Drag the chatbot (touch)
function dragTouch(e) {
    if (!isDragging) return;

    // Calculate new position
    const x = e.touches[0].clientX - offsetX;
    const y = e.touches[0].clientY - offsetY;

    // Apply new position
    floatingChatbot.style.left = `${x}px`;
    floatingChatbot.style.top = `${y}px`;
    floatingChatbot.style.right = 'auto';
    floatingChatbot.style.bottom = 'auto';

    // Prevent default touch behavior
    e.preventDefault();
}

// Stop dragging
function stopDrag() {
    isDragging = false;
}

// Handle floating chat form submission
async function handleFloatingChatSubmit(e) {
    e.preventDefault();

    const message = floatingUserInput.value.trim();
    if (!message) return;

    // Display user message
    appendFloatingMessage(message, 'user');

    // Clear input
    floatingUserInput.value = '';

    // Show typing indicator
    const typingIndicator = appendFloatingTypingIndicator();

    try {
        // Get AI response using the same API as the main chatbot
        const response = await getGeminiResponse(message);

        // Remove typing indicator
        floatingChatbotMessages.removeChild(typingIndicator);

        // Display AI response
        appendFloatingMessage(response, 'assistant');

        // Scroll to bottom
        floatingChatbotMessages.scrollTop = floatingChatbotMessages.scrollHeight;
    } catch (error) {
        // Remove typing indicator
        floatingChatbotMessages.removeChild(typingIndicator);

        // Display error message
        const errorMessage = "I'm sorry, I couldn't process your request. Please try again later.";
        appendFloatingMessage(errorMessage, 'assistant');
        console.error("Error:", error);
    }
}

// Append message to floating chat container
function appendFloatingMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('floating-message', `floating-${sender}-message`);

    const messageContent = document.createElement('div');
    messageContent.classList.add('floating-message-content');
    messageContent.textContent = message;

    messageDiv.appendChild(messageContent);
    floatingChatbotMessages.appendChild(messageDiv);

    // Scroll to bottom
    floatingChatbotMessages.scrollTop = floatingChatbotMessages.scrollHeight;
}

// Append typing indicator to floating chat
function appendFloatingTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('floating-message', 'floating-assistant-message');

    const typingContent = document.createElement('div');
    typingContent.classList.add('floating-message-content', 'typing-indicator');
    typingContent.textContent = 'Typing...';

    typingDiv.appendChild(typingContent);
    floatingChatbotMessages.appendChild(typingDiv);

    return typingDiv;
}