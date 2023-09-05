FROM python:3.11.5-slim

RUN pip install --upgrade pip

COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY ./language_app .
WORKDIR ./language_app

COPY ./entrypoint.sh .
ENTRYPOINT ["sh", "./app/entrypoint.sh"]