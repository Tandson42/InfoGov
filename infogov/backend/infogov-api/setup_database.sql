-- Script para criar usuário e banco de dados PostgreSQL
-- Execute como usuário postgres: psql -U postgres -f setup_database.sql

-- Criar usuário (se não existir)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'infogov') THEN
        CREATE USER infogov WITH PASSWORD '123456';
    END IF;
END
$$;

-- Criar banco de dados (se não existir)
SELECT 'CREATE DATABASE infogov OWNER infogov'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'infogov')\gexec

-- Dar permissões ao usuário
GRANT ALL PRIVILEGES ON DATABASE infogov TO infogov;
