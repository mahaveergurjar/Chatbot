const axios = require("axios");

function sendMessage() {
  const inputElement = document.getElementById("input");
  const userInput = inputElement.value;
  inputElement.value = "";

  // Append user message
  const chatDiv = document.getElementById("chat");
  chatDiv.innerHTML += `<div class="user">User: ${userInput}</div>`;
  chatDiv.scrollTop = chatDiv.scrollHeight;

  // API request
  axios
    .post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=YOUR_API_KEY",
      { contents: [{ parts: [{ text: userInput }] }] },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      const botMessage = response.data.candidates[0].content.parts[0].text;

      // Format code snippets and explanations
      const formattedMessage = formatMessage(botMessage);

      chatDiv.innerHTML += `<div class="bot">${formattedMessage}</div>`;
      chatDiv.scrollTop = chatDiv.scrollHeight;
    })
    .catch((error) => {
      chatDiv.innerHTML += `<div class="bot">Bot: Error connecting to API</div>`;
      console.error("API request error:", {
        message: error.message,
        response: error.response ? error.response.data : "No response data",
      });
    });
}

// Handle Enter key press
document.getElementById("input").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent newline in the input field
    sendMessage();
  }
});

// Handle Send button click
document.getElementById("send-button").addEventListener("click", () => {
  sendMessage();
});

// Helper function to format code blocks and explanations
function formatMessage(text) {
  let formattedText = formatCodeBlocks(text);
  formattedText = formatHeadings(formattedText);
  formattedText = formatLinks(formattedText);
  return formattedText;
}

// Helper function to format code blocks
function formatCodeBlocks(text) {
  return text.replace(
    /```([a-z]*)\n([\s\S]*?)```/g,
    (match, language, code) => {
      const languageClass = language ? ` language-${language}` : "";
      return `<pre class="code-block${languageClass}"><code>${escapeHTML(
        code
      )}</code></pre>`;
    }
  );
}

// Helper function to escape HTML entities
function escapeHTML(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Helper function to format links
function formatLinks(text) {
  return text.replace(
    /\b(https?:\/\/[^\s]+)\b/g,
    '<a href="$1" target="_blank">$1</a>'
  );
}

// Helper function to format headings
function formatHeadings(text) {
  return text.replace(/^(#{1,6})\s+(.*)$/gm, (match, hashes, headingText) => {
    const level = hashes.length;
    return `<h${level} class="heading-${level}">${headingText}</h${level}>`;
  });
}
