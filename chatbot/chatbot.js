/* ── Portfolio Chatbot Widget ──
   Self-contained chat widget for portfolio site.
   Connects to a Vercel serverless function that proxies Gemini API.
   ─────────────────────────────────────────────── */

(function () {
  "use strict";

  // ━━ CONFIG ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Replace this with your deployed Vercel URL
  const API_URL = "https://portfolio-chatbot-api-delta.vercel.app/api/chat";
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const WELCOME_MSG =
    "Hey! I'm Vusumuzi's AI assistant. Ask me anything about his skills, projects, or experience.";

  const SUGGESTIONS = [
    "What projects has he built?",
    "What tech stack does he use?",
    "Is he available for work?",
  ];

  // ── Build DOM ──

  // Toggle button
  const toggle = document.createElement("button");
  toggle.className = "chatbot-toggle";
  toggle.setAttribute("aria-label", "Open chat");
  toggle.innerHTML = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
    </svg>`;

  // Chat window
  const win = document.createElement("div");
  win.className = "chatbot-window";
  win.innerHTML = `
    <div class="chatbot-header">
      <div class="chatbot-header-avatar">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2a7.2 7.2 0 01-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 01-6 3.22z"/>
        </svg>
      </div>
      <div class="chatbot-header-info">
        <p class="chatbot-header-name">Vusumuzi's Assistant</p>
        <p class="chatbot-header-status">// online</p>
      </div>
    </div>
    <div class="chatbot-messages"></div>
    <div class="chatbot-suggestions"></div>
    <div class="chatbot-input-area">
      <input class="chatbot-input" type="text" placeholder="Ask me anything..." />
      <button class="chatbot-send" aria-label="Send message">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </button>
    </div>`;

  document.body.appendChild(toggle);
  document.body.appendChild(win);

  // ── References ──
  const messagesEl = win.querySelector(".chatbot-messages");
  const suggestionsEl = win.querySelector(".chatbot-suggestions");
  const inputEl = win.querySelector(".chatbot-input");
  const sendBtn = win.querySelector(".chatbot-send");

  // Conversation history for context
  let history = [];

  // ── Helpers ──

  function addMessage(text, sender) {
    const div = document.createElement("div");
    div.className = `chatbot-msg ${sender}`;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function showTyping() {
    const div = document.createElement("div");
    div.className = "chatbot-typing";
    div.innerHTML = "<span></span><span></span><span></span>";
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function renderSuggestions(items) {
    suggestionsEl.innerHTML = "";
    items.forEach((text) => {
      const btn = document.createElement("button");
      btn.className = "chatbot-suggestion-btn";
      btn.textContent = text;
      btn.addEventListener("click", () => {
        suggestionsEl.innerHTML = "";
        sendMessage(text);
      });
      suggestionsEl.appendChild(btn);
    });
  }

  // ── API Call ──

  async function sendMessage(text) {
    // Add user message
    addMessage(text, "user");
    history.push({ role: "user", text: text });

    // Disable input while waiting
    inputEl.disabled = true;
    sendBtn.disabled = true;

    // Show typing
    const typing = showTyping();

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: history.slice(-10) }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn't process that. Try again!";

      // Remove typing, add bot message
      typing.remove();
      addMessage(reply, "bot");
      history.push({ role: "assistant", text: reply });
    } catch (err) {
      typing.remove();
      addMessage(
        "Oops — something went wrong. Please try again in a moment.",
        "bot"
      );
      console.error("Chatbot error:", err);
    }

    // Re-enable input
    inputEl.disabled = false;
    sendBtn.disabled = false;
    inputEl.focus();
  }

  // ── Events ──

  // Toggle open/close
  toggle.addEventListener("click", () => {
    const isOpen = win.classList.toggle("open");
    toggle.classList.toggle("active", isOpen);
    toggle.setAttribute("aria-label", isOpen ? "Close chat" : "Open chat");
    if (isOpen) inputEl.focus();
  });

  // Send on button click
  sendBtn.addEventListener("click", () => {
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = "";
    suggestionsEl.innerHTML = "";
    sendMessage(text);
  });

  // Send on Enter key
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendBtn.click();
    }
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && win.classList.contains("open")) {
      win.classList.remove("open");
      toggle.classList.remove("active");
    }
  });

  // ── Init ──
  addMessage(WELCOME_MSG, "bot");
  renderSuggestions(SUGGESTIONS);
})();
