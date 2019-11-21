#!/usr/bin/env bash
set -e
echo "Connecting to postgres host and waiting for postgres to start..."

while ! nc -z database 5432; do
  sleep 0.1
done

echo "PostgreSQL started"
python manage.py makemigrations
python manage.py migrate
python manage.py runserver