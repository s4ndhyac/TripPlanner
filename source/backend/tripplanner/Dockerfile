FROM python:3.6
ENV PYTHONUNBUFFERED 1
ENV SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET imYZVVJY8HF6jXFVKwEALwAH
ENV SOCIAL_AUTH_GOOGLE_OAUTH2_KEY 117123737084-rp4gfof0cf77kqjm65j69upudlefshsj.apps.googleusercontent.com
ENV YELP_API_KEY MB_TUAI96_WP-B2XJl6S06raCPLAKzrJdJXd1kXgngCQMEJrjy-ubXDALP7Xd1yaQv0ArIjgna1zah1R2iXEHqFHC_yVjFlDwKpbc5v5EDWl3nbZGU0E3_tNtC-_XXYx
ENV GOOGLE_API_KEY AIzaSyB6YgxpNCFRclsxCFIY8hGU1508sLVzxKY
ENV POSTGRES_HOST database
ENV EMAIL_HOST_PASSWORD mcs2019tripplanner
ENV FRONTEND_BASE_URL https://frontend.trippplanner.com/
RUN pip install --upgrade pip
RUN mkdir /app
WORKDIR /app
COPY requirements.txt /app
RUN pip install -r requirements.txt
COPY . /app
RUN chmod +x start.sh
RUN apt-get update
RUN apt-get install netcat -y
EXPOSE 8000
CMD ["./start.sh"]
