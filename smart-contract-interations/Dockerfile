# syntax=docker.io/docker/dockerfile:1

# build stage: includes resources necessary for installing dependencies

# Select the base image for building the application.
# If the application requires specific binaries, use a compatible image
# like cartesi/node:20-jammy for building.
FROM node:20.8.0-buster AS build-stage

WORKDIR /app
COPY . .
RUN yarn install && yarn build

# runtime stage: creates the final runtime image

# Select the base image for running the Cartesi Machine.
# It must be linux/riscv64 to ensure compatibility with the Cartesi environment.
FROM --platform=linux/riscv64 cartesi/node:20.8.0-jammy-slim

ARG MACHINE_EMULATOR_TOOLS_VERSION=0.14.1
ADD https://github.com/cartesi/machine-emulator-tools/releases/download/v${MACHINE_EMULATOR_TOOLS_VERSION}/machine-emulator-tools-v${MACHINE_EMULATOR_TOOLS_VERSION}.deb /
RUN dpkg -i /machine-emulator-tools-v${MACHINE_EMULATOR_TOOLS_VERSION}.deb \
  && rm /machine-emulator-tools-v${MACHINE_EMULATOR_TOOLS_VERSION}.deb

LABEL io.cartesi.rollups.sdk_version="0.6.0"
LABEL io.cartesi.rollups.ram_size="128Mi"

ARG DEBIAN_FRONTEND=noninteractive
RUN <<EOF
set -e
apt-get update
apt-get install -y --no-install-recommends \
  busybox-static=1:1.30.1-7ubuntu3
rm -rf /var/lib/apt/lists/* /var/log/* /var/cache/*
useradd --create-home --user-group appuser
EOF

ENV PATH="/app/bin:${PATH}"

WORKDIR /app
COPY --from=build-stage /app/dist .

ENV ROLLUP_HTTP_SERVER_URL="http://127.0.0.1:5004"

ENTRYPOINT ["rollup-init"]
CMD ["node", "index.js"]
