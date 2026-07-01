#!/usr/bin/env bash
set -euo pipefail

USER_NAME="${1:-admin}"
PASSWORD="${2:-streckentool2026!}"
AUTH_FILE="${3:-/etc/nginx/streckentool-admin.htpasswd}"

if ! command -v openssl >/dev/null 2>&1; then
  echo "openssl is required." >&2
  exit 1
fi

HASH="$(openssl passwd -apr1 "$PASSWORD")"

sudo install -d -m 755 "$(dirname "$AUTH_FILE")"
printf '%s:%s\n' "$USER_NAME" "$HASH" | sudo tee "$AUTH_FILE" >/dev/null

if getent group www-data >/dev/null; then
  sudo chown root:www-data "$AUTH_FILE"
  sudo chmod 640 "$AUTH_FILE"
else
  sudo chown root:root "$AUTH_FILE"
  sudo chmod 644 "$AUTH_FILE"
fi

echo "Updated admin password for $USER_NAME in $AUTH_FILE"
