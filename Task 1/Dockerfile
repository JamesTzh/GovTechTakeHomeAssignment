FROM python:3.12

WORKDIR /task1

COPY requirements.txt .
COPY ./src ./src

RUN pip install -r requirements.txt

COPY . .

ENV PORT=8000

EXPOSE 8000

CMD ["python", "./src/Task1.py"]