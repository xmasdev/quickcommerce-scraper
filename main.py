from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Import the new async function
from src.engine.aggregator import search_all_async

app = FastAPI(title="Q-Commerce API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Make the route 'async def'
@app.get("/api/search")
async def search_products(query: str = Query(..., min_length=1)):
    try:
        # Await the concurrent scraping
        results = await search_all_async(query)
        return results
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)