#!/usr/bin/env bash
# Verifies the agent-discovery surface: Link headers, Markdown content
# negotiation, MIME types, CORS and the well-known artifacts.
#
# Usage:
#   scripts/verify-agent-discovery.sh                        # production
#   scripts/verify-agent-discovery.sh https://localhost:8443  # local Apache
#
# npm run preview CANNOT verify any of this — Vite's preview server does not
# read .htaccess and does not negotiate. To test locally, serve dist/ with a
# real Apache that has mod_rewrite/mod_headers/mod_mime/mod_dir and
# `AllowOverride All`. Note two things:
#   * Serve over HTTPS. The `RewriteCond %{HTTPS} !=on` rule in .htaccess turns
#     a plain-HTTP run into a redirect loop, and %{HTTPS} cannot be faked.
#   * Point DocumentRoot at a copy of dist/ outside this repository, otherwise
#     Apache also merges the repo-root .htaccess from the parent directory.

set -uo pipefail

BASE="${1:-https://fakten-stammtisch.de}"
CURL=(curl --silent --show-error --max-time 20)
case "$BASE" in
  https://localhost*|https://127.0.0.1*) CURL+=(--insecure) ;;
esac

TOPIC=""
PASS=0
FAIL=0

pass() { printf '  \033[32mok\033[0m   %s\n' "$1"; PASS=$((PASS + 1)); }
fail() { printf '  \033[31mFAIL\033[0m %s\n' "$1"; FAIL=$((FAIL + 1)); }

# check <description> <expected-substring> <actual>
check() {
  if printf '%s' "$3" | grep -qiF -- "$2"; then pass "$1"; else
    fail "$1 (expected to contain '$2', got: $(printf '%s' "$3" | head -c 160 | tr '\n' ' '))"
  fi
}

check_not() {
  if printf '%s' "$3" | grep -qiF -- "$2"; then
    fail "$1 (must NOT contain '$2')"
  else pass "$1"; fi
}

headers() { "${CURL[@]}" -D - -o /dev/null "$@" 2>/dev/null; }

section() { printf '\n\033[1m%s\033[0m\n' "$1"; }

printf 'Verifying agent discovery against %s\n' "$BASE"

# Pick a real topic id so the checks work regardless of content changes.
TOPIC=$("${CURL[@]}" "$BASE/data/topics.json" 2>/dev/null |
  tr ',' '\n' | grep -m1 '"id"' | sed 's/.*"id" *: *"\([^"]*\)".*/\1/')
if [ -z "$TOPIC" ]; then
  printf '\033[31mAborting: could not read a topic id from %s/data/topics.json\033[0m\n' "$BASE"
  exit 1
fi
printf 'Using topic: %s\n' "$TOPIC"

section '1. Link headers (RFC 8288) — the regression test for the homepage bug'
for p in "/" "/index.html" "/ueber/" "/thema/$TOPIC/" ; do
  check "Link header present on $p" 'rel="api-catalog"' "$(headers "$BASE$p" | grep -i '^link:')"
done
# The header is scoped to index.html, not *.html, so the error document stays
# clean. (Note the SPA fallback answers unknown paths with index.html and HTTP
# 200, so 404.html is only reached when requested directly — pre-existing
# behaviour of the fallback rule, unrelated to discovery.)
check_not 'no Link header on 404.html' 'rel=' "$(headers "$BASE/404.html" | grep -i '^link:')"

section '2. Markdown content negotiation'
for p in "/" "/thema/$TOPIC/" ; do
  h=$(headers -H 'Accept: text/markdown' "$BASE$p")
  check "Accept: text/markdown returns markdown on $p" 'content-type: text/markdown' "$h"
  check "charset declared on $p" 'charset=utf-8' "$h"
  check "Vary: Accept on $p" 'vary:' "$h"
  body=$("${CURL[@]}" -H 'Accept: text/markdown' "$BASE$p" | head -c 2)
  check "markdown body starts with a heading on $p" '#' "$body"
