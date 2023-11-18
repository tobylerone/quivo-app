ARG PYTHON_VERSION=3.11.5
FROM python:${PYTHON_VERSION}-slim as base

RUN pip install --upgrade pip

COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY ./language_app .
WORKDIR ./language_app

#COPY ./entrypoint.sh .
#ENTRYPOINT ["sh", "./app/entrypoint.sh"]

# Run the application.
CMD python ../manage.py runserver 192.168.0.22:8000