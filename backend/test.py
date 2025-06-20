from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, WorkerType, cli, multimodal
from livekit.plugins import google
from dotenv import load_dotenv
load_dotenv()
async def entrypoint(ctx: JobContext):
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    agent = multimodal.MultimodalAgent(
        model=google.beta.realtime.RealtimeModel(
            instructions="Act sarcastic",
            voice="Puck",
            temperature=0.6,
            modalities=["AUDIO"],
        )
    )
    agent.start(ctx.room)


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, worker_type=WorkerType.ROOM))
