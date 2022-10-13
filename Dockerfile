ARG BASE_IMAGE=node:16.16-alpine

# ------------------------------------- #
# Install dependencies only when needed #
# ------------------------------------- #
FROM $BASE_IMAGE AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# ---------------------------------------- #
# Rebuild the source code only when needed #
# ---------------------------------------- #
FROM $BASE_IMAGE AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NODE_ENV=production
RUN echo ${NODE_ENV}
RUN NODE_ENV=${NODE_ENV} yarn build

# ------------------------------------------------- #
# Production image, copy all the files and run next #
# ------------------------------------------------- #
FROM $BASE_IMAGE AS runner
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