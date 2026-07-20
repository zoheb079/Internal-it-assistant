const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const projectRoot = path.resolve(__dirname, "..");
const knowledgeFile = path.join(projectRoot, "data", "knowledge.json");
const generatedBulkFile = path.join(
  projectRoot,
  "data",
  "knowledge.bulk.json"
);

const REQUIRED_FIELDS = [
  "key",
  "title",
  "category",
  "keywords",
  "content"
];

function fail(message) {
  console.error(`\nSeed failed: ${message}\n`);
  process.exit(1);
}

function readKnowledgeFile() {
  if (!fs.existsSync(knowledgeFile)) {
    fail(`Knowledge file not found: ${knowledgeFile}`);
  }

  let rawContent;

  try {
    rawContent = fs.readFileSync(knowledgeFile, "utf8");
  } catch (error) {
    fail(`Unable to read knowledge file: ${error.message}`);
  }

  try {
    return JSON.parse(rawContent);
  } catch (error) {
    fail(`knowledge.json contains invalid JSON: ${error.message}`);
  }
}

function validateArticles(articles) {
  if (!Array.isArray(articles)) {
    fail("knowledge.json must contain a JSON array.");
  }

  if (articles.length === 0) {
    fail("knowledge.json does not contain any articles.");
  }

  const seenKeys = new Set();

  articles.forEach((article, index) => {
    const articleNumber = index + 1;

    if (
      article === null ||
      typeof article !== "object" ||
      Array.isArray(article)
    ) {
      fail(`Article ${articleNumber} must be a JSON object.`);
    }

    for (const field of REQUIRED_FIELDS) {
      if (!(field in article)) {
        fail(`Article ${articleNumber} is missing "${field}".`);
      }
    }

    if (
      typeof article.key !== "string" ||
      article.key.trim().length === 0
    ) {
      fail(`Article ${articleNumber} has an invalid key.`);
    }

    const normalizedKey = article.key.trim();

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedKey)) {
      fail(
        `Article key "${normalizedKey}" must use lowercase letters, numbers, and hyphens only.`
      );
    }

    if (seenKeys.has(normalizedKey)) {
      fail(`Duplicate article key detected: "${normalizedKey}".`);
    }

    seenKeys.add(normalizedKey);

    if (
      typeof article.title !== "string" ||
      article.title.trim().length === 0
    ) {
      fail(`Article "${normalizedKey}" has an invalid title.`);
    }

    if (
      typeof article.category !== "string" ||
      article.category.trim().length === 0
    ) {
      fail(`Article "${normalizedKey}" has an invalid category.`);
    }

    if (
      !Array.isArray(article.keywords) ||
      article.keywords.length === 0 ||
      article.keywords.some(
        (keyword) =>
          typeof keyword !== "string" ||
          keyword.trim().length === 0
      )
    ) {
      fail(
        `Article "${normalizedKey}" must have at least one valid keyword.`
      );
    }

    if (
      typeof article.content !== "string" ||
      article.content.trim().length === 0
    ) {
      fail(`Article "${normalizedKey}" has invalid content.`);
    }
  });

  return articles;
}

function createBulkPayload(articles) {
  return articles.map((article) => {
    const normalizedArticle = {
      key: article.key.trim(),
      title: article.title.trim(),
      category: article.category.trim(),
      keywords: article.keywords.map((keyword) => keyword.trim()),
      content: article.content.trim(),
      updatedAt: new Date().toISOString()
    };

    return {
      key: normalizedArticle.key,
      value: JSON.stringify(normalizedArticle)
    };
  });
}

function writeBulkFile(payload) {
  try {
    fs.writeFileSync(
      generatedBulkFile,
      JSON.stringify(payload, null, 2),
      "utf8"
    );
  } catch (error) {
    fail(`Unable to create bulk file: ${error.message}`);
  }
}

function uploadToCloudflare() {
  console.log("\nUploading articles to remote Cloudflare KV...\n");

  const command = process.platform === "win32" ? "npx.cmd" : "npx";

  const result = spawnSync(
    command,
    [
      "wrangler",
      "kv",
      "bulk",
      "put",
      generatedBulkFile,
      "--binding=INTERNAL_IT_KNOWLEDGE",
      "--remote"
    ],
    {
      cwd: projectRoot,
      stdio: "inherit",
      shell: process.platform === "win32"
    }
  );

  if (result.error) {
    fail(`Unable to start Wrangler: ${result.error.message}`);
  }

  if (result.status !== 0) {
    fail(`Wrangler exited with code ${result.status}.`);
  }
}

function main() {
  console.log("\nStarting KV seed process...");
  console.log(`Source file: ${knowledgeFile}`);

  const articles = readKnowledgeFile();
  const validatedArticles = validateArticles(articles);
  const bulkPayload = createBulkPayload(validatedArticles);

  writeBulkFile(bulkPayload);

  console.log(
    `Validated ${validatedArticles.length} knowledge articles.`
  );
  console.log(`Generated bulk file: ${generatedBulkFile}`);

  uploadToCloudflare();

  console.log(
    `\nSeed completed successfully. Uploaded ${validatedArticles.length} articles.\n`
  );
}

main();