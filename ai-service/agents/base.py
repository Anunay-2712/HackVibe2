import asyncio
import random
import traceback
from utils.schema import AgentResult
from models_config import MOCK_MODE

async def execute_agent(agent_name, track, func, *args, **kwargs):
    """
    Wraps agent execution. Handles random delay for mock mode, exceptions, and constructs the result.
    """
    try:
        # Simulate processing delay
        delay = random.uniform(0.5, 3.0)
        await asyncio.sleep(delay)
        
        result = await func(*args, **kwargs)
        
        result_dict = {
            "agent": agent_name,
            "track": track,
            "status": "ok",
            "mock": MOCK_MODE,
        }
        result_dict.update(result)
        return AgentResult(**result_dict)
    except Exception as e:
        print(f"Error in {agent_name}: {traceback.format_exc()}")
        return AgentResult(
            agent=agent_name,
            track=track,
            status="error",
            score=0.0,
            confidence=0.0,
            summary=f"Error executing agent: {str(e)}",
            mock=MOCK_MODE
        )
