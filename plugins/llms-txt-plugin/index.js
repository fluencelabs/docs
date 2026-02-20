const fs = require('fs-extra');
const path = require('path');

/**
 * Docusaurus plugin to generate llms.txt index files.
 *
 * Reads sidebars.js for structure, extracts titles from doc source files,
 * and writes llms.txt files that point to the .md files produced by
 * markdown-source-plugin.
 */

const SPECIAL_FILES = ['llms_txt_override.md', 'llms_txt_include_head.md'];

function isSpecialFile(filename) {
  return SPECIAL_FILES.includes(path.basename(filename));
}

// "connect_servers" → "Connect Servers"
function formatSectionName(key) {
  return key
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// Extract title and description from a doc source file.
// Looks for YAML front matter first, then falls back to first # heading.
function extractMeta(filePath) {
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch {
    return { title: null, description: null };
  }

  let title = null;
  let description = null;

  // Try YAML front matter
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (fmMatch) {
    const yaml = fmMatch[1];
    const titleMatch = yaml.match(/^title:\s*["']?(.+?)["']?\s*$/m);
    if (titleMatch) title = titleMatch[1];
    const descMatch = yaml.match(/^description:\s*["']?(.+?)["']?\s*$/m);
    if (descMatch) description = descMatch[1];
  }

  // Fallback: first # heading
  if (!title) {
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) title = h1Match[1];
  }

  return { title, description };
}

// Read a special file's content, or return null if it doesn't exist.
function readSpecialFile(docsDir, sectionKey, filename) {
  const dir = sectionKey ? path.join(docsDir, sectionKey) : docsDir;
  const filePath = path.join(dir, filename);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf8').trim();
  }
  return null;
}

// Build lines for a list of sidebar item IDs (strings) and categories.
function buildItemLines(items, baseUrl, docsDir) {
  const lines = [];

  for (const item of items) {
    if (typeof item === 'string') {
      if (isSpecialFile(item + '.md') || isSpecialFile(path.basename(item) + '.md')) {
        continue;
      }
      const filePath = path.join(docsDir, item + '.md');
      // Handle docs that might use .mdx
      const actualPath = fs.existsSync(filePath) ? filePath : filePath.replace('.md', '.mdx');
      const { title, description } = extractMeta(actualPath);
      const displayTitle = title || path.basename(item);
      const url = `${baseUrl}/docs/${item}.md`;
      if (description) {
        lines.push(`- [${displayTitle}](${url}): ${description}`);
      } else {
        lines.push(`- [${displayTitle}](${url})`);
      }
    } else if (item.type === 'category') {
      lines.push('');
      lines.push(`### ${item.label}`);
      lines.push(...buildItemLines(item.items || [], baseUrl, docsDir));
    }
  }

  return lines;
}

// Generate llms.txt content for a single section.
function generateSectionLlmsTxt(sectionKey, sidebarItems, baseUrl, docsDir) {
  const override = readSpecialFile(docsDir, sectionKey, 'llms_txt_override.md');
  const includeHead = readSpecialFile(docsDir, sectionKey, 'llms_txt_include_head.md');

  if (override && includeHead) {
    console.log(
      `[llms-txt-plugin] Warning: ${sectionKey}/ has both llms_txt_override.md and llms_txt_include_head.md — using override only`
    );
  }

  if (override) {
    return override + '\n';
  }

  const lines = [];

  if (includeHead) {
    lines.push(includeHead);
    lines.push('');
  } else {
    lines.push(`# ${formatSectionName(sectionKey)}`);
    lines.push('');
  }

  lines.push('## Docs');
  lines.push(...buildItemLines(sidebarItems, baseUrl, docsDir));
  lines.push('');

  return lines.join('\n');
}

// Generate the root llms.txt content.
function generateRootLlmsTxt(sectionKeys, baseUrl, docsDir) {
  const override = readSpecialFile(docsDir, null, 'llms_txt_override.md');
  const includeHead = readSpecialFile(docsDir, null, 'llms_txt_include_head.md');

  if (override && includeHead) {
    console.log(
      '[llms-txt-plugin] Warning: docs/ has both llms_txt_override.md and llms_txt_include_head.md — using override only'
    );
  }

  if (override) {
    return override + '\n';
  }

  const lines = [];

  if (includeHead) {
    lines.push(includeHead);
    lines.push('');
  } else {
    lines.push('# Fluence Docs');
    lines.push('');
  }

  lines.push('## Sections');
  for (const key of sectionKeys) {
    lines.push(`- [${formatSectionName(key)}](${baseUrl}/docs/${key}/llms.txt)`);
  }
  lines.push('');

  return lines.join('\n');
}

module.exports = function llmsTxtPlugin(context) {
  return {
    name: 'llms-txt-plugin',

    async postBuild({ outDir }) {
      const siteUrl = context.siteConfig.url; // https://fluence.dev
      const docsDir = path.join(context.siteDir, 'docs');
      const sidebars = require(path.join(context.siteDir, 'sidebars.js'));

      console.log('[llms-txt-plugin] Generating llms.txt files...');

      const sectionKeys = Object.keys(sidebars);

      // Generate per-section llms.txt files
      for (const key of sectionKeys) {
        const content = generateSectionLlmsTxt(key, sidebars[key], siteUrl, docsDir);
        const destPath = path.join(outDir, 'docs', key, 'llms.txt');
        await fs.ensureDir(path.dirname(destPath));
        await fs.writeFile(destPath, content, 'utf8');
        console.log(`  ✓ Generated: docs/${key}/llms.txt`);
      }

      // Generate root llms.txt
      const rootContent = generateRootLlmsTxt(sectionKeys, siteUrl, docsDir);
      const rootPath = path.join(outDir, 'llms.txt');
      await fs.writeFile(rootPath, rootContent, 'utf8');
      console.log('  ✓ Generated: llms.txt (root)');

      console.log(`[llms-txt-plugin] Done — ${sectionKeys.length + 1} files generated`);
    },
  };
};
