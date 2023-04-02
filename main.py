from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from nomic.gpt4all import GPT4All
from markdown import markdown
import random

app = FastAPI()
m = GPT4All()
m.open()
app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/api/chatbot")
async def chatbot_response(request: Request):
    req = await request.json()
    message = req["message"]
    response=m.prompt(message)
    markdown_response = markdown(response)
    return {"markdown": markdown_response}
    
