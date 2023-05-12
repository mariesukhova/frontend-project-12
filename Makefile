lint-frontend:
	make -C frontend lint

install:
	npm ci

start-frontend:
	npm -C frontend start

start-backend:
	npx start-server

deploy:
	git push heroku main

start:
	npx start-server & npm -C frontend start