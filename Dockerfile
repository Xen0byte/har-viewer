ARG BUSYBOX_VERSION=1.35.0
ARG NODE_VERSION=16.14.0
ARG ALPINE_VERSION=3.15

## STAGE I - Build builder image
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS build
WORKDIR /src

# copy source
COPY . .

# install dependencies
RUN yarn

# build static web
ENV NODE_ENV production
RUN yarn build

## STAGE II - Build production image
FROM busybox:${BUSYBOX_VERSION}-uclibc

ARG BUILD_DATE

# set opencontainers labels
# https://github.com/opencontainers/image-spec/blob/main/annotations.md#pre-defined-annotation-keys
LABEL org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.authors="erik.bender@develerik.dev" \
      org.opencontainers.image.source="https://github.com/develerik/har-viewer" \
      org.opencontainers.image.version="0.6.0" \
      org.opencontainers.image.vendor="Erik Bender" \
      org.opencontainers.image.licenses="ISC" \
      org.opencontainers.image.title="HTTP Archive Viewer" \
      org.opencontainers.image.description="Simple viewer for HTTP Archives"

# copy static web
COPY --from=build /src/dist /var/www/

# don't run as root
RUN addgroup -S har && adduser -SDHG har har
USER har

# default expose port
EXPOSE 8080

ENTRYPOINT ["httpd", "-p", "8080", "-f", "-h", "/var/www/"]
