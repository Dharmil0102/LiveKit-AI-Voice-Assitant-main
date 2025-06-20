from dotenv import load_dotenv

from livekit import agents
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import (
    openai,
)
from prompts import WELCOME_MESSAGE, INSTRUCTIONS

load_dotenv()

class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(instructions=WELCOME_MESSAGE)


async def entrypoint(ctx: agents.JobContext):
    session = AgentSession(
        llm=openai.realtime.RealtimeModel(
            model="gpt-4o-realtime-preview",
            voice="coral",
        )
    )

    await session.start(
        room=ctx.room,
        agent=Assistant(),
    )

    await ctx.connect()

    await session.generate_reply(
        instructions=INSTRUCTIONS
    )


if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))