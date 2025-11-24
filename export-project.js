import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join, extname } from "path";

// Diretórios que nunca devem ser lidos
const IGNORE_DIRS = ["node_modules", ".git", ".next"];

// Arquivos que devem ser ignorados totalmente
const IGNORE_FILES = ["package-lock.json", ".env"];

// Extensões de arquivos binários ou irrelevantes
const BINARY_EXT = [
  ".ico", ".png", ".jpg", ".jpeg", ".gif",
  ".webp", ".bmp", ".txt"
];

// Extensões que devem aparecer na lista,
// mas cujo conteúdo NÃO deve ser exportado
const LIST_ONLY_EXT = [".svg"];

// Função para percorrer tudo
function walk(currentPath) {
  const items = readdirSync(currentPath, { withFileTypes: true });
  let results = [];

  for (const item of items) {
    const fullPath = join(currentPath, item.name);

    // Ignorar pastas inteiras
    if (item.isDirectory() && IGNORE_DIRS.includes(item.name)) {
      continue;
    }

    if (item.isDirectory()) {
      results.push({ type: "dir", path: fullPath });
      results = results.concat(walk(fullPath));
    } else {
      // Ignorar arquivos explícitos
      if (IGNORE_FILES.includes(item.name)) {
        continue;
      }

      const ext = extname(item.name).toLowerCase();

      // Ignorar completamente arquivos binários irrelevantes
      if (BINARY_EXT.includes(ext)) {
        continue;
      }

      // SVGs devem aparecer mas sem conteúdo
      if (LIST_ONLY_EXT.includes(ext)) {
        results.push({ type: "svg", path: fullPath });
        continue;
      }

      // Arquivo normal de texto
      results.push({ type: "file", path: fullPath });
    }
  }

  return results;
}

const entries = walk(".");

// Construindo o output final
let output = "===== PROJECT STRUCTURE =====\n\n";

entries.forEach((item) => {
  output += item.path + "\n";
});

output += "\n\n===== FILE CONTENTS =====\n\n";

entries.forEach((item) => {
  if (item.type === "file") {
    output += `\n===== ${item.path} =====\n`;
    output += readFileSync(item.path, "utf8");
    output += "\n";
  }

  if (item.type === "svg") {
    output += `\n===== ${item.path} (conteúdo ignorado — arquivo SVG) =====\n\n`;
  }
});

writeFileSync("projeto_completo.txt", output);
