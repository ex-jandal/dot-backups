import gi
from fabric.widgets.box import Box
from fabric.widgets.label import Label
from fabric.widgets.image import Image
from fabric.widgets.button import Button
from fabric.notifications import Notifications, Notification
from fabric.utils import invoke_repeater, get_relative_path
from gi.repository import GdkPixbuf
from src.components.utils import get_icon

NOTIFICATION_WIDTH = 360
NOTIFICATION_IMAGE_SIZE = 64
NOTIFICATION_TIMEOUT = 3 * 1000  # 10 seconds


class NotificationWidget(Box):
    def __init__(self, notification: Notification, **kwargs):
        
        super().__init__(
            size=(NOTIFICATION_WIDTH, -1),
            name="notification",
            spacing=8,
            anchor="top left",
            orientation="v",
            **kwargs,
            v_align="start",
            h_align="start",
            v_expand=True,
            h_expand=True,
        )
        

        self._notification = notification

        body_container = Box(spacing=4, orientation="h")

        if image_pixbuf := self._notification.image_pixbuf:
            body_container.add(
                Image(
                    pixbuf=image_pixbuf.scale_simple(
                        NOTIFICATION_IMAGE_SIZE,
                        NOTIFICATION_IMAGE_SIZE,
                        GdkPixbuf.InterpType.BILINEAR,
                    )
                )
            )

        body_container.add(
            Box(
                spacing=4,
                orientation="v",
                children=[
                    # a box for holding both the "summary" label and the "close" button
                    Box(
                        orientation="h",
                        children=[
                            Label(
                                label=self._notification.summary,
                                ellipsization="middle",
                            )
                            .build()
                            .add_style_class("summary")
                            .unwrap(),
                        ],
                        h_expand=True,
                        v_expand=True,
                    )
                    # add the "close" button
                    .build(
                        lambda box, _: box.pack_end(
                            Button(
                                name="notify-button",
                                image=Image(
                                    image_file=get_icon("close","round"),
                                    size=20,
                                ),
                                v_align="center",
                                h_align="end",
                                on_clicked=lambda *_: self._notification.close(),
                            ),
                            False,
                            False,
                            0,
                        )
                    ),
                    Label(
                        label=self._notification.body,
                        line_wrap="word-char",
                        v_align="start",
                        h_align="start",
                    )
                    .build()
                    .add_style_class("body")
                    .unwrap(),
                ],
                h_expand=True,
                v_expand=True,
            )
        )

        self.add(body_container)

        if actions := self._notification.actions:
            self.add(
                Box(
                    spacing=4,
                    orientation="h",
                    children=[
                        Button(
                                name="notify-button",
                            h_expand=True,
                            v_expand=True,
                            label=action.label,
                            on_clicked=lambda *_, action=action: action.invoke(),
                        )
                        for action in actions
                    ],
                )
            )

        # destroy this widget once the notification is closed
        self._notification.connect(
            "closed",
            lambda *_: (
                parent.remove(self) if (parent := self.get_parent()) else None,  # type: ignore
                self.destroy(),
            ),
        )

        # automatically close the notification after the timeout period
        invoke_repeater(
            NOTIFICATION_TIMEOUT,
            lambda: self._notification.close("expired"),
            initial_call=False,
        )

