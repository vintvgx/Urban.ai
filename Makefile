build:
	cd client && ${MAKE} build
	cd server && ${MAKE} build

run-dev:
	docker-compose up

SSH_STRING=root@165.22.44.225

ssh:
	ssh ${SSH_STRING}

copy-files:
	scp -r . ${SSH_STRING}:/root/urban

deploy:
	ssh ${SSH_STRING} "cd /root/urban && docker-compose down && docker-compose up -d"

