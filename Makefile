dev:
	@docker-compose up -d
	@yarn dev

install:
	@yarn

studio:
	@npx prisma studio

down:
	@docker-compose down