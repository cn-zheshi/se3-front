CUR_TIME     := $(shell date +"%Y-%m-%d_%H.%M.%S")
DOCKER_FILE  := scripts/Dockerfile
NODE_VERSION := 12
PROJ_NAME    := lmcc-frontend

.PHONY: all clean build deploy

all: clean build deploy

# clean docker container
clean:
	@echo "== Clean =="
ifneq ($(shell docker ps | grep $(PROJ_NAME)),)
	docker stop $(PROJ_NAME)
endif
ifneq ($(shell docker ps -a | grep $(PROJ_NAME)),)
	docker rm $(PROJ_NAME)
endif
ifeq ($(shell docker images | grep $(PROJ_NAME) | wc -l),10)
	docker rmi -f `docker images | grep $(PROJ_NAME) | awk '{print $$3}'`
endif

build:
	@echo "== Build =="
	npm install
	npm run build

deploy:
	@echo "== Deploy =="
	docker build -f $(DOCKER_FILE) -t se3/$(PROJ_NAME):$(CUR_TIME) .
	docker run -d -p 127.0.0.1:8083:80 --name $(PROJ_NAME) se3/$(PROJ_NAME):$(CUR_TIME)
