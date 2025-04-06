from pydantic import BaseModel, Field
from datetime import datetime
from beanie import Document
from bson import ObjectId
from typing import List

# Pydantic model for serialization
class MessageRequest(BaseModel):
    UserName: str
    ChatTitle: str
    Message: str

    class Config:
        json_encoders = {
            ObjectId: str  # Ensure ObjectId is serialized as string
        }

# Beanie model for MongoDB
class Message(Document):
    UserName: str = Field(max_length=200)
    ChatTitle: str
    Message: str
    is_completed: bool = Field(default=True)
    TimeStamp: int = Field(default_factory=lambda: int(datetime.now().timestamp()))
    
    class Settings:
        collection_name = 'Messages'

    class Config:
        json_encoders = {
            ObjectId: str
        }