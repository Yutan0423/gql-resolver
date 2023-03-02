dev:
	@docker-compose up -d
	@yarn dev

init:
	$(MAKE) install
	$(MAKE) migrate

install:
	@yarn

migrate:
	@npx prisma migrate dev --name init

studio:
	@npx prisma studio

down:
	@docker-compose down

lint:
	@yarn lint

check:
	@yarn typecheck

test:
	@yarn test