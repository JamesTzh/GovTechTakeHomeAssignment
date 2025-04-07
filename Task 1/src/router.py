from fastapi import APIRouter, HTTPException
from typing import List
from models import Message, MessageRequest
from ai import format_history, get_ai_response
from anonymizer import anonymize_username

router = APIRouter()

@router.post("/createmessage",response_model=Message)
async def create_message(message_request: MessageRequest):
    message_request.UserName = anonymize_username(message_request.UserName)
    message = Message(**message_request.model_dump())
    await message.create()
    return message

@router.get("/getall",response_model=List[Message])
async def get_allmessages():
    messages = await Message.find_all().to_list()
    return messages

@router.get("/getuser",response_model=List[Message])
async def get_UserMessages(UserName:str):
    UserName = anonymize_username(UserName)
    messages = await Message.find(Message.UserName == UserName).to_list()
    if not messages:
        return []
    return [MessageRequest(**message.model_dump()) for message in messages]

@router.get("/gethistory",response_model=str)
async def get_ChatMessage(UserName:str, ChatTitle:str):
    UserName = anonymize_username(UserName)
    message = await Message.find(Message.UserName == UserName and Message.ChatTitle == ChatTitle).first_or_none()
    if not message:
        return ""
    return MessageRequest(**message.model_dump()).Message

@router.put("/query", response_model=str)
async def update_post(UserName:str, ChatTitle:str, query: str):
    UserName = anonymize_username(UserName)
    message = await Message.find(Message.UserName == UserName and Message.ChatTitle == ChatTitle).first_or_none()
    new = MessageRequest(UserName=UserName,ChatTitle=ChatTitle,Message=MessageRequest(**message.model_dump()).Message+","+"'"+query+"'")
    history = format_history(MessageRequest(**new.model_dump()).Message)
    await message.update({"$set":new.model_dump(exclude_unset = True)})
    reply = get_ai_response(history)
    new = MessageRequest(UserName=UserName,ChatTitle=ChatTitle,Message=MessageRequest(**message.model_dump()).Message+","+"'"+reply+"'")
    await message.update({"$set":new.model_dump(exclude_unset = True)})
    return reply

@router.delete("/delete")
async def delete_message(UserName:str, ChatTitle:str):
    message = await Message.find(Message.UserName == UserName and Message.ChatTitle == ChatTitle).first_or_none()
    throw_exception(message)
    await message.delete()
    return "Message deleted successfully"

def throw_exception(message):
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")