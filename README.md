
# GovTech Take Home Assignment

This repo is for GovTech take home assignment.


## Run Locally

1) Download the docker-compose.yml


2) Pull task 2 img from dockerhub
```bash
  docker pull jamestzh/sha256:1a6bc403a780839902b6a6499ad38acbb4d4131989ab90df062dea9f1b57a86c
```


3) Pull task1 mongodb img from dockerhub
```bash
  docker pull jamestzh/sha256:b1d4ab2a034263b0e2306e41be1a596bd8600fb6fadef145a9088791c8d7c4b5
```


4) Pull task1 py img from dockerhub
```bash
  docker pull jamestzh/sha256:03db956cbbdd3f2e7c0344a6d1b5d15d5711f630dccace8e7bfff7184e49ecac
```


5) Start the backend server
```bash
  docker-compose up
```


6) Start the frontend application
```bash
  docker run -p 3000:3000 jamestzh/sha256:1a6bc403a780839902b6a6499ad38acbb4d4131989ab90df062dea9f1b57a86c
```

7) Connect to localhost:3000 for nodejs frontend

8) Connect to localhost:8000 for fastapi backend



## Screenshots

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)

