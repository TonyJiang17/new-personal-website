// lib/terminal/parser.ts
// Pure lexer/parser for terminal input. No side effects, fully testable.

export interface ParsedInput {
  /** Normalized command (lowercase). Empty string if no command. */
  command: string;
  /** Positional arguments after the command. */
  args: string[];
  /** Flags: { "--flag": true } or { "-f": true }. */
  flags: Record<string, true>;
  /** True when input was empty or whitespace-only. */
  isEmpty: boolean;
  /** The original raw input string before any normalization. */
  raw: string;
  /**
   * True when the input started with '/'.
   * Only slash-prefixed input is treated as a command invocation.
   * Non-slash input is NOT a command (chat / plain text).
   */
  isSlashCommand: boolean;
}

/**
 * Parse and normalize raw terminal input.
 *
 * Grammar (simplified EBNF):
 *   input   := ws? '/'? command (ws+ token)* ws?
 *   command := word
 *   token   := quoted | flag | word
 *   flag    := '--' word | '-' [a-zA-Z]+
 *   quoted  := '"' ... '"' | "'" ... "'"
 *   word    := [a-zA-Z0-9_-]+
 *   ws      := [ \t]+
 *
 * Normalization rules:
 *   - Leading '/' marks the input as a slash command (isSlashCommand: true) and is stripped before parsing.
 *   - Input without a leading '/' is parsed for content but isSlashCommand is false (not a command).
 *   - Command and flags are lowercased.
 *   - Leading/trailing whitespace trimmed.
 *   - Multiple internal whitespace runs collapsed.
 *   - Quoted argument case is preserved.
 *   - Empty/whitespace-only input → isEmpty: true, command: "".
 */
export function parseInput(raw: string): ParsedInput {
  const trimmed = raw.trim();

  if (!trimmed) {
    return { command: "", args: [], flags: {}, isEmpty: true, isSlashCommand: false, raw };
  }

  const isSlashCommand = trimmed.startsWith("/");
  // Strip the leading '/' so the rest parses as a normal command token stream.
  const toParse = isSlashCommand ? trimmed.slice(1) : trimmed;

  const tokens = tokenize(toParse);

  if (tokens.length === 0) {
    // Input was just "/" — treat as empty
    return { command: "", args: [], flags: {}, isEmpty: true, isSlashCommand, raw };
  }

  const command = tokens[0].toLowerCase();
  const args: string[] = [];
  const flags: Record<string, true> = {};

  for (let i = 1; i < tokens.length; i++) {
    const tok = tokens[i];
    if (tok.startsWith("--")) {
      flags[tok.toLowerCase()] = true;
    } else if (tok.startsWith("-") && tok.length > 1 && !tok.startsWith("--")) {
      // Short flags: -abc expands to -a, -b, -c
      for (const ch of tok.slice(1)) {
        flags[`-${ch}`] = true;
      }
    } else {
      // Positional arg — preserve case (quoted strings may be case-sensitive)
      args.push(tok);
    }
  }

  return { command, args, flags, isEmpty: false, isSlashCommand, raw };
}

/**
 * Tokenize a non-empty, already-trimmed input string.
 * Handles single/double quoted strings and standard whitespace delimiters.
 */
function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let i = 0;

  while (i < input.length) {
    // Skip whitespace
    if (input[i] === " " || input[i] === "\t") {
      i++;
      continue;
    }

    // Quoted string
    if (input[i] === '"' || input[i] === "'") {
      const quote = input[i];
      i++;
      let value = "";
      while (i < input.length && input[i] !== quote) {
        if (input[i] === "\\" && i + 1 < input.length) {
          // Escape sequence: consume backslash and next char literally
          i++;
          value += input[i];
        } else {
          value += input[i];
        }
        i++;
      }
      // Consume closing quote (if present — be lenient with unclosed quotes)
      if (i < input.length) i++;
      tokens.push(value);
      continue;
    }

    // Unquoted token
    let value = "";
    while (i < input.length && input[i] !== " " && input[i] !== "\t") {
      value += input[i];
      i++;
    }
    tokens.push(value);
  }

  return tokens;
}
