from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
from beanie import init_beanie
from models import Message

async def init_db():
    uri = "mongodb://mongodb:27017"
    client = AsyncIOMotorClient(uri, server_api=ServerApi('1'))

    await init_beanie(database = client.blog, document_models = [Message])


