DC=docker compose --file docker-compose.dev.yml --env-file .env

up:
	docker network create integra_network || true
	$(DC) up -d

build:
	docker network create integra_network || true
	$(DC) up -d --build

down:
	$(DC) down