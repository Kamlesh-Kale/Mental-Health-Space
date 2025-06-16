# Doctor AI - Medical Assistant

A web-based AI assistant that uses the Google Gemini API and assumes the role of a medical doctor to provide health-related information and advice.

## Features

- Clean, modern UI similar to ChatGPT
- Medical doctor persona for all AI interactions
- Google Gemini API integration
- Chat history saving
- Responsive design for mobile and desktop
- Markdown support for formatted responses
- Local storage for settings and conversation history

## Setup Instructions

1. Clone or download this repository to your local machine
2. Open the `index.html` file in your web browser
3. Click on the "Settings" button in the bottom left corner
4. Enter your Google Gemini API key (you can get one from [Google AI Studio](https://aistudio.google.com/app/apikey))
5. Make sure "Use API" is toggled on
6. Click "Save Settings"
7. Start chatting with your AI doctor!

## Important Notes

- Your Google Gemini API key is stored locally in your browser and is never sent to any server other than Google's API
- This application is for informational purposes only and is not a substitute for professional medical advice
- This application uses the free tier Gemini model (gemini-1.5-flash) and should not incur charges

## Technical Details

This application is built with:
- HTML5
- CSS3
- Vanilla JavaScript (no frameworks)
- Google Gemini Pro API
- Font Awesome for icons

## Customization

You can modify the system prompt in the `script.js` file to change how the AI responds. Look for the `getAIResponse` function and modify the system message to adjust the AI's behavior.

## License

This project is available for personal and commercial use.

## Disclaimer

This AI assistant is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.