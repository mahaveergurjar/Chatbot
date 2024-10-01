const { GoogleGenerativeAI } = require("@google/generative-ai");
const { API_KEY } = require("./config");

// getting the theme-button id and theme-icon id from the DOM
const themeButton = document.getElementById('theme-button');
const themeIcon = document.getElementById('theme-icon');

// Initialize GoogleGenerativeAI with the API key
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

document.addEventListener("DOMContentLoaded", () => {
  const inputElement = document.getElementById("input");

  // Focus on the input field when the page loads
  inputElement.focus();

  inputElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  });

  document.getElementById("send-button").addEventListener("click", () => {
    sendMessage();
  });
});



// Image paths for light and dark mode icons
const lightModeIcon = 'assets/theme-button/images/light-mode.png';
const darkModeIcon = 'assets/theme-button/images/dark-mode.png';

// Adding click eventListener to theme-button as 
themeButton.addEventListener('click', function() {
    // Toggle the "light-theme" class on the body
    document.body.classList.toggle('light-theme');
    
    // Swap the image based on the active theme
    if (document.body.classList.contains('light-theme')) {
        themeIcon.src = darkModeIcon;  // Switch to dark mode icon
    } else {
        themeIcon.src = lightModeIcon;  // Switch to light mode icon
    }
});


async function generateContent(prompt) {
  try {
    console.log("Sending prompt:", prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    if (response && response.text) {
      const text = await response.text();
      console.log("Generated text:", text);
      return text;
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}

function sendMessage() {
  const inputElement = document.getElementById("input");
  const userInput = inputElement.value.trim(); // Trim to remove unnecessary spaces
  if (userInput === "") return; // Prevent sending empty messages

  inputElement.value = "";

  const chatDiv = document.getElementById("chat");
  chatDiv.innerHTML += `<div class="user">User: ${escapeHTML(userInput)}</div>`;
  chatDiv.scrollTop = chatDiv.scrollHeight;

  // Show typing indicator
  const typingIndicator = document.createElement("div");
  typingIndicator.classList.add("bot", "typing-indicator");
  typingIndicator.innerText = "typing";
  chatDiv.appendChild(typingIndicator);
  chatDiv.scrollTop = chatDiv.scrollHeight;

  generateContent(userInput)
    .then((botMessage) => {
      const formattedMessage = formatMessage(botMessage);

      // Remove typing indicator
      chatDiv.removeChild(typingIndicator);

      const responseDiv = document.createElement("div");
      responseDiv.classList.add("bot");
      responseDiv.innerHTML = formattedMessage; // Set the formatted message directly
      chatDiv.appendChild(responseDiv);
      chatDiv.scrollTop = chatDiv.scrollHeight;
    })
    .catch((error) => {
      chatDiv.innerHTML += `<div class="bot">Bot: Error connecting to API</div>`;
      console.error("API request error:", error);
    });
}

function formatMessage(text) {
  let formattedText = formatBoldText(text);
  formattedText = formatHeadings(formattedText);
  formattedText = formatCodeBlocks(formattedText);
  formattedText = formatLinks(formattedText);
  formattedText = formatLists(formattedText);
  return formattedText;
}

function formatBoldText(text) {
  return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

function formatCodeBlocks(text) {
  return text.replace(
    /```([a-z]*)\n([\s\S]*?)```/g,
    (match, language, code) => {
      const languageClass = language ? ` language-${language}` : "";
      return `
        <div class="code-block-container">
          <button class="copy-button" onclick="copyCode(event)">Copy</button>
          <pre class="code-block${languageClass}"><code class="hljs">${escapeHTML(
        code
      )}</code></pre>
        </div>`;
    }
  );
}

function copyCode(event) {
  const codeBlock = event.target.nextElementSibling.querySelector("code");
  const code = codeBlock.textContent;
  navigator.clipboard
    .writeText(code)
    .then(() => {
      console.log("Code copied to clipboard");
    })
    .catch((error) => {
      console.error("Error copying code:", error);
    });
}

function formatLists(text) {
  return text
    .replace(/^\s*[-*+]\s+(.*)$/gm, (match, listItem) => `<li>${listItem}</li>`)
    .replace(/^\s*\d+\.\s+(.*)$/gm, (match, listItem) => `<li>${listItem}</li>`)
    .replace(/<\/li>\s*<\/li>/g, "</li><li>")
    .replace(/<li>(.*)<\/li>/g, (match, listItem) => `<li>${listItem}</li>`);
}

function escapeHTML(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatLinks(text) {
  return text.replace(
    /\b(https?:\/\/[^\s]+)\b/g,
    '<a href="$1" target="_blank">$1</a>'
  );
}

function formatHeadings(text) {
  return text.replace(/^(#{1,6})\s+(.*)$/gm, (match, hashes, headingText) => {
    const level = hashes.length;
    return `<h${level} class="heading-${level}">${headingText}</h${level}>`;
  });
}
