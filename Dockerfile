# Build stage
FROM denoland/deno:alpine as builder
WORKDIR /app
COPY . .
RUN deno cache main.ts

# Production stage
FROM denoland/deno:alpine
WORKDIR /app
COPY --from=builder /app .

# Database Connection Settings
ENV DATABASE_URL=

# Valkey Connection Settings
ENV VALKEY_HOST=
ENV VALKEY_PORT=
ENV VALKEY_TLS_KEY=
ENV VALKEY_TLS_CERTIFICATE=
ENV VALKEY_CA_CERTIFICATE=
ENV VALKEY_PASSWORD=

# JWKS URL for Authentication Service
ENV AUTHENTICATION_JWKS=

# CORS Origin URL
ENV CORS_ORIGIN_WHITELIST=

# Switch to deno user
USER deno

# Operational Port
EXPOSE 9080

ENTRYPOINT ["deno"]
