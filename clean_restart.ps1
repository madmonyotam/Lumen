Write-Host "Stopping all containers and removing volumes..."
docker-compose down -v --remove-orphans

Write-Host "Pulling latest images..."
docker-compose pull

Write-Host "Starting infrastructure..."
docker-compose up -d --build --force-recreate

Write-Host "Clean restart complete."
