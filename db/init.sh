#!/usr/bin/env bash
# =============================================================================
# Global Mobilis — Database Initialization Script
# Usage: ./db/init.sh
# Requires DATABASE_URL environment variable to be set.
# Falls back to Node.js init if psql is not available.
# =============================================================================
set -euo pipefail
cd "$(dirname "$0")"

if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL is not set." >&2
  echo "Connect a Neon database via the database card above, then re-run." >&2
  exit 1
fi

if command -v psql &>/dev/null; then
  echo "→ Applying schema..."
  psql "$DATABASE_URL" -f schema.sql
  echo "→ Seeding data..."
  psql "$DATABASE_URL" -f seed.sql
else
  echo "→ psql not found, using Node.js init..."
  cd ..
  bun run db/init.ts
fi

echo "✓ Database initialized successfully!"
echo "   Tables: users, waitlist, destinations, communities, community_members,"
echo "   messages, events, event_attendees, destination_reviews, mentorship_connections"
echo "   Destinations seeded: 18 cities across 14 countries"
echo ""
echo "   Next steps:"
echo "   1. Run 'bun run publish' to restart the server with DB access"
echo "   2. Update Waitlist.ts to use the database instead of file storage"