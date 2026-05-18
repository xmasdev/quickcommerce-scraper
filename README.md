# Quick Commerce Scraper
#### Currently supports Blinkit and Zepto scraping

Included frontend for quick comparison

Interceps API calls with playwright headless browser, extracts the products information, and saves in a defined structure to be rendered in the frontend..

No tokens needed, just interceps API calls from a regular unauthenticated user, but as a result does not support location based pricing

### Installation and running

##### Clone the repo
``` bash
git clone https://github.com/xmasdev/quickcommerce-scraper && cd quickcommerce-scraper
```
##### Run the scraper api
```bash
pip install -r requirements.txt
playwright install
uvicorn main:app --reload
```
##### Run the frontend client
``` bash
cd frontend
npm install
npm run dev
```