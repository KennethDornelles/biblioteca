#!/bin/sh
set -e

echo "Running database migrations..."
npm run prisma:deploy

exec "$@"
