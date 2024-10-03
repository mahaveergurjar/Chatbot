const { GoogleGenerativeAI } = require("@google/generative-ai");
const { API_KEY } = require("./config");

// getting the theme-button id and theme-icon id from the DOM
const themeButton = document.getElementById('theme-button');
const themeIcon = document.getElementById('theme-icon');

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB


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


function onFileIconClick(){
  document.getElementById('drag-drop-modal').style.display = 'block';
}

function onBrowseFileClick(){
  document.getElementById('file').click();
}


function closeModal(){
  document.getElementById('drag-drop-modal').style.display = 'none';
}


// Store the selected file
let selectedFile = null;

document.getElementById("file").addEventListener("change", (event) => {
  document.getElementById('drag-drop-modal').style.display = 'none';
  const file = event.target.files[0];

  if (file) {
    if (file.size >= MAX_FILE_SIZE) {
      alert("File size exceeds 20MB. Please select a smaller file.");
      return; // Do not proceed if file size is too large
    }
  }
  const previewContainer = document.getElementById("preview-container");
  const previewImage = document.getElementById("preview-image");
  const fileIconContainer = document.getElementById("file-icon-container");

  if (file) {
    selectedFile = file;
    const fileType = file.type;

    if (fileType.startsWith('image/')) {
      // If the file is an image, show the image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
        previewContainer.style.display = 'block'; // Show the image container
        fileIconContainer.style.display = 'none'; // Hide the file icon
      };
      reader.readAsDataURL(file);
    } else {
      // If the file is not an image, show the file icon
      previewContainer.style.display = 'block'; // Hide the image container
      fileIconContainer.style.display = 'block'; // Show the file icon
      previewImage.style.display = 'none';
    }

    document.getElementById("fileName").textContent = file.name;
  }
});


// Drag and Drop functionality
const dropArea = document.getElementById("drop-area");

dropArea.addEventListener("dragover", (event) => {
  event.preventDefault(); // Prevent default behavior
  dropArea.classList.add("drag-over"); // Optional: add visual feedback
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("drag-over"); // Remove visual feedback
});

dropArea.addEventListener("drop", (event) => {
  event.preventDefault(); // Prevent default behavior
  dropArea.classList.remove("drag-over"); // Remove visual feedback
  const files = event.dataTransfer.files;
  if (files.length) {
    
    closeModal()
    handleFiles(files);
  }
});

// Handle file selection from the file input
document.getElementById("file").addEventListener("change", (event) => {
  const files = event.target.files;
  if (files.length) {
    handleFiles(files);
  }
});

// Function to handle file uploads
function handleFiles(files) {
  
  
  const file = files[0];

  if (file) {
    if (file.size >= MAX_FILE_SIZE) {
      alert("File size exceeds 20MB. Please select a smaller file.");
      return; // Do not proceed if file size is too large
    }
    
    selectedFile = file; // Set the selected file

    const previewContainer = document.getElementById("preview-container");
    const previewImage = document.getElementById("preview-image");
    const fileIconContainer = document.getElementById("file-icon-container");

    if (file.type.startsWith('image/')) {
      // If the file is an image, show the image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
        previewContainer.style.display = 'block'; // Show the image container
        fileIconContainer.style.display = 'none'; // Hide the file icon
      };
      reader.readAsDataURL(file);
    } else {
      // If the file is not an image, show the file icon
      previewContainer.style.display = 'block'; // Show the file icon
      fileIconContainer.style.display = 'block'; // Show the file icon
      previewImage.style.display = 'none';
    }

    document.getElementById("fileName").textContent = file.name;
  }
}


function removeFile() {
  selectedFile = null; // Resetting the selected file
  
  // Resetting the preview
  const previewImage = document.getElementById("preview-image");
  const previewContainer = document.getElementById("preview-container");
  const fileIconContainer = document.getElementById("file-icon-container");
  const fileInput = document.getElementById("file");
  
  previewImage.src = ''; // Clear image source
  previewContainer.style.display = 'none'; // Hide preview container
  fileIconContainer.style.display = 'none'; // Hide file icon container
  fileInput.value = ''; // Clear file input
}

// Helper method to convert a file to the generative part required by the API
function fileToGenerativePart(file, mimeType) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = function () {
      const base64Data = reader.result.split(",")[1]; // Get base64 string without metadata
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: mimeType || file.type,
        },
      });
    };

    reader.onerror = function (error) {
      reject("Error reading file: " + error);
    };

    reader.readAsDataURL(file); // Read the file as a base64 Data URL
  });
}

