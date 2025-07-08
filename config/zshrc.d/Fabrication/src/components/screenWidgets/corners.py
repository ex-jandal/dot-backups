from fabric.widgets.box import Box
from fabric.widgets.shapes import Corner
from fabric.widgets.wayland import WaylandWindow as Window


class ScreenCorners(Window):
    def __init__(self):

        super().__init__(
            name="cornerso",
            layer="bottom",
            exclusivity="normal",
            anchor="left bottom top right",
            # margin="7px 20px 0 20px",
            visible=True,
            v_align="fill",
            h_align="fill",
            h_expand=True,
            v_expand=True,
            
        )

        self.all_corners = Box(
            name="all-corners",
            orientation="v",
            style=("border: solid 10px #150d16;"),
            children=[
                Box(
                    name="top-corners",
                    orientation="h",
                    h_align="fill",
                    children=[
                        Corner(
                            orientation="top-left",
                            name="screen-corner",
                            size=(15, 15),
                            v_align="start",
                        ),
                        Box(h_expand=True),
                        Corner(
                            orientation="top-right",
                            name="screen-corner",
                            size=(15, 15),
                            v_align="start",
                        ),
                    ],
                ),
                Box(v_expand=True),
                Box(
                    name="bottom-corners",
                    orientation="h",
                    h_align="fill",
                    children=[
                        Corner(
                            orientation="bottom-left",
                            name="screen-corner",
                            size=(15, 15),
                            v_align="end",
                        ),
                        Box(h_expand=True),
                        Corner(
                            orientation="bottom-right",
                            name="screen-corner",
                            size=(15, 15),
                            v_align="end",
                        ),
                    ],
                ),
            ],
        )

        self.add(self.all_corners)

        self.show_all()
