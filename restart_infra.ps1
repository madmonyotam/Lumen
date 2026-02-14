Write-Host "Stopping all containers..."
docker-compose down --remove-orphans

Write-Host "Pulling latest images..."
docker-compose pull

Write-Host "Starting infrastructure..."
docker-compose up -d --build --force-recreate

Write-Host "Infrastructure reset complete."
