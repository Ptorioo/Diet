# Dietogether
## Build from Docker
```
docker compose up --build -d
```
## Dev Build
```
npm install
npm run dev
```
## Front-End Production Build
```
npm run build
npm run start
```

## Environment variables
put the `secrets.env` file with the following contents in the /backend folder

```env
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
GOOGLE_MAPS_API_KEY=
VISUALCROSSING_API_KEY=
```

The frontend requires the following environment variable too:

```env
NEXT_PUBLIC_APP_API_URL=
```
