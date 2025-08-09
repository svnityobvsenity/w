.PHONY: help install dev build test lint format clean db-up db-down seed

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install all dependencies
	npm install

dev: ## Start development servers
	npm run dev

dev-web: ## Start only the web app
	npm run dev:web

dev-signaling: ## Start only the signaling server
	npm run dev:signaling

build: ## Build all packages
	npm run build

test: ## Run tests
	npm run test

lint: ## Run linting
	npm run lint

lint-fix: ## Fix linting issues
	npm run lint:fix

format: ## Format code with Prettier
	npm run format

clean: ## Clean all build artifacts and node_modules
	npm run clean

db-up: ## Start database services
	docker-compose up -d postgres redis

db-down: ## Stop database services
	docker-compose down

db-reset: ## Reset database (stop, remove volumes, start)
	docker-compose down -v
	docker-compose up -d postgres redis
	sleep 5
	npm run seed

seed: ## Seed the database
	npm run seed

deploy: ## Deploy to production
	npm run build
	./deploy.sh
