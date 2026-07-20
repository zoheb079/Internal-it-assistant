const KNOWLEDGE_ROUTE_PREFIX = "/api/knowledge/";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // =========================================================
    // USER CHAT PAGE
    // =========================================================
    if (request.method === "GET" && url.pathname === "/") {
      return new Response(
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>Internal IT Assistant</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      font-family: Arial, sans-serif;
      background: #f4f6f8;
      margin: 0;
      padding: 30px 20px;
    }

    .container {
      max-width: 750px;
      margin: auto;
      background: white;
      padding: 30px;
      border-radius: 14px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    h1 {
      margin-top: 0;
      margin-bottom: 8px;
    }

    .subtitle {
      margin-top: 0;
      color: #555;
    }

    .top-links {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 15px;
    }

    .admin-link {
      text-decoration: none;
      color: #1a73e8;
      font-size: 14px;
      font-weight: bold;
    }

    #chat {
      margin-top: 25px;
      max-height: 450px;
      overflow-y: auto;
    }

    .message {
      padding: 14px;
      margin-bottom: 12px;
      border-radius: 10px;
      line-height: 1.5;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .user-message {
      background: #e8f0fe;
      margin-left: 60px;
    }

    .assistant-message {
      background: #f1f3f4;
      margin-right: 60px;
    }

    .source {
      margin-top: 10px;
      padding-top: 8px;
      border-top: 1px solid #ddd;
      font-size: 12px;
      color: #666;
    }

    .input-area {
      margin-top: 20px;
    }

    textarea {
      width: 100%;
      min-height: 90px;
      padding: 12px;
      font-family: Arial, sans-serif;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 8px;
      resize: vertical;
    }

    textarea:focus {
      outline: 2px solid #b8cdfa;
      border-color: #4776d0;
    }

    button {
      margin-top: 12px;
      padding: 12px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      background: #1a73e8;
      color: white;
    }

    button:hover {
      background: #1557b0;
    }

    button:disabled {
      background: #999;
      cursor: not-allowed;
    }

    .hint {
      margin-top: 8px;
      color: #777;
      font-size: 12px;
    }

    @media (max-width: 600px) {
      body {
        padding: 15px;
      }

      .container {
        padding: 20px;
      }

      .user-message,
      .assistant-message {
        margin-left: 0;
        margin-right: 0;
      }
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="top-links">
      <a class="admin-link" href="/admin">
        Knowledge Admin
      </a>
    </div>

    <h1>Internal IT Assistant</h1>

    <p class="subtitle">
      Ask a question about IT support.
    </p>

    <div id="chat"></div>

    <div class="input-area">
      <textarea
        id="question"
        placeholder="Example: How can I reset my password?"
      ></textarea>

      <button id="askButton" onclick="askQuestion()">
        Ask Assistant
      </button>

      <div class="hint">
        Press Enter to send. Use Shift + Enter for a new line.
      </div>
    </div>
  </div>

  <script>
    async function askQuestion() {
      const questionInput =
        document.getElementById("question");

      const chat =
        document.getElementById("chat");

      const button =
        document.getElementById("askButton");

      const question = questionInput.value.trim();

      if (!question) {
        alert("Please enter a question.");
        return;
      }

      const userMessage =
        document.createElement("div");

      userMessage.className =
        "message user-message";

      userMessage.textContent = question;

      chat.appendChild(userMessage);

      questionInput.value = "";
      button.disabled = true;
      button.textContent = "Thinking...";

      const assistantMessage =
        document.createElement("div");

      assistantMessage.className =
        "message assistant-message";

      assistantMessage.textContent =
        "Searching the knowledge base...";

      chat.appendChild(assistantMessage);

      chat.scrollTop = chat.scrollHeight;

      try {
        const response = await fetch(
          "/api/ask?question=" +
          encodeURIComponent(question)
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
            "The assistant request failed."
          );
        }

        assistantMessage.textContent =
          data.answer ||
          "No answer was returned.";

        if (data.source) {
          const sourceElement =
            document.createElement("div");

          sourceElement.className = "source";

          sourceElement.textContent =
            "Source: " +
            data.source.title +
            " | Category: " +
            data.source.category;

          assistantMessage.appendChild(
            sourceElement
          );
        }
      } catch (error) {
        assistantMessage.textContent =
          error.message ||
          "Unable to contact the assistant.";
      } finally {
        button.disabled = false;
        button.textContent = "Ask Assistant";
        questionInput.focus();

        chat.scrollTop = chat.scrollHeight;
      }
    }

    document
      .getElementById("question")
      .addEventListener(
        "keydown",
        function (event) {
          if (
            event.key === "Enter" &&
            !event.shiftKey
          ) {
            event.preventDefault();
            askQuestion();
          }
        }
      );
  </script>
</body>
</html>`,
        {
          headers: {
            "Content-Type":
              "text/html; charset=UTF-8"
          }
        }
      );
    }

    // =========================================================
    // ADMIN PAGE
    // =========================================================
    if (
      request.method === "GET" &&
      url.pathname === "/admin"
    ) {
      return new Response(
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>Knowledge Base Admin</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 30px 20px;
      font-family: Arial, sans-serif;
      background: #f4f6f8;
    }

    .container {
      max-width: 1000px;
      margin: auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      margin-bottom: 25px;
    }

    h1 {
      margin: 0 0 8px;
    }

    .subtitle {
      margin: 0;
      color: #666;
    }

    .chat-link {
      text-decoration: none;
      background: #1a73e8;
      color: white;
      padding: 11px 18px;
      border-radius: 8px;
    }

    .chat-link:hover {
      background: #1557b0;
    }

    .summary {
      margin-bottom: 20px;
      color: #555;
    }

    .article {
      background: white;
      margin-bottom: 16px;
      padding: 22px;
      border-radius: 12px;
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
    }

    .article h2 {
      margin: 0 0 8px;
    }

    .metadata {
      margin-bottom: 14px;
      font-size: 13px;
      color: #666;
    }

    .content {
      line-height: 1.6;
      white-space: pre-wrap;
    }

    .keywords {
      margin-top: 15px;
    }

    .keyword {
      display: inline-block;
      margin: 4px 5px 0 0;
      padding: 5px 9px;
      border-radius: 20px;
      background: #e8f0fe;
      font-size: 12px;
    }

    .status {
      background: white;
      padding: 20px;
      border-radius: 12px;
    }

    @media (max-width: 650px) {
      .header {
        align-items: flex-start;
        flex-direction: column;
      }
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <div>
        <h1>Knowledge Base Admin</h1>

        <p class="subtitle">
          View articles currently used by the IT assistant.
        </p>
      </div>

      <a class="chat-link" href="/">
        Open Assistant
      </a>
    </div>

    <div id="summary" class="summary">
      Loading knowledge articles...
    </div>

    <div id="articles"></div>
  </div>

  <script>
    function escapeHtml(value) {
      return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    async function loadArticles() {
      const summary =
        document.getElementById("summary");

      const articlesContainer =
        document.getElementById("articles");

      try {
        const response =
          await fetch("/api/articles");

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
            "Unable to load articles."
          );
        }

        summary.textContent =
          data.count +
          " knowledge article(s) available.";

        if (data.articles.length === 0) {
          articlesContainer.innerHTML =
            '<div class="status">' +
            "No articles found." +
            "</div>";

          return;
        }

        articlesContainer.innerHTML =
          data.articles
            .map(function (article) {
              const keywords =
                (article.keywords || [])
                  .map(function (keyword) {
                    return (
                      '<span class="keyword">' +
                      escapeHtml(keyword) +
                      "</span>"
                    );
                  })
                  .join("");

              return (
                '<div class="article">' +

                "<h2>" +
                escapeHtml(article.title) +
                "</h2>" +

                '<div class="metadata">' +
                "Key: " +
                escapeHtml(article.key) +
                " | Category: " +
                escapeHtml(article.category) +
                "</div>" +

                '<div class="content">' +
                escapeHtml(article.content) +
                "</div>" +

                '<div class="keywords">' +
                keywords +
                "</div>" +

                "</div>"
              );
            })
            .join("");
      } catch (error) {
        summary.textContent =
          "Unable to load articles.";

        articlesContainer.innerHTML =
          '<div class="status">' +
          escapeHtml(error.message) +
          "</div>";
      }
    }

    loadArticles();
  </script>
</body>
</html>`,
        {
          headers: {
            "Content-Type":
              "text/html; charset=UTF-8"
          }
        }
      );
    }

    // =========================================================
    // HEALTH ENDPOINT
    // =========================================================
    if (
      request.method === "GET" &&
      url.pathname === "/health"
    ) {
      return Response.json({
        status: "healthy",
        service: "internal-it-assistant",
        environment: "cloudflare",
        timestamp: new Date().toISOString()
      });
    }

    // =========================================================
    // GET ALL ARTICLES
    // =========================================================
    if (
      request.method === "GET" &&
      url.pathname === "/api/articles"
    ) {
      const list =
        await env.INTERNAL_IT_KNOWLEDGE.list();

      const articles = [];

      for (const item of list.keys) {
        const rawArticle =
          await env.INTERNAL_IT_KNOWLEDGE.get(
            item.name
          );

        if (!rawArticle) {
          continue;
        }

        try {
          const article =
            JSON.parse(rawArticle);

          articles.push(article);
        } catch (error) {
          console.error(
            "Invalid article:",
            item.name,
            error
          );
        }
      }

      articles.sort(function (a, b) {
        return (a.title || "").localeCompare(
          b.title || ""
        );
      });

      return Response.json({
        count: articles.length,
        articles
      });
    }

    // =========================================================
    // GET ONE KNOWLEDGE ARTICLE
    // =========================================================
    if (
      request.method === "GET" &&
      url.pathname.startsWith(
        KNOWLEDGE_ROUTE_PREFIX
      )
    ) {
      const articleKey =
        decodeURIComponent(
          url.pathname.slice(
            KNOWLEDGE_ROUTE_PREFIX.length
          )
        ).trim();

      if (!articleKey) {
        return Response.json(
          {
            error:
              "Knowledge article key is required.",
            example:
              "/api/knowledge/helpdesk-hours"
          },
          {
            status: 400
          }
        );
      }

      const content =
        await env.INTERNAL_IT_KNOWLEDGE.get(
          articleKey
        );

      if (content === null) {
        return Response.json(
          {
            error:
              "Knowledge article not found.",
            key: articleKey
          },
          {
            status: 404
          }
        );
      }

      try {
        const article =
          JSON.parse(content);

        return Response.json(article);
      } catch {
        return Response.json(
          {
            error:
              "The stored article is invalid JSON.",
            key: articleKey
          },
          {
            status: 500
          }
        );
      }
    }

    // =========================================================
    // SEARCH ARTICLES
    // =========================================================
    if (
      request.method === "GET" &&
      url.pathname === "/api/search"
    ) {
      const query =
        (url.searchParams.get("q") || "")
          .trim()
          .toLowerCase();

      if (!query) {
        return Response.json(
          {
            error:
              "Search query is required.",
            example:
              "/api/search?q=vpn"
          },
          {
            status: 400
          }
        );
      }

      const list =
        await env.INTERNAL_IT_KNOWLEDGE.list();

      const results = [];

      for (const item of list.keys) {
        const rawArticle =
          await env.INTERNAL_IT_KNOWLEDGE.get(
            item.name
          );

        if (!rawArticle) {
          continue;
        }

        try {
          const article =
            JSON.parse(rawArticle);

          const searchableText = [
            article.key,
            article.title,
            article.category,
            ...(article.keywords || []),
            article.content
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          if (
            searchableText.includes(query)
          ) {
            results.push(article);
          }
        } catch (error) {
          console.error(
            "Invalid article:",
            item.name,
            error
          );
        }
      }

      return Response.json({
        query,
        count: results.length,
        results
      });
    }

    // =========================================================
    // ASK AI ASSISTANT
    // =========================================================
    if (
      request.method === "GET" &&
      url.pathname === "/api/ask"
    ) {
      const question =
        (
          url.searchParams.get("question") ||
          ""
        ).trim();

      if (!question) {
        return Response.json(
          {
            error: "A question is required.",
            example:
              "/api/ask?question=How do I reset my password?"
          },
          {
            status: 400
          }
        );
      }

      const questionWords = question
        .toLowerCase()
        .replace(/[^\\w\\s-]/g, "")
        .split(/\\s+/)
        .filter(function (word) {
          return word.length > 2;
        });

      const list =
        await env.INTERNAL_IT_KNOWLEDGE.list();

      const matches = [];

      for (const item of list.keys) {
        const rawArticle =
          await env.INTERNAL_IT_KNOWLEDGE.get(
            item.name
          );

        if (!rawArticle) {
          continue;
        }

        try {
          const article =
            JSON.parse(rawArticle);

          const searchableText = [
            article.key,
            article.title,
            article.category,
            ...(article.keywords || []),
            article.content
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          const score =
            questionWords.reduce(
              function (total, word) {
                return searchableText.includes(
                  word
                )
                  ? total + 1
                  : total;
              },
              0
            );

          if (score > 0) {
            matches.push({
              score,
              article
            });
          }
        } catch (error) {
          console.error(
            "Invalid article:",
            item.name,
            error
          );
        }
      }

      matches.sort(function (a, b) {
        return b.score - a.score;
      });

      if (matches.length === 0) {
        return Response.json({
          question,
          answer:
            "I could not find a relevant article in the internal knowledge base.",
          source: null,
          generatedBy: "Knowledge base"
        });
      }

      const bestMatch =
        matches[0].article;

      try {
        const aiResponse =
          await env.AI.run(
            "@cf/meta/llama-3.2-3b-instruct",
            {
              messages: [
                {
                  role: "system",
                  content:
                    "You are an internal IT support assistant. Answer only from the provided knowledge article. Keep the answer clear, brief, and helpful. Do not invent steps, links, contacts, or policies. If the article does not contain the answer, say that the information is not available."
                },
                {
                  role: "user",
                  content:
                    "Employee question:\\n" +
                    question +
                    "\\n\\n" +
                    "Knowledge article:\\n" +
                    "Title: " +
                    bestMatch.title +
                    "\\n" +
                    "Category: " +
                    bestMatch.category +
                    "\\n" +
                    "Content: " +
                    bestMatch.content
                }
              ],
              max_tokens: 300,
              temperature: 0.2
            }
          );

        return Response.json({
          question,
          answer:
            aiResponse.response ||
            bestMatch.content,
          source: {
            key: bestMatch.key,
            title: bestMatch.title,
            category: bestMatch.category
          },
          generatedBy:
            "Cloudflare Workers AI"
        });
      } catch (error) {
        console.error(
          "Workers AI error:",
          error
        );

        return Response.json({
          question,
          answer: bestMatch.content,
          source: {
            key: bestMatch.key,
            title: bestMatch.title,
            category: bestMatch.category
          },
          generatedBy:
            "Knowledge base fallback"
        });
      }
    }

    // =========================================================
    // UNKNOWN ROUTE
    // =========================================================
    return Response.json(
      {
        error: "Route not found."
      },
      {
        status: 404
      }
    );
  }
};