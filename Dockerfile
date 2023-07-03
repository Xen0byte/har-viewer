## STAGE I - Build builder image
FROM public.ecr.aws/docker/library/node:18.16.1-alpine3.18 AS build
WORKDIR /src

# copy source
COPY .. .

# install dependencies
RUN corepack enable && corepack prepare pnpm@8.6.5 --activate \
 && pnpm fetch && pnpm install -r --offline

# build static web
ENV NODE_ENV production
RUN pnpm build

## STAGE II - Webserver base
FROM alpine:3.18 AS builder

# install all dependencies required for compiling busybox
RUN apk --no-cache add \
    gcc=12.2.1_git20220924-r10 \
    musl-dev=1.2.4-r0 \
    make=4.4.1-r1 \
    perl=5.36.1-r2

# download busybox sources
RUN wget https://busybox.net/downloads/busybox-1.36.1.tar.bz2 \
  && tar xf busybox-1.36.1.tar.bz2 \
  && mv /busybox-1.36.1 /busybox

WORKDIR /busybox

# copy the busybox build config (limited to httpd)
COPY busybox/httpd.config ./.config

# compile and install busybox
RUN make && make install

# create a non-root user to own the files and run our server
RUN adduser -D static

## STAGE III - Build production image
FROM scratch

ARG BUILD_DATE
ARG GIT_SHA
ARG VERSION

# set opencontainers labels
# https://github.com/opencontainers/image-spec/blob/main/annotations.md#pre-defined-annotation-keys
LABEL org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.authors="erik.bender@develerik.dev" \
      org.opencontainers.image.url="https://github.com/develerik/har-viewer/pkgs/container/har-viewer" \
      org.opencontainers.image.source="https://github.com/develerik/har-viewer" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.revision="${GIT_SHA}" \
      org.opencontainers.image.vendor="Erik Bender" \
      org.opencontainers.image.licenses="ISC" \
      org.opencontainers.image.title="HTTP Archive Viewer" \
      org.opencontainers.image.description="Simple viewer for HTTP Archives"

# copy over the user
COPY --from=builder /etc/passwd /etc/passwd

# copy the busybox static binary
COPY --from=builder /busybox/_install/bin/busybox /

# use the non-root user
USER static

WORKDIR /home/static

# copy the static web
COPY --from=build /src/dist .

# default expose port
EXPOSE 8080

ENTRYPOINT ["/busybox", "httpd", "-f"]
