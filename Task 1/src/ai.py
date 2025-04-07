from openai import OpenAI
import os

client = OpenAI(
    # This is the default and can be omitted
    api_key=os.getenv("gptapikey", "defaultkey"),
)

def format_history(Messages):
    Sep = Messages.split(",")

    history = []

    for i in range(len(Sep)):
        if i % 2 == 0:
            history.append({"role":"user", "content": Sep[i]})
        else:
            history.append({"role":"system", "content": Sep[i]})
    
    print("history from ai = ",history)
    return history
    

def get_ai_response(FormatedHistoryMessages):
    response = client.responses.create(
        model="gpt-4o-mini",
        instructions="You are give a query and the chat history, answer the query with the context of the chat history.",
        input=FormatedHistoryMessages,
    )

    reply = response.output_text
    # Get and print the response content
    print(reply)

    return reply
    
