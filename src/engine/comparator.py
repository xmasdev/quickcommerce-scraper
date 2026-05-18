from src.core.models import Product


def compare_group(products: list[Product]) -> dict:
    # sort by price
    products = sorted(products, key=lambda p: p.price)

    return {
        "product_name": products[0].name,
        "quantity": products[0].quantity,
        "brand": products[0].brand,
        "options": products,
        "cheapest": products[0],
    }