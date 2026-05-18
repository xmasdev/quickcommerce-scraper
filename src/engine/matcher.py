import re
from collections import defaultdict
from src.core.models import Product


def normalize(text: str | None) -> str:
    if not text:
        return ""
    return re.sub(r'\s+', ' ', text.lower().strip())


def make_key(p: Product) -> str:
    return "|".join([
        normalize(p.name),
        normalize(p.quantity),
        normalize(p.brand),
    ])


def group_products(products: list[Product]) -> dict[str, list[Product]]:
    grouped = defaultdict(list)

    for p in products:
        key = make_key(p)
        grouped[key].append(p)

    return grouped