type CodeLanguage = "text" | "json" | "python" | "javascript" | "typescript" | "csharp" | "bash"

function inferLanguage(code: string): CodeLanguage {
  const trimmed = code.trim()
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) return "json"
  if (/\busing\s+System\b|\bConsole\.WriteLine\b|\bMqttClientOptionsBuilder\b/.test(code)) return "csharp"
  if (/\bimport\s+\w+\s+from\b|\bconst\b|\blet\b|\bconsole\./.test(code)) return "javascript"
  if (/\bfrom\s+\w+\s+import\b|\bdef\b|\bdatetime\b|\bprint\(/.test(code)) return "python"
  if (/^(curl|npm|pnpm|yarn|pip|dotnet)\b/m.test(code)) return "bash"
  return "text"
}

function getKeywords(language: CodeLanguage): string[] {
  switch (language) {
    case "json":
      return ["true", "false", "null"]
    case "python":
      return [
        "and",
        "as",
        "def",
        "finally",
        "for",
        "from",
        "if",
        "import",
        "in",
        "return",
        "try",
        "while",
      ]
    case "javascript":
    case "typescript":
      return [
        "const",
        "else",
        "export",
        "false",
        "from",
        "if",
        "import",
        "let",
        "new",
        "null",
        "return",
        "true",
      ]
    case "csharp":
      return [
        "await",
        "false",
        "new",
        "null",
        "public",
        "return",
        "static",
        "true",
        "using",
        "var",
      ]
    case "bash":
      return ["if", "then", "fi"]
    default:
      return []
  }
}

function isCommentStart(language: CodeLanguage, line: string, index: number): boolean {
  if ((language === "javascript" || language === "typescript" || language === "csharp") && line.slice(index, index + 2) === "//") {
    return true
  }
  return (language === "python" || language === "bash") && line[index] === "#"
}

function getTokenClass(type: "plain" | "comment" | "string" | "number" | "keyword" | "key"): string {
  switch (type) {
    case "comment":
      return "text-zinc-500 italic"
    case "string":
      return "text-emerald-300"
    case "number":
      return "text-amber-300"
    case "keyword":
      return "text-fuchsia-300"
    case "key":
      return "text-sky-300"
    default:
      return "text-zinc-100"
  }
}

function highlightJsonLine(line: string): Array<{ text: string; type: "plain" | "string" | "number" | "keyword" | "key" }> {
  const tokens: Array<{ text: string; type: "plain" | "string" | "number" | "keyword" | "key" }> = []
  const keyMatch = line.match(/^(\s*)"([^"\\]*(?:\\.[^"\\]*)*)"\s*:/)

  if (keyMatch) {
    const prefix = keyMatch[1] ?? ""
    const fullKey = `"${keyMatch[2]}"`
    const colonIndex = line.indexOf(":", prefix.length + fullKey.length)
    tokens.push({ text: prefix, type: "plain" })
    tokens.push({ text: fullKey, type: "key" })
    tokens.push({ text: line.slice(prefix.length + fullKey.length, colonIndex + 1), type: "plain" })
    line = line.slice(colonIndex + 1)
  }

  let i = 0
  while (i < line.length) {
    const rest = line.slice(i)
    const quote = rest[0]
    if (quote === '"' || quote === "'") {
      let j = 1
      while (j < rest.length) {
        if (rest[j] === quote && rest[j - 1] !== "\\") break
        j += 1
      }
      tokens.push({ text: rest.slice(0, Math.min(j + 1, rest.length)), type: "string" })
      i += Math.min(j + 1, rest.length)
      continue
    }

    const numberMatch = rest.match(/^-?\d+(?:\.\d+)?/)
    if (numberMatch) {
      tokens.push({ text: numberMatch[0], type: "number" })
      i += numberMatch[0].length
      continue
    }

    const keywordMatch = rest.match(/^(true|false|null)\b/)
    if (keywordMatch) {
      tokens.push({ text: keywordMatch[0], type: "keyword" })
      i += keywordMatch[0].length
      continue
    }

    tokens.push({ text: rest[0], type: "plain" })
    i += 1
  }

  return tokens
}

function highlightCodeLine(line: string, language: CodeLanguage) {
  if (language === "json") return highlightJsonLine(line)

  const keywords = new Set(getKeywords(language))
  const tokens: Array<{ text: string; type: "plain" | "comment" | "string" | "number" | "keyword" | "key" }> = []
  let i = 0

  while (i < line.length) {
    if (isCommentStart(language, line, i)) {
      tokens.push({ text: line.slice(i), type: "comment" })
      break
    }

    const current = line[i]
    if (current === '"' || current === "'" || current === "`") {
      let j = i + 1
      while (j < line.length) {
        if (line[j] === current && line[j - 1] !== "\\") break
        j += 1
      }
      tokens.push({ text: line.slice(i, Math.min(j + 1, line.length)), type: "string" })
      i = Math.min(j + 1, line.length)
      continue
    }

    const rest = line.slice(i)
    const numberMatch = rest.match(/^-?\d+(?:_\d+)*(?:\.\d+)?/)
    if (numberMatch) {
      tokens.push({ text: numberMatch[0], type: "number" })
      i += numberMatch[0].length
      continue
    }

    const wordMatch = rest.match(/^[A-Za-z_][A-Za-z0-9_]*/)
    if (wordMatch) {
      const word = wordMatch[0]
      tokens.push({ text: word, type: keywords.has(word) ? "keyword" : "plain" })
      i += word.length
      continue
    }

    tokens.push({ text: current, type: "plain" })
    i += 1
  }

  return tokens
}

export function CodeBlock({
  children,
  language,
}: {
  children: string
  language?: CodeLanguage
}) {
  const resolvedLanguage = language ?? inferLanguage(children)
  const lines = children.trimEnd().split("\n")

  return (
    <pre className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-xs whitespace-pre-wrap shadow-sm">
      <code>
        {lines.map((line, lineIndex) => (
          <span key={lineIndex} className="block">
            {highlightCodeLine(line, resolvedLanguage).map((token, tokenIndex) => (
              <span key={`${lineIndex}-${tokenIndex}`} className={getTokenClass(token.type)}>
                {token.text}
              </span>
            ))}
            {lineIndex < lines.length - 1 ? "\n" : null}
          </span>
        ))}
      </code>
    </pre>
  )
}
