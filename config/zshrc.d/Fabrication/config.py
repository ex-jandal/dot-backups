from typing import cast
from fabric import Application
from fabric.widgets.box import Box
from fabric.utils import get_relative_path
from src.components.screenWidgets.corners import ScreenCorners
from src.components.screenWidgets.edges import ScreenEdges
from src.components.bar.main import StatusBar
from fabric.widgets.wayland import WaylandWindow
from src.components.notifications.main import (
    Notifications,
    NotificationWidget,
    Notification,
)
from src.components.desktopWidget.config import DesktopWidget
from src.components.sidePanel.config import SidePanel
from src.components.appLauncher.config import AppLauncher

sidepanel = SidePanel()
sidepanel.hide()

@Application.action()
def show_sidebar():
    if sidepanel.is_visible():
        sidepanel.hide()
    else:
        sidepanel.show()

applauncher = AppLauncher()
applauncher.hide()

@Application.action()
def show_app_launcher():
    if applauncher.is_visible():
        applauncher.hide()
    else:
        applauncher.show()

desktopWidget = DesktopWidget()
desktopWidget.hide()

@Application.action()
def show_desktop_widget():
    if desktopWidget.is_visible():
        desktopWidget.hide()
    else:
        desktopWidget.show()
        
bar = StatusBar()

@Application.action()
def show_status_bar():
    if bar.is_visible():
        bar.hide()
    else:
        bar.show()

if __name__ == "__main__":
    app = Application(
        "Fabrication",
        ScreenEdges(),
        ScreenCorners(),
        # bar,
        WaylandWindow(
            margin="8px 8px 8px 8px",
            anchor="top right",
            child=Box(
                size=2,  # so it's not ignored by the compositor
                spacing=4,
                orientation="v",
            ).build(
                lambda viewport, _: Notifications(
                    on_notification_added=lambda notifs_service, nid: viewport.add(
                        NotificationWidget(
                            cast(
                                Notification,
                                notifs_service.get_notification_from_id(nid),
                            )
                        )
                    )
                )
            ),
            visible=True,
            all_visible=True,
        ),
    )

    # app = Application(open_inspector=True)
    app.set_stylesheet_from_file(get_relative_path("./style.css"))

    app.run()
