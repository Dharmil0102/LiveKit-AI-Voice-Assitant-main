import os
import uuid
import asyncio
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from livekit import api as lk_api
from livekit.api import LiveKitAPI, ListRoomsRequest

load_dotenv()

app = Flask(__name__)
CORS(app)

LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")
LIVEKIT_URL = os.getenv("LIVEKIT_URL")  # required for LiveKitAPI

# 🧠 Generate a unique room name that doesn't exist
async def generate_room_name():
    name = "room-" + str(uuid.uuid4())[:8]
    existing = await get_rooms()
    while name in existing:
        name = "room-" + str(uuid.uuid4())[:8]
    return name

# 📦 List current rooms
async def get_rooms():
    try:
        api = LiveKitAPI(api_key=LIVEKIT_API_KEY, api_secret=LIVEKIT_API_SECRET, url=LIVEKIT_URL)
        rooms = await api.room.list_rooms(ListRoomsRequest())
        await api.aclose()
        return [room.name for room in rooms.rooms]
    except Exception as e:
        print("Error listing rooms:", e)
        return []


# 🔑 Token generation route
@app.route("/getToken")
def get_token():
    identity = request.args.get("name", "anonymous")
    room = request.args.get("room", None)

    async def async_handler():
        nonlocal room
        if not room:
            room = await generate_room_name()

        grants = lk_api.VideoGrants(room_join=True, room=room)
        token = (
            lk_api.AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET)
            .with_identity(identity)
            .with_grants(grants)
        )
        return {"token": token.to_jwt(), "room": room}

    result = asyncio.run(async_handler())
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
