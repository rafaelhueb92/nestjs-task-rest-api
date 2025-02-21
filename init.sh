IS_RUNNING=$(docker ps | grep postgres | wc -l)

if [ $IS_RUNNING == 0 ]; then
    echo "Running Postgress"
    docker run --name postgres-nest -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres
fi
npm run start:dev