#!/bin/bash

export PGHOST=ep-spring-dream-58410209.eu-central-1.aws.neon.tech
export PGPORT=5432
export PGUSER=default
export PGPASSWORD=w9UuYScFEy3M
export PGDATABASE=verceldb
export PGSSLMODE=require

# Сделать дамп базы данных
pg_dump > backup.sql

echo "Backup completed successfully."
