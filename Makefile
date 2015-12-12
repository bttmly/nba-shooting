build-client:
	./node_modules/babel-cli/bin/babel.js client/src --out-dir client/lib
	./node_modules/.bin/browserify client/lib/index.js > client/bundle.js