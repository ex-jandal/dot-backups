import psutil
from fabric import Application, Fabricator
from fabric.widgets.box import Box
from fabric.widgets.image import Image
from fabric.widgets.svg import Svg
from fabric.widgets.button import Button
from fabric.widgets.eventbox import EventBox
from fabric.widgets.label import Label
from fabric.widgets.datetime import DateTime
from fabric.widgets.centerbox import CenterBox
from fabric.system_tray.widgets import SystemTray
from fabric.widgets.circularprogressbar import CircularProgressBar
from fabric.widgets.wayland import WaylandWindow as Window
from fabric.hyprland.widgets import Language, ActiveWindow, Workspaces, WorkspaceButton
from fabric.utils import FormattedString, get_relative_path, bulk_replace
from fabric.widgets.shapes.corner import Corner
from ..utils import get_icon


AUDIO_WIDGET = True

if AUDIO_WIDGET is True:
    try:
        from fabric.audio.service import Audio
    except Exception as e:
        AUDIO_WIDGET = False
        print(e)


class VolumeWidget(Box):
    def __init__(self, **kwargs):
        self.progress_bar = CircularProgressBar(
            name="volume-progress-bar",
            pie=True,
            child=Svg(
                        svg_file=get_icon("volume_up", "round"),
                        style=("fill:#fff;"),
                        size=50,
                    ),
            size=24,
        )

        self.audio = Audio(notify_speaker=self.on_speaker_changed)  # type: ignore

        super().__init__(
            children=EventBox(
                events="scroll", child=self.progress_bar, on_scroll_event=self.on_scroll
            ),
            **kwargs,
        )

    def on_scroll(self, _, event):
        match event.direction:
            case 0:
                self.audio.speaker.volume += 8
            case 1:
                self.audio.speaker.volume -= 8
        return

    def on_speaker_changed(self):
        if not self.audio.speaker:
            return

        self.progress_bar.value = self.audio.speaker.volume / 100
        return self.audio.speaker.bind(
            "volume", "value", self.progress_bar, lambda _, v: v / 100
        )


class StatusBar(Window):
    def __init__(
        self,
    ):
        super().__init__(
            name="bar",
            layer="top",
            exclusivity="auto",
            anchor="left top right",
            margin="10px 20px 0 20px",
            visible=False,
        )

        self.system_status = Box(
            name="system-status",
            spacing=15,
            orientation="h",
            children=[
                # RAM ProgressBar
                CircularProgressBar(
                    name="ram-progress-bar",
                    pie=True,
                    child=Svg(
                        svg_file=get_icon("memory", "round"),
                        style=("fill:#fff;"),
                        size=2,
                    ),
                    size=24,
                ).build(
                    lambda progres: Fabricator(
                        interval=1000,
                        poll_from=lambda f: psutil.virtual_memory().percent / 100,
                        on_changed=lambda _, value: progres.set_value(value),
                    )
                ),
                # CPU ProgressBar
                CircularProgressBar(
                    name="cpu-progress-bar",
                    pie=True,
                    child=Svg(
                        svg_file=get_icon("memory", "round"),
                        style=("fill:#fff;"),
                        size=2,
                    ),
                    size=24,
                ).build(
                    lambda progres: Fabricator(
                        interval=1000,
                        poll_from=lambda f: psutil.cpu_percent() / 100,
                        on_changed=lambda _, value: progres.set_value(value),
                    )
                ),
            ]
            # Add volume if enabled
            + ([VolumeWidget()] if AUDIO_WIDGET else []),
        )

        self.children = CenterBox(
            # name="bar-inner",
            start_children=CenterBox(
                center_children=Box(
                    name="start-container",
                    children=[
                        # Image(image_file="src/assets/hyprland.svg",pixel_size=0.01, icon_size=None,),
                        ActiveWindow(
                            name="ActiveWindow",
                        ),
                    ],
                ),
                end_children=Box(
                    children=Corner(
                        orientation="top-left",
                        name="corner",
                        size=(20),
                        v_align="start",
                    )
                ),
            ),
            center_children=CenterBox(
                start_children=CenterBox(
                    start_children=Box(children=[self.system_status]),
                    center_children=Box(
                        children=Corner(
                            orientation="top-left",
                            name="corner",
                            size=(20),
                            v_align="start",
                        )
                    ),
                ),
                center_children=Box(
                    name="center-container",
                    spacing=0,
                    children=[
                        Workspaces(
                            name="workspaces",
                            spacing=5,
                            buttons_factory=lambda ws_id: WorkspaceButton(
                                name="workspace-button", id=ws_id, label=None
                            ),
                        )
                    ],
                ),
                end_children=CenterBox(
                    center_children=Box(
                        children=Corner(
                            orientation="top-right",
                            name="corner",
                            size=(20),
                            v_align="start",
                        )
                    ),
                    end_children=Box(
                        children=[
                            DateTime(
                                name="date-time",
                                formatters=["%m/%d   •   %I:%M   •   %p"],
                                tooltip_text="Fabric is on top!!!",
                                size=5,
                            ),
                        ]
                    ),
                ),
            ),
            end_children=CenterBox(
                start_children=Box(
                    children=Corner(
                        orientation="top-right",
                        name="corner",
                        size=(20),
                        h_expand=False,
                        v_expand=False,
                        v_align="start",
                    )
                ),
                center_children=Box(
                    name="end-container",
                    spacing=4,
                    orientation="h",
                    children=[
                        SystemTray(name="system-tray", icon_size=18, spacing=10),
                        Language(
                            name="hyprland-window",
                            formatter=FormattedString(
                                "{replace_lang(language)}",
                                replace_lang=lambda lang: bulk_replace(
                                    lang,
                                    (r".*Eng.*", r".*Ar.*"),
                                    ("ENG", "ARA"),
                                    regex=True,
                                ),
                            ),
                        ),
                    ],
                ),
            ),
        )
        return self.show_all()