function sendMessage() {
  const inputElement = document.getElementById("input");
  const userInput = inputElement.value.trim();

  // Prevent sending empty messages
  if (!userInput && !selectedFile) return;

  const chatDiv = document.getElementById("chat");

  // Create a container for the user's message
  const userMessageDiv = document.createElement("div");
  userMessageDiv.classList.add("user");

  // Add user input to chat
  if (userInput) {
    userMessageDiv.innerHTML += `User: ${escapeHTML(userInput)}`;
    inputElement.value = "";
  }

  // Add the user's selected file to the message, if any
  if (selectedFile && selectedFile.type.startsWith("image/")) {
    // Add the image to the user's message
    const previewImage = document.createElement("img");
    previewImage.src = URL.createObjectURL(selectedFile);
    previewImage.alt = "Uploaded file preview";
    previewImage.classList.add("response-image");
    userMessageDiv.appendChild(document.createElement("br"));
    userMessageDiv.appendChild(previewImage);
  }else{// Add the file name and icon to the user's message
    const fileName = document.createElement("div");
    fileName.classList.add("fileName");
    
    // Add the file icon
    const fileIcon = document.createElement("i");
    fileIcon.classList.add("fas", "fa-file");
    fileIcon.style.fontSize = "24px";
    fileIcon.style.marginRight = "8px";
    
    
    fileName.appendChild(fileIcon);  // Append icon before the file name
    fileIcon.appendChild(document.createElement("br"));
    fileName.appendChild(document.createTextNode(selectedFile.name));
    userMessageDiv.appendChild(document.createElement("br"));
    
    userMessageDiv.appendChild(fileName);
    
  }

  // Append user's message to the chat
  chatDiv.appendChild(userMessageDiv);
  chatDiv.scrollTop = chatDiv.scrollHeight;

  // Show typing indicator
  const typingIndicator = document.createElement("div");
  typingIndicator.classList.add("bot", "typing-indicator");
  typingIndicator.innerText = "typing...";
  chatDiv.appendChild(typingIndicator);
  chatDiv.scrollTop = chatDiv.scrollHeight;

  // Generate content using the prompt and selected file if available
  generateContent(userInput).then((botMessage) => {
    // Remove typing indicator
    chatDiv.removeChild(typingIndicator);

    const responseDiv = document.createElement("div");
    responseDiv.classList.add("bot");

    // Add the user's selected file to the bot's response, if any
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const botImage = document.createElement("img");
      botImage.src = URL.createObjectURL(selectedFile);
      botImage.alt = "Uploaded file preview";
      botImage.classList.add("response-image");
      responseDiv.appendChild(botImage);
      responseDiv.appendChild(document.createElement("br"));
    }

    // Format and append the bot's message
    responseDiv.innerHTML += formatMessage(botMessage);
    chatDiv.appendChild(responseDiv);
    chatDiv.scrollTop = chatDiv.scrollHeight;

  }).catch((error) => {
    chatDiv.innerHTML += `<div class="bot">Bot: ${error}</div>`;
    console.error("Error generating content:", error);
  });

  
    // Clear the selected file and preview after sending the message
    selectedFile = null;
    closeModal();

  // Hide the preview and reset the input
  document.getElementById("preview-image").src = '';
  document.getElementById("preview-container").style.display = 'none';
  document.getElementById("file-icon-container").style.display = 'none';
  document.getElementById("file").value = '';
}


async function generateContent(prompt) {
  try {
    let result;

    if (selectedFile) {
      // Dynamically handle the file's MIME type
      let mimeType;
      const fileType = selectedFile.type;

      // Check for specific file types and set the MIME type accordingly
      if (fileType.startsWith("image/")) {
        mimeType = fileType;  // Pass image MIME type (e.g., "image/jpeg", "image/png")
      } else if (fileType.startsWith("audio/")) {
        mimeType = "audio/mp3";  // For audio
      } else {
        // Unsupported file type
        alert(`Unsupported file type. Please upload an image, video, or audio file. ${fileType}`);
        return;
      }

      
      // Convert file to the part required by the API
      const filePart = await fileToGenerativePart(selectedFile, mimeType);

      // Send both the prompt and the file part
      result = await model.generateContent([prompt, filePart]);

      console.log("File sent with prompt.");
    } else {
      // Only prompt provided, no file
      result = await model.generateContent([prompt]);
    }

    return result.response.text();  // Return the generated response from the model
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
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

