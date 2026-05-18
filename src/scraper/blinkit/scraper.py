from playwright.sync_api import sync_playwright
import json
import re
from decimal import Decimal

from src.core.models import Product


# -------------------------
# 🔧 slugify for URL
# -------------------------
def slugify(name: str) -> str:
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')


# -------------------------
# 🔍 main search
# -------------------------
def search_blinkit(query: str) -> list[Product]:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        context = browser.new_context(
            viewport={"width": 800, "height": 800},
            user_agent="Mozilla/5.0 (X11; Linux x86_64; rv:120.0)",
        )

        page = context.new_page()

        # 🎯 capture API response reliably
        with page.expect_response(lambda r: "/v1/layout/search" in r.url) as resp_info:
            page.goto(f"https://blinkit.com/s/?q={query}")

        response = resp_info.value

        # ✅ safer parsing
        text = response.text()
        data = json.loads(text)

        browser.close()

        return _parse_products(data)


# -------------------------
# 🧠 parser
# -------------------------
def _parse_products(data: dict) -> list[Product]:
    products = []

    snippets = data.get("response", {}).get("snippets", [])

    for snippet in snippets:
        if snippet.get("widget_type") != "product_card_snippet_type_2":
            continue

        d = snippet.get("data", {})

        try:
            cart = (
                d.get("atc_action", {})
                 .get("add_to_cart", {})
                 .get("cart_item", {})
            )

            name = d.get("display_name", {}).get("text")
            product_id = d.get("product_id")

            price = cart.get("price")

            # 🖼️ image
            image_url = d.get("image", {}).get("url")

            # 🔗 product URL (slug + id)
            product_url = None
            if name and product_id:
                slug = slugify(name)
                product_url = f"https://blinkit.com/prn/{slug}/prid/{product_id}"

            products.append(Product(
                id=str(product_id),
                name=name,
                price=Decimal(price) if price else Decimal(0),
                in_stock=not d.get("is_sold_out", False),
                platform="blinkit",

                # optional fields
                brand=cart.get("brand"),
                image_url=image_url,
                product_url=product_url,
                quantity=d.get("variant", {}).get("text"),
            ))

        except Exception:
            continue

    return products


# -------------------------
# 🧪 test run
# -------------------------
if __name__ == "__main__":
    products = search_blinkit("milk")

    print(f"Found {len(products)} products\n")

    for p in products[:10]:
        print(p)