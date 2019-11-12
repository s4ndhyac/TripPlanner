# TripPlanner
An app that lets you Auto-generate your group trip's itinerary collaboratively based on your places of interest. Planning a vacation with friends was never easier!

## Getting Started (Local Development)

```bash
# Step 1.1: Initialize virtual environment (only need to initialize once)
virtualenv venv

# Step 1.2: Export all environment variables (only need to initialize once)
. ./source/env.sh

# Step 1.3: Export all secret variables (only need to initialize once. DON'T ADD THEM TO GIT!!!!)
. ./source/secrets.sh

# Step 1.3.1: Add all secrets into ./source/backend/tripplanner/.env and don't add them to GIT!

# Step 1.4: Create database (only need to initialize once)
createdb tripplanner

# Step 2: Activate venv
source venv/bin/activate

# Step 3: Install dependencies inside venv
pip3 install -r source/backend/tripplanner/requirements.txt

# Step 4: Migrate database
python3 source/backend/tripplanner/manage.py migrate

# Step 5: Start development server
python3 source/backend/tripplanner/manage.py runserver
```