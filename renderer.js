const { GoogleGenerativeAI } = require("@google/generative-ai");
const { API_KEY } = require("./config");

let selectedImage = null; // Global variable to store the selected image
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

document.addEventListener("DOMContentLoaded", () => {
  const inputElement = document.getElementById("input");
  inputElement.focus();

  inputElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  });

  document.getElementById("send-button").addEventListener("click", sendMessage);
});

document.getElementById("image-input").addEventListener("change", (event) => {
  const file = event.target.files[0];
  const previewContainer = document.getElementById("preview-container");
  const previewImage = document.getElementById("preview-image");

  if (file) {
    selectedImage = file; 
    const reader = new FileReader();

    reader.onload = (e) => {
      previewImage.src = e.target.result;
      previewContainer.style.display = 'block';
    };

    reader.readAsDataURL(file);
  }
});

document.getElementById('remove-image').addEventListener('click', () => {
  selectedImage = null; 
  document.getElementById("preview-image").src = '';
  document.getElementById("preview-container").style.display = 'none'; 
  document.getElementById("image-input").value = '';
});

function fileToGenerativePart(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result.split(",")[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = (error) => reject("Error reading file: " + error);
    reader.readAsDataURL(file);
  });
}

async function generateContent(prompt) {
  try {
    console.log("Sending prompt:", prompt);

    let result;
    if (selectedImage) {
      const imagePart = await fileToGenerativePart(selectedImage);
      result = await model.generateContent([prompt, imagePart]);
    } else {
      result = await model.generateContent([prompt]);
    }

    return result.response.text();
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}

function sendMessage() {
  const inputElement = document.getElementById("input");
  const userInput = inputElement.value.trim();
  if (!userInput) return; 

  inputElement.value = "";
  const chatDiv = document.getElementById("chat");
  chatDiv.innerHTML += `<div class="user">User: ${escapeHTML(userInput)}</div>`;
  chatDiv.scrollTop = chatDiv.scrollHeight;

  const typingIndicator = document.createElement("div");
  typingIndicator.classList.add("bot", "typing-indicator");
  typingIndicator.innerText = "typing...";
  chatDiv.appendChild(typingIndicator);
  chatDiv.scrollTop = chatDiv.scrollHeight;

  document.getElementById('preview-container').style.display = 'none';

  generateContent(userInput)
    .then((botMessage) => {
      const formattedMessage = formatMessage(botMessage);
      chatDiv.removeChild(typingIndicator);

      const responseDiv = document.createElement("div");
      responseDiv.classList.add("bot");

      if (selectedImage) {
        const previewImage = document.createElement("img");
        previewImage.src = URL.createObjectURL(selectedImage);
        previewImage.alt = "User image";
        previewImage.classList.add("response-image");
        responseDiv.appendChild(previewImage);
        responseDiv.appendChild(document.createElement("br"));
      }

      responseDiv.innerHTML += formattedMessage; 
      chatDiv.appendChild(responseDiv);
      chatDiv.scrollTop = chatDiv.scrollHeight;

      selectedImage = null;
      document.getElementById('remove-image').click();
    })
    .catch((error) => {
      chatDiv.innerHTML += `<div class="bot">Bot: ${error}</div>`;
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
    (match, language, code) => `
      <div class="code-block-container">
        <button class="copy-button" onclick="copyCode(event)">Copy</button>
        <pre class="code-block${language ? ` language-${language}` : ''}"><code class="hljs">${escapeHTML(code)}</code></pre>
      </div>`
  );
}

function copyCode(event) {
  const codeBlock = event.target.nextElementSibling.querySelector("code");
  navigator.clipboard
    .writeText(codeBlock.textContent)
    .then(() => console.log("Code copied to clipboard"))
    .catch((error) => console.error("Error copying code:", error));
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
  return text.replace(/\b(https?:\/\/[^\s]+)\b/g, '<a href="$1" target="_blank">$1</a>');
}

function formatHeadings(text) {
  return text.replace(/^(#{1,6})\s+(.*)$/gm, (match, hashes, headingText) => {
    const level = hashes.length;
    return `<h${level} class="heading-${level}">${headingText}</h${level}>`;
  });
}

function onImageIconClick() {
  document.getElementById('image-input').click();
}
