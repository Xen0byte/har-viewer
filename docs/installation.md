# Installation

## GitHub Releases

1. Download the latests `har-viewer.zip` from the [GitHub Releases](https://github.com/develerik/har-viewer/releases) page
2. Extract the contents to your webserver

## Docker

```shell
docker pull ghcr.io/develerik/har-viewer
docker run -p 8080:8080 ghcr.io/develerik/har-viewer
```

## Docker From Source

```shell
# clone source code
git clone github.com/develerik/har-viewer.git
cd har-viewer

# build docker image
docker build -t har-viewer --build-arg BUILD_DATE="$(date)" .

# run docker image
docker run -p 8080:8080 har-viewer
```

## From Source

```shell
# clone source code
git clone github.com/develerik/har-viewer.git
cd har-viewer

# install dependencies and build web
yarn
yarn build
```

Now copy the contents of the newly created `dist` folder to your web server.
