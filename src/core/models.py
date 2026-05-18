from dataclasses import dataclass
from decimal import Decimal
from typing import Literal

@dataclass(frozen=True)
class Product:
    id: str
    name: str
    price: Decimal
    in_stock: bool
    platform: Literal["zepto", "blinkit", "instamart"]

    # optional / messy fields
    brand: str | None = None
    image_url: str | None = None
    product_url: str | None = None
    quantity: str | None = None

    @property
    def key(self) -> str:
        return f"{self.name}|{self.quantity}|{self.brand}"