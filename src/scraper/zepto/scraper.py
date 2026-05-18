from playwright.sync_api import sync_playwright
import json
from decimal import Decimal

from src.core.models import Product


def search_zepto(query: str) -> list[Product]:
    with sync_playwright() as p:
        browser = p.firefox.launch(headless=True)

        context = browser.new_context(
            user_agent="Mozilla/5.0 (X11; Linux x86_64; rv:120.0)",
            viewport={"width": 1280, "height": 800},
        )

        page = context.new_page()
        results = []

        # 🔍 Capture API responses
        def handle_response(response):
            if "user-search-service/api/v3/search" in response.url:
                req = response.request

                if req.method == "POST" and req.post_data:
                    try:
                        payload = json.loads(req.post_data)

                        if "pageNumber" in payload:
                            data = response.json()

                            if "layout" in data:
                                results.append(data)

                    except:
                        pass

        page.on("response", handle_response)

        # 🌐 Load page
        page.goto("https://www.zepto.com/search")
        page.wait_for_timeout(2000)

        # 🔎 Trigger search
        search_box = page.locator('input[role="combobox"]')
        search_box.click()
        search_box.type(query, delay=50)
        search_box.press("Enter")

        # ⏳ Wait for response
        timeout = 0
        while not results and timeout < 20:
            page.wait_for_timeout(500)
            timeout += 1

        if not results:
            browser.close()
            return []

        # 🔗 Extract product URLs from DOM
        page.wait_for_timeout(2000)  # ensure DOM rendered

        hrefs = page.locator('a[href*="/pn/"]').evaluate_all(
            "els => els.map(e => e.getAttribute('href'))"
        )

        urls = [
            f"https://www.zepto.com{h}"
            for h in hrefs
            if h and "/pn/" in h
        ]

        browser.close()

        return _parse_products(results[0], urls)
    

def _parse_products(data: dict, urls: list[str]) -> list[Product]:
    products = []
    url_idx = 0

    for widget in data.get("layout", []):
        if not widget.get("widgetName", "").startswith("SEARCHED_PRODUCTS"):
            continue

        items = (
            widget.get("data", {})
                  .get("resolver", {})
                  .get("data", {})
                  .get("items", [])
        )

        for item in items:
            pr = item.get("productResponse")
            if not pr:
                continue

            product = pr.get("product", {})
            variant = pr.get("productVariant", {})

            price = pr.get("sellingPrice")

            # 🖼️ extract image
            images = variant.get("images", [])

            image_url = None
            if images:
                path = images[0].get("path")
                if path:
                    image_url = f"https://cdn.zeptonow.com/{path}"

            # 🔗 assign URL (safe index)
            product_url = urls[url_idx] if url_idx < len(urls) else None
            url_idx += 1

            products.append(Product(
                id=pr.get("id"),
                name=product.get("name"),
                price=Decimal(price) / 100 if price else Decimal(0),
                in_stock=not pr.get("outOfStock", False),
                platform="zepto",
                brand=product.get("brand"),
                quantity=variant.get("formattedPacksize"),
                image_url=image_url,
                product_url=product_url
            ))

    return products


# test
if __name__ == "__main__":
    products = search_zepto("cold drink")

    print(f"Found {len(products)} products\n")

    for p in products[:10]:
        print(p)