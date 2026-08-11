#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Developer: Mohammed Al-Baqer
# Copyright: Copyright (c) 2026

import webview
from datetime import datetime
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))
os.environ["WebViewHTML"] = "index.html"
os.system("cls" if os.name == "nt" else "clear")

S = "\033[0m"        # Reset
R = "\033[91;1m"     # Red
G = "\033[92;1m"     # Green
B = "\033[94;1m"     # Blue
Y = "\033[93;1m"     # Yellow
C = "\033[96;1m"     # Cyan
M = "\033[95;1m"     # Magenta
W = "\033[97;1m"     # White
D = "\033[90;1m"     # Grey
P = "\033[38;5;198m" # Pink
O = "\033[38;5;202m" # Orange

def DateTime():
    try:
        now = datetime.now()
        FormatedTime = now.strftime("%I:%M:%S %p")
        FormatedDay = now.strftime("%A")
        DateDay = (
            B + "[" + G + "Today" + B + "]" +
            W + "(" + Y + FormatedDay +
            M + f" {now:%B %d %Y}" +
            W + ") " + B + "[" +
            G + "Time" + B + "]" +
            Y + "[" + R + FormatedTime +
            Y + "]" + W
        )
        return DateDay
    except Exception as e:
        return str(e)
    
def Banner():
    __Developer__ = "Mohammed Al-Baqer"
    __Copyright__ = "Copyright (c) 2026"
    AscallArt = R + " ● " + Y + "●" + G + " ● " + W
    print(f"""
    ┏───────────────────────────────────┓
    ┃{AscallArt}                            ┃
    ┣────────────┳──────────────────────┫
    ┃{B} Developer  {W}│ {__Developer__}{W}    ┃
    ┃{B} Copyright  {W}│ {__Copyright__}{W}   ┃
    ┗────────────┻──────────────────────┛""")
Banner()


def DevTools():
    webview.windows[0].toggle_devtools()
webview.create_window(
    title="Web Tester",
    url="index.html",
    width=800,
    height=600,
    resizable=True,
    fullscreen=False,
    on_top=False,
    confirm_close=True,
    js_api=None,
    hidden=False,
    frameless=False,
    easy_drag=False,
    minimized=False,
    background_color="#FFFFFF",
    text_select=True,
    zoomable=True,
    draggable=True,
)
webview.start(debug=True)