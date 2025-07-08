from fabric.widgets.wayland import WaylandWindow as Window
from fabric.widgets.box import Box
from fabric.widgets.datetime import DateTime


class DesktopWidget(Window):
    def __init__(self):
        super().__init__(
            layer="bottom",
            anchor="center",
            exclusivity="none",
            child=Box(
                orientation="v",
                children=[
                    DateTime(formatters=["%A. %d %B"], interval=10000, name="dw-date"),
                    DateTime(formatters=["%I:%M"], name="dw-clock"),
                ],
            ),
            all_visible=True,
        )