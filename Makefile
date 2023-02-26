dev:
	@docker-compose up -d
	@yarn dev

studio:
	@npx prisma studio