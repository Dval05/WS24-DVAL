# ==========================================
# ETAPA 1: Construir React (Node.js)
# ==========================================
# CAMBIO IMPORTANTE: De node:18 pasamos a node:22-alpine
FROM node:22-alpine as build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build


FROM python:3.9-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

COPY --from=build /app/frontend/dist /app/static

ENV PORT=8000
EXPOSE $PORT

CMD sh -c "uvicorn main:app --host 0.0.0.0 --port $PORT"