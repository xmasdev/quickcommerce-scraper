import asyncio
from src.scraper.zepto.scraper import search_zepto
from src.scraper.blinkit.scraper import search_blinkit
from src.core.models import Product

async def search_all_async(query: str) -> list[Product]:
    products: list[Product] = []

    # asyncio.to_thread runs synchronous blocking functions in separate threads
    # so they execute concurrently without blocking the main event loop
    zepto_task = asyncio.to_thread(search_zepto, query)
    blinkit_task = asyncio.to_thread(search_blinkit, query)

    # await gather() fires them both off at the same time and waits for both to finish
    # return_exceptions=True prevents one scraper crashing from killing the other
    results = await asyncio.gather(zepto_task, blinkit_task, return_exceptions=True)

    # results[0] is Zepto data, results[1] is Blinkit data
    zepto_result, blinkit_result = results

    if isinstance(zepto_result, Exception):
        print("Zepto failed:", zepto_result)
    else:
        products.extend(zepto_result) # type: ignore

    if isinstance(blinkit_result, Exception):
        print("Blinkit failed:", blinkit_result)
    else:
        products.extend(blinkit_result) # type: ignore

    return products