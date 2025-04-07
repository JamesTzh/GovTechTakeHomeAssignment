from fastapi import FastAPI, APIRouter
from contextlib import asynccontextmanager
from database import init_db
import router

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(lifespan=lifespan)
app.include_router(router.router, prefix="/posts", tags=["Posts"])

