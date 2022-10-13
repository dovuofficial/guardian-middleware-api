# Install dependencies only when needed
FROM node:16.16-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:16.16-alpine AS builder

# add environment variables to client code
ARG HEDERA_NETWORK
ARG HEDERA_OPERATOR_ACCOUNT_ID
ARG HEDERA_OPERATOR_PRIVATE_KEY
ARG GUARDIAN_API_URL
ARG HMAC_SECRET_KEY
ARG ENCRYPTION_KEY
ARG API_URL
ARG HIDE_STATUS
ARG TEST_AUTH_URL
ARG STANDARD_REGISTRY_USERNAME
ARG STANDARD_REGISTRY_PASSWORD
ARG PUBLIC_TRUST_CHAIN_ACCESS

ENV HEDERA_NETWORK=$HEDERA_NETWORK
ENV HEDERA_OPERATOR_ACCOUNT_ID=$HEDERA_OPERATOR_ACCOUNT_ID
ENV HEDERA_OPERATOR_PRIVATE_KEY=$HEDERA_OPERATOR_PRIVATE_KEY
ENV GUARDIAN_API_URL=$GUARDIAN_API_URL
ENV HMAC_SECRET_KEY=$HMAC_SECRET_KEY
ENV ENCRYPTION_KEY=$ENCRYPTION_KEY
ENV API_URL=$API_URL
ENV HIDE_STATUS=$HIDE_STATUS
ENV TEST_AUTH_URL=$TEST_AUTH_URL
ENV STANDARD_REGISTRY_USERNAME=$STANDARD_REGISTRY_USERNAME
ENV STANDARD_REGISTRY_PASSWORD=$STANDARD_REGISTRY_PASSWORD
ENV PUBLIC_TRUST_CHAIN_ACCESS=$PUBLIC_TRUST_CHAIN_ACCESS

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NODE_ENV=production
RUN echo ${NODE_ENV}
RUN NODE_ENV=${NODE_ENV} yarn build

# Production image, copy all the files and run next
FROM node:16.16-alpine AS runner
WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Automatically leverages output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# The standalone build of Next.js above does not include the public or static files so we copy these separately
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 80

ENV PORT 80

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

# CMD is the command that runs when the container starts
CMD ["node", "server.js"]