FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Make startup script executable
RUN chmod +x start.sh

EXPOSE 8000

# Use startup script — waits for DB, runs migrations, then starts server
CMD ["sh", "start.sh"]
