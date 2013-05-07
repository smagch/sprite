
dev: build/build.js

build/build.js: index.js
	@component build --dev
	@echo 'dev build done'