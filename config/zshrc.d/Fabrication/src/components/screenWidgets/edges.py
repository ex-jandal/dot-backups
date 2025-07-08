from fabric.widgets.wayland import WaylandWindow as Window
from fabric.widgets.box import Box
from fabric.widgets.centerbox import CenterBox
from src.components.screenWidgets.corners import ScreenCorners


class ScreenEdges(Window):
    def __init__(self):
        super().__init__(
            layer="overlay",
            exclusivity="auto",
            anchor="top bottom left right",
            pass_through=True,
            visible=True,
            all_visible=True,
            name="tet"
        )
        self.all_edges = CenterBox(
            name="screen-edges",
            style=("border: solid 7px #fff;"),
            size=20
        )
        
        self.show_all()
