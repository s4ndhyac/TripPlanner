# TripPlanner
An app that lets you Auto-generate your group trip's itinerary collaboratively based on your places of interest. Planning a vacation with friends was never easier!

## Getting Started (Local Development)

```bash
git clone https://gitlab-cs297p.ics.uci.edu/team2/capstone_project_team2.git

# Create the Environment variables
. ./source/env.sh

# Start the database
cd source/database/docker

# Build the docker image
docker build -t $GCR_REGISTRY/$PROJECT/$DATABASE_DOCKER_IMG:v1 -f Dockerfile .

# Run the docker image
docker run -d -p 5432:5432  $GCR_REGISTRY/$PROJECT/$DATABASE_DOCKER_IMG:v1 --name database

# Start Django on the wsgi server
cd source/backend/tripplanner

# Initialize virtual environment (only need to initialize once)
virtualenv venv

# Activate venv
source venv/bin/activate

# Install dependencies inside venv
pip3 install -r requirements.txt

# Migrate database
python3 manage.py migrate

# Start development server
python3 manage.py runserver

# Start the react-app server
cd source/frontend

# Install the node modules
npm install

# Start the react-app development server
npm run start

```

Now navigate to http://localhost:3000/ to interact with the app.

## Running Django Unit Tests
```bash
cd source/backend/tripplanner

python3 manage.py test

```

# Production Setup 
Refer to [Kubernetes Setup](k8s-setup.md)