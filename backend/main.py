import uvicorn
from anthropic import Anthropic
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],  # Allows all origins. Replace with specific domains in production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Load API key
XAI_API_KEY = os.getenv("XAI_API_KEY")
client = Anthropic(
    api_key=XAI_API_KEY,
    base_url="https://api.x.ai",
)


class Message(BaseModel):
    msg: str


@app.post("/api/grok/")
async def grok(msg: Message):
    try:
        
        # Use the chat_completions API
        message = client.messages.create(
            model="grok-beta",
            max_tokens=128,
            system="You are Grok, a chatbot",
            messages=[
                {
                    "role": "user",
                    "content": f"{msg.msg}",
                },
            ],
        )
        
        return {"data": message.content[0]}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Error processing request.")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
