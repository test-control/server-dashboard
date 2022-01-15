FROM node:14

WORKDIR /srv/dashboard-app

COPY ./components components
COPY ./helpers helpers
COPY ./lib lib
COPY ./pages pages
COPY ./public public
COPY ./services services
COPY ./styles styles
COPY ./theme theme
COPY ./next-i18next.config.js next-i18next.config.js
COPY ./next.config.js next.config.js
COPY ./package.json package.json
COPY ./package-lock.json package-lock.jhson
COPY ./tsconfig.json tsconfig.json
COPY ./next-env.d.ts next-env.d.ts

RUN npm install

EXPOSE 3000

ENTRYPOINT ["npm", "run", "dev"]
