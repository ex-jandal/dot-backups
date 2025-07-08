from fabric.utils import kebab_case_to_snake_case, get_relative_path
from typing import Literal


def get_icon(
    icon_name: str,
    icon_style: Literal[
        "baseline", "outline", "round", "sharp", "twotwone"
    ] = "baseline",
):
    return get_relative_path(
        f"../../assets/icons/{kebab_case_to_snake_case(icon_name)}/{icon_style}.svg"
    )
