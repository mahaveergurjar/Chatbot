# Desktop ChatBot Application

## Overview

This chat application allows users to send messages and receive responses from a language model API. It supports code formatting, explanations, and link formatting. The application uses `axios` for API requests and displays chat messages in a styled interface.

## Features

- **User and Bot Messaging:** Sends user input to an API and displays the bot's response.
- **Code Formatting:** Formats code blocks with syntax highlighting.
- **Explanation Formatting:** Provides clear and structured explanations.
- **Link Formatting:** Automatically converts URLs into clickable links.
- **Dark Theme:** The application uses a dark theme for better readability in low-light environments.

## Installation

To set up and run the chat application locally, follow these steps:

### Prerequisites

- **Node.js** and **npm** (or **yarn**) installed on your machine.

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/mahaveergurjar/Chatbot.git
   cd Chatboot

   ```

2. **Install Dependencies**

   `npm install`

3. **Create API Key**

   To generate an API key for Gemini AI, follow these steps:

   1. Visit the [Gemini AI API Key Generation page](https://aistudio.google.com/app/apikey?).
   2. Sign in with your Google account if prompted.
   3. Generate a new API key.
   4. Copy the generated API key.

4. **Add Your API Key**

   After generating your API key, you need to add it to the `renderer.js` file:

   1. Open the `renderer.js` file.
   2. Replace the placeholder `YOUR_API_KEY_HERE` with your actual API key:

5. **Run the Application**

   `npm start`