done
# Without a trailing slash mod_dir redirects first; the follow-up must negotiate.
check 'markdown after DirectorySlash redirect' 'content-type: text/markdown' \
  "$(headers -L -H 'Accept: text/markdown' "$BASE/thema/$TOPIC")"
check 'direct .md URL serves markdown' 'content-type: text/markdown' \
  "$(headers "$BASE/thema/$TOPIC/index.md")"

section '3. HTML stays the default for browsers'
check 'no Accept header -> HTML' 'content-type: text/html' "$(headers "$BASE/")"
check 'browser Accept -> HTML' 'content-type: text/html' \
  "$(headers -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' "$BASE/thema/$TOPIC/")"
check 'Accept: */* -> HTML' 'content-type: text/html' "$(headers -H 'Accept: */*' "$BASE/")"
# A route without a Markdown twin must keep serving HTML, not 404.
check 'route without twin still serves HTML' 'content-type: text/html' \
  "$(headers -H 'Accept: text/markdown' "$BASE/ueber/")"

section '4. Agent documents'
check 'auth.md is markdown, not HTML' 'content-type: text/markdown' "$(headers "$BASE/auth.md")"
check 'api/README.md is markdown' 'content-type: text/markdown' "$(headers "$BASE/api/README.md")"
check 'robots.txt carries Content-Signal' 'Content-Signal:' "$("${CURL[@]}" "$BASE/robots.txt")"
check 'Content-Signal also in the AI-crawler group' 'ai-train=' \
  "$("${CURL[@]}" "$BASE/robots.txt" | grep -A9 -i '^user-agent: GPTBot')"

section '5. API catalog and OpenAPI (RFC 9727)'
check 'api-catalog media type' 'application/linkset+json' "$(headers "$BASE/.well-known/api-catalog")"
catalog=$("${CURL[@]}" "$BASE/.well-known/api-catalog")
check 'api-catalog has a linkset array' '"linkset"' "$catalog"
check 'api-catalog advertises service-desc' '"service-desc"' "$catalog"
check 'openapi.json is JSON' 'application/json' "$(headers "$BASE/api/openapi.json")"
check 'openapi.json describes the topic endpoint' '/data/{topicId}.json' \
  "$("${CURL[@]}" "$BASE/api/openapi.json")"

section '6. CORS for browser-based agents'
for p in "/data/topics.json" "/llms.txt" "/auth.md" "/sitemap.xml" "/.well-known/api-catalog"; do
  check "CORS on $p" 'access-control-allow-origin: *' "$(headers "$BASE$p")"
done

section '7. Every advertised target resolves and is not the SPA fallback'
# This is the important one: if a file failed to upload, the SPA fallback answers
# with HTTP 200 and text/html, which looks like a working endpoint but is not.
for p in "/llms.txt" "/llms-full.txt" "/auth.md" "/.well-known/api-catalog" \
         "/api/openapi.json" "/api/README.md" "/index.md" "/thema/$TOPIC/index.md"; do
  h=$(headers "$BASE$p")
  code=$(printf '%s' "$h" | grep -m1 -oE 'HTTP/[0-9.]+ [0-9]{3}' | grep -oE '[0-9]{3}$')
  ctype=$(printf '%s' "$h" | grep -i '^content-type:' | tail -1)
  if [ "$code" != "200" ]; then
    fail "$p returned HTTP $code"
  elif printf '%s' "$ctype" | grep -qi 'text/html'; then
    fail "$p served as text/html — the SPA fallback answered, the file is missing"
  else
    pass "$p -> 200, $(printf '%s' "$ctype" | tr -d '\r' | sed 's/^[Cc]ontent-[Tt]ype: *//')"
  fi
done

section '8. MultiViews must not shadow the twins'
# With MultiViews enabled, Apache would serve index.md for /thema/x/index —
# an unintended second URL for the same resource.
code=$("${CURL[@]}" -o /dev/null -w '%{http_code} %{content_type}' "$BASE/thema/$TOPIC/index")
check_not 'extensionless /index does not resolve to markdown' 'text/markdown' "$code"

printf '\n\033[1m%d passed, %d failed\033[0m\n' "$PASS" "$FAIL"
[ "$FAIL" -eq 0 ]
