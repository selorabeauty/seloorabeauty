FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Fix Windows line endings (CRLF → LF) and make executable
RUN apt-get update && apt-get install -y dos2unix && \
    dos2unix start.sh && \
    chmod +x start.sh && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

EXPOSE 8000

CMD ["sh", "start.sh"]
