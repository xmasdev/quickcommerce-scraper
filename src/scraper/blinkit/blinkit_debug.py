from playwright.sync_api import sync_playwright
import json


def dump_blinkit_search(query: str):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)

        context = browser.new_context(
            viewport={"width": 800, "height": 800},
        )

        page = context.new_page()

        # 🎯 capture response DURING navigation
        with page.expect_response(lambda r: "/v1/layout/search" in r.url) as resp_info:
            page.goto(f"https://blinkit.com/s/?q={query}")

        response = resp_info.value

        # ✅ parse safely
        text = response.text()
        data = json.loads(text)

        browser.close()

        print("\n=== TOP LEVEL KEYS ===")
        print(list(data.keys()))

        with open("blinkit_response.txt", "w") as f:
            json.dump(data, f, indent=2)

        print("Saved to blinkit_response.txt")


if __name__ == "__main__":
    dump_blinkit_search("milk")