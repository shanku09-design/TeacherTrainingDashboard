"""Render expanded, bilingual module walkthroughs for the local prototype.

Requires Pillow, edge-tts, and imageio-ffmpeg. The illustrated app views use
module names and flows from codebase/dashboard.html and assets/js/app.js. They
are designed screenshots, not live captures of a running browser session.
Only the narration text in narration-expanded.json is sent to Microsoft Speech.
"""
import asyncio
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

import edge_tts
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
W, H = 1920, 1080
FOREST, GREEN, LIME = "#123E35", "#176C55", "#B5D66D"
CANVAS, SURFACE, TEXT, MUTED, LINE = "#F2F4F3", "#FFFFFF", "#173B34", "#62756F", "#DCE5E1"
TEAL, BLUE, AMBER, PALE_GREEN = "#3B9277", "#5487A7", "#D7AA53", "#E8F1EA"
FONTS = Path("C:/Windows/Fonts")

SCENES = [
    {"role":"admin","active":"Admin dashboard","page":"Platform administration","sub":"Set-up, scheduling and data quality for the KGBV training programme","kind":"dashboard"},
    {"role":"admin","active":"Project","page":"Project","sub":"All training plans, batches and reports belong to this project","kind":"project"},
    {"role":"admin","active":"Batch upload","page":"Batch upload","sub":"Upload training schedules from Excel. Each row is checked before import.","kind":"batch"},
    {"role":"admin","active":"Programme summary","page":"Programme summary","sub":"Planned versus actual training for each teacher phase and the student programme","kind":"reports"},
    {"role":"trainer","active":"My work","page":"My work","sub":"Your assigned training and upcoming sessions","kind":"trainer"},
    {"role":"trainer","active":"Mark attendance","page":"Mark attendance","sub":"Mark each approved participant present or absent for this session","kind":"attendance"},
    {"role":"trainer","active":"Content library","page":"Content library","sub":"Resources linked to training plans and learning days","kind":"library"},
    {"role":"teacher","active":"My training","page":"My training","sub":"Your training journey, next session and learning resources","kind":"learner"},
    {"role":"teacher","active":"Assessment","page":"Assessment","sub":"Pre-training and post-training questions at the relevant phase","kind":"assessment"},
    {"role":"admin","active":"Admin dashboard","page":"One programme, three perspectives","sub":"Programme oversight · session delivery · learner progress","kind":"summary"}
]

NAV = {
    "admin": ["Admin dashboard", "Project", "Training plans", "Batch upload", "Trainers & availability", "Holiday calendar", "Certificate template", "Content library", "Reports", "Users & audit"],
    "trainer": ["My work", "Mark attendance", "Participants & registration", "Training plan", "Content library"],
    "teacher": ["My training", "Assessment", "Feedback", "Certificates", "Learning resources", "Register for a batch"]
}


def F(size, bold=False, hindi=False):
    name = "NirmalaB.ttf" if hindi and bold else "Nirmala.ttf" if hindi else "segoeuib.ttf" if bold else "segoeui.ttf"
    path = FONTS / name
    if not path.exists():
        path = FONTS / ("segoeuib.ttf" if bold else "segoeui.ttf")
    return ImageFont.truetype(str(path), size)


def box(d, xy, fill=SURFACE, outline=LINE, radius=12, width=1):
    d.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def txt(d, xy, value, size=18, color=TEXT, bold=False, hindi=False, anchor=None):
    d.text(xy, value, font=F(size, bold, hindi), fill=color, anchor=anchor)


def lines(d, xy, values, size=16, color=TEXT, gap=27, bold=False):
    x, y = xy
    for value in values:
        txt(d, (x, y), value, size, color, bold)
        y += gap


def label(d, x, y, value):
    txt(d, (x, y), value.upper(), 12, MUTED, True)


def kpi(d, x, y, w, heading, value, note, color=GREEN):
    box(d, (x, y, x+w, y+91))
    d.rounded_rectangle((x, y, x+5, y+91), radius=3, fill=color)
    txt(d, (x+18, y+13), heading, 14, MUTED)
    txt(d, (x+18, y+33), value, 25, TEXT, True)
    txt(d, (x+18, y+66), note, 12, MUTED)


def table(d, x, y, widths, headers, rows, row_h=39, font_size=13):
    total = sum(widths)
    d.rectangle((x, y, x+total, y+36), fill="#EDF2EF")
    xx = x
    for w, h in zip(widths, headers):
        txt(d, (xx+9, y+10), h, font_size, MUTED, True)
        xx += w
    for ri, row in enumerate(rows):
        yy = y+36+ri*row_h
        d.line((x, yy, x+total, yy), fill=LINE)
        xx = x
        for ci, (w, cell) in enumerate(zip(widths, row)):
            color = GREEN if isinstance(cell, tuple) and cell[0] == "green" else BLUE if isinstance(cell, tuple) and cell[0] == "blue" else AMBER if isinstance(cell, tuple) and cell[0] == "amber" else TEXT
            value = cell[1] if isinstance(cell, tuple) else str(cell)
            txt(d, (xx+9, yy+10), value[:max(8, int(w/7))], font_size, color, ci == 0 or isinstance(cell, tuple))
            xx += w
    d.rectangle((x, y, x+total, y+36+len(rows)*row_h), outline=LINE, width=1)


def base_screen(scene, idx, total, lang):
    is_hi = lang == "hindi"
    img = Image.new("RGB", (W, H), CANVAS)
    d = ImageDraw.Draw(img)
    # Cinematic frame and chapter heading.
    d.rectangle((0, 0, W, 14), fill=GREEN)
    d.ellipse((1640, -260, 2140, 250), fill=PALE_GREEN)
    txt(d, (80, 47), "TEACHER TRAINING TRACKER", 20, FOREST, True)
    txt(d, (1840, 48), "ENGLISH WALKTHROUGH" if not is_hi else "हिन्दी में डेमो", 18, GREEN, True, is_hi, "ra")
    txt(d, (82, 92), f"MODULE {idx+1:02d}  /  {total:02d}", 15, GREEN, True)
    title = scene["title"]
    txt(d, (82, 119), title, 35 if not is_hi else 32, TEXT, True, is_hi)
    # Application panel, designed to match the local prototype's palette and shell.
    x0, y0, x1, y1 = 78, 188, 1842, 965
    box(d, (x0, y0, x1, y1), SURFACE, "#D6E0DB", 22, 2)
    # sidebar
    d.rounded_rectangle((x0, y0, x0+263, y1), radius=20, fill=FOREST)
    d.rectangle((x0+245, y0, x0+263, y1), fill=FOREST)
    d.ellipse((x0+20, y0+20, x0+63, y0+63), fill=LIME)
    txt(d, (x0+31, y0+30), "TT", 16, FOREST, True)
    txt(d, (x0+75, y0+25), "Training Tracker", 17, SURFACE, True)
    txt(d, (x0+75, y0+47), "KGBV Digital Classrooms", 11, "#C1D4CA")
    box(d, (x0+17, y0+89, x0+245, y0+150), "#1A4C40", "#2B5C50", 9, 1)
    label(d, x0+29, y0+101, "Viewing as")
    txt(d, (x0+29, y0+123), {"admin":"Admin","trainer":"Trainer · Rohan Verma","teacher":"Trainee · Anita Y."}[scene["role"]], 13, SURFACE, True)
    current = scene["active"]
    y = y0+174
    for item in NAV[scene["role"]]:
        if item in ("Training plans", "Content library", "Reports", "Users & audit"):
            if scene["role"] == "admin" and item == "Content library":
                y += 9
                txt(d, (x0+25, y), "CONTENT", 10, "#9FB8AC", True)
                y += 21
            elif scene["role"] == "admin" and item == "Reports":
                y += 7
                txt(d, (x0+25, y), "REPORTS", 10, "#9FB8AC", True)
                y += 21
        if item == current:
            box(d, (x0+14, y-4, x0+247, y+31), "#255D4F", None, 8, 0)
        d.ellipse((x0+28, y+7, x0+37, y+16), fill=LIME if item == current else "#739487")
        txt(d, (x0+48, y+3), item, 13, SURFACE if item == current else "#D1DED8", item == current)
        y += 39
    txt(d, (x0+20, y1-72), "Interactive demo · sample data", 10, "#C1D4CA")
    txt(d, (x0+20, y1-50), "Switch light/dark     Sign out", 10, "#C1D4CA")
    # toolbar
    mx = x0+263
    d.rectangle((mx, y0, x1, y0+54), fill="#FBFCFB")
    d.line((mx, y0+54, x1, y0+54), fill=LINE)
    txt(d, (mx+28, y0+18), f"Home  /  {scene['page']}", 13, MUTED)
    txt(d, (x1-38, y0+18), "State  All states     Data as of  14 Oct 2026", 12, MUTED, False, anchor="ra")
    # heading inside page
    px, py = mx+28, y0+78
    txt(d, (px, py), scene["page"], 24, TEXT, True)
    txt(d, (px, py+33), scene["sub"][:105], 12, MUTED)
    return img, d, px, py+66, x1-mx-56


def draw_chart(d, x, y, w, h, bars=7):
    d.line((x, y+h, x+w, y+h), fill=LINE, width=2)
    d.line((x, y, x, y+h), fill=LINE, width=1)
    for i in range(1, 4):
        yy = y + h*i/4
        d.line((x, yy, x+w, yy), fill="#EDF1EF", width=1)
    colors = [GREEN, TEAL, BLUE, LIME, AMBER]
    bar_w = max(22, int(w/(bars*1.8)))
    for i in range(bars):
        bh = int(h*(.32+((i*19)%53)/100))
        bx = x+20+i*(w-40)//bars
        d.rounded_rectangle((bx, y+h-bh, bx+bar_w, y+h), radius=5, fill=colors[i%len(colors)])


def draw_content(img, d, x, y, w, kind):
    if kind == "dashboard":
        kw=(w-30)//3
        kpi(d,x,y,kw,"KGBVs commissioned","— / 750","Across 13 states")
        kpi(d,x+kw+15,y,kw,"Teacher batches","—","Initial and refresher training",BLUE)
        kpi(d,x+2*(kw+15),y,kw,"Student batches","—","Digital skills programme",AMBER)
        kpi(d,x,y+105,kw,"Batches past deadline","—","Review schedule",AMBER)
        kpi(d,x+kw+15,y+105,kw,"Trainer conflicts","—","Review availability",BLUE)
        kpi(d,x+2*(kw+15),y+105,kw,"Active trainers","—","Trainer coverage",GREEN)
        py=y+220
        box(d,(x,py,x+w*.58,py+278))
        txt(d,(x+18,py+15),"Programme timeline",18,TEXT,True)
        labels=["Phase 1 · Orientation","Phase 2 · Device & content","Phase 3 · Digital skills","Refresher I","Refresher II"]
        for i,t in enumerate(labels):
            yy=py+57+i*39
            txt(d,(x+18,yy),t,12,MUTED)
            d.rounded_rectangle((x+210,yy+1,x+w*.52,yy+16),radius=7,fill="#E7EEEA")
            d.rounded_rectangle((x+210,yy+1,x+260+(i*67)%(int(w*.3)),yy+16),radius=7,fill=[GREEN,TEAL,BLUE,AMBER,"#8B6BC2"][i])
        rx=x+w*.61
        box(d,(rx,py,x+w,py+278))
        txt(d,(rx+18,py+15),"Progress by state",18,TEXT,True)
        for i,state in enumerate(["Uttar Pradesh","Andhra Pradesh","Telangana","Jharkhand","Rajasthan"]):
            yy=py+55+i*40
            txt(d,(rx+17,yy),state,12,MUTED)
            d.rounded_rectangle((rx+170,yy+3,x+w-16,yy+16),radius=6,fill="#E7EEEA")
            d.rounded_rectangle((rx+170,yy+3,rx+196+((i*57)%190),yy+16),radius=6,fill=TEAL)
    elif kind == "project":
        colw=(w-24)//2
        box(d,(x,y,x+colw,y+255))
        txt(d,(x+20,y+17),"Digital Classrooms in 750 KGBVs",18,TEXT,True)
        for i,(a,b) in enumerate([("Project code","ERN-KGBV-26"),("Scope","750 KGBVs · 13 states"),("Digital classrooms","1,500"),("Teacher training","7,500 teachers · 25 hours"),("Student programme","75,000 students · 15 hours"),("Project end","Aug 2029")]):
            yy=y+58+i*31
            txt(d,(x+18,yy),a,12,MUTED)
            txt(d,(x+colw-16,yy),b,12,TEXT,True,anchor="ra")
            d.line((x+17,yy+25,x+colw-16,yy+25),fill="#E8EEEB")
        xx=x+colw+24
        box(d,(xx,y,x+w,y+255))
        txt(d,(xx+18,y+17),"Schools by state",18,TEXT,True)
        table(d,xx+17,y+52,[210,78,90,95],["State","KGBVs","Teachers","Students"],[["Andhra Pradesh","196","1,960","19,600"],["Uttar Pradesh","180","1,800","18,000"],["Telangana","165","1,650","16,500"],["Jharkhand","46","460","4,600"]],31,11)
        box(d,(x,y+276,x+w,y+568))
        txt(d,(x+18,y+291),"Training plans",18,TEXT,True)
        table(d,x+17,y+327,[420,110,110,290,250],["Training plan","Audience","Hours","Window","Status"],[
            ["Phase 1 · Orientation","Teachers","2 h","Nov–Dec 2026",("green","Planned")],
            ["Phase 2 · Device & content use","Teachers","8 h","Nov 2026–Feb 2027",("blue","Planned")],
            ["Phase 3 · Digital skills","Joint","5 h","Dec 2026–Feb 2027",("blue","Planned")],
            ["Refresher I","Teachers","5 h","Nov 2027–Jan 2028",("amber","Later")],
            ["Refresher II","Teachers","5 h","May–Jul 2028",("amber","Later")]
        ],38,11)
    elif kind == "batch":
        leftw=w*.56
        box(d,(x,y,x+leftw,y+206))
        txt(d,(x+18,y+17),"Upload training schedule",17,TEXT,True)
        d.rounded_rectangle((x+18,y+52,x+leftw-18,y+142),radius=12,fill="#F8FBF9",outline="#B8C9C1",width=2)
        txt(d,(x+42,y+68),"Choose an Excel file",17,GREEN,True)
        txt(d,(x+42,y+99),".xlsx, .xls or .csv · up to 5 MB",12,MUTED)
        txt(d,(x+42,y+122),"Run validation on sample file",12,BLUE,True)
        txt(d,(x+18,y+170),"Each row is checked before import",12,MUTED)
        rx=x+leftw+18
        box(d,(rx,y, x+w,y+206))
        txt(d,(rx+18,y+17),"Trainer availability",17,TEXT,True)
        for i,(n,state,avail) in enumerate([("Rohan Verma","Uttar Pradesh","Available"),("Neha Srivastava","Uttar Pradesh","Check dates"),("Meera Iyer","Andhra Pradesh","Available"),("Pooja Tirkey","Jharkhand","Available")]):
            yy=y+54+i*35
            txt(d,(rx+17,yy),n,12,TEXT,True)
            txt(d,(rx+205,yy),state,11,MUTED)
            txt(d,(x+w-95,yy),("Available" if avail=="Available" else "Review"),11,GREEN if avail=="Available" else "#B17A29",True,anchor="ra")
        box(d,(x,y+223,x+w,y+568))
        txt(d,(x+18,y+239),"Validation preview · sample schedule",17,TEXT,True)
        table(d,x+17,y+278,[190,265,150,200,205,150],["Batch","Training plan","Start date","KGBV / cluster","Trainer","Validation"],[
            ["T1-UP-C01","Phase 1 · Orientation","04 Nov 2026","Bahraich","Rohan Verma",("green","Ready")],
            ["T2-UP-C01","Device & content use","12 Nov 2026","Bahraich","Rohan Verma",("green","Ready")],
            ["T1-UP-C02","Phase 1 · Orientation","18 Nov 2026","Shravasti","Neha Srivastava",("amber","Review")],
            ["T3-TS-C01","Digital skills","02 Dec 2026","Adilabad","Rohan Verma",("amber","Check")],
        ],46,11)
    elif kind == "reports":
        box(d,(x,y,x+w,y+65))
        for i,(a,b) in enumerate([("State","All states"),("From","01 Sep 2026"),("To","14 Oct 2026"),("Training","All training"),("Status","All statuses")]):
            xx=x+14+i*(w-25)//5
            label(d,xx,y+9,a)
            box(d,(xx,y+28,xx+(w-40)//5,y+55),"#FAFCFA",LINE,6,1)
            txt(d,(xx+7,y+34),b,11,TEXT)
        kw=(w-36)//4
        for i,(a,b,note) in enumerate([("Programme summary","13 states","Training scope"),("School readiness","Coverage","By state and district"),("Batch performance","Planned / actual","By training phase"),("Attendance","By session","Participant exceptions")]):
            kpi(d,x+i*(kw+12),y+80,kw,a,b,note,[GREEN,BLUE,TEAL,AMBER][i])
        box(d,(x,y+184,x+w*.58,y+568))
        txt(d,(x+18,y+199),"Monthly training trend · sample view",16,TEXT,True)
        draw_chart(d,x+32,y+250,w*.52,235,7)
        for i,m in enumerate(["Sep","Oct","Nov","Dec","Jan","Feb","Mar"]): txt(d,(x+33+i*(w*.52/7),y+496),m,10,MUTED)
        rx=x+w*.61
        box(d,(rx,y+184,x+w,y+568))
        txt(d,(rx+18,y+199),"Progress by state",16,TEXT,True)
        for i,s in enumerate(["Uttar Pradesh","Andhra Pradesh","Telangana","Jharkhand","Rajasthan","Assam"]):
            yy=y+245+i*48
            txt(d,(rx+18,yy),s,12,MUTED)
            d.rounded_rectangle((rx+158,yy+2,x+w-20,yy+16),radius=6,fill="#E8EEEB")
            d.rounded_rectangle((rx+158,yy+2,rx+190+(i*67)%210,yy+16),radius=6,fill=[GREEN,TEAL,BLUE,LIME,AMBER][i%5])
            txt(d,(x+w-23,yy-3),"Details →",10,BLUE,anchor="ra")
    elif kind == "trainer":
        kw=(w-36)//4
        for i,(a,b,n) in enumerate([("Assigned batches","Next 15","Upcoming work"),("Participants","Review list","Registration"),("Training plan","Day-wise","Activities & resources"),("Attendance","Session by session","Save present / absent")]):
            kpi(d,x+i*(kw+12),y,kw,a,b,n,[GREEN,BLUE,TEAL,AMBER][i])
        box(d,(x,y+108,x+w,y+568))
        txt(d,(x+18,y+124),"Next 15 batches",17,TEXT,True)
        table(d,x+16,y+165,[150,245,195,170,230,175,140],["Batch","Training plan","KGBV / cluster","Start date","Participants","Session","Status"],[
            ["T1-UP-C01","Phase 1 · Orientation","Bahraich","04 Nov 2026","10 teachers","Day 1 · 2 h",("blue","Upcoming")],
            ["T2-UP-C01","Device & content use","Bahraich","12 Nov 2026","10 teachers","Day 1 · 4 h",("blue","Upcoming")],
            ["T1-UP-C02","Phase 1 · Orientation","Shravasti","18 Nov 2026","10 teachers","Day 1 · 2 h",("blue","Upcoming")],
            ["T3-UP-C01","Digital skills","Bahraich","02 Dec 2026","20 learners","Joint",("amber","Planned")],
            ["T4-UP-C01","Refresher I","Bahraich","12 Nov 2027","10 teachers","Day 1 · 5 h",("amber","Later")]
        ],49,11)
        box(d,(x,y+496,x+w,y+555),"#F5F9F6",None)
        txt(d,(x+18,y+510),"Quick actions",12,MUTED,True)
        for i,s in enumerate(["Participants & registration","Training plan","Mark attendance","Content library"]):
            xx=x+150+i*235
            box(d,(xx,y+506,xx+220,y+542),SURFACE,LINE,8)
            txt(d,(xx+11,y+517),s,11,GREEN,True)
    elif kind == "attendance":
        box(d,(x,y,x+w,y+59))
        for i,(a,b) in enumerate([("Batch","T1-UP-C01 · Bahraich"),("Training date","04 Nov 2026")]):
            xx=x+15+i*440
            label(d,xx,y+7,a)
            box(d,(xx,y+27,xx+405,y+50),"#FBFCFB",LINE,5)
            txt(d,(xx+8,y+31),b,11,TEXT)
        kw=(w-24)//3
        kpi(d,x,y+73,kw,"Participants","10","Approved for this session")
        kpi(d,x+kw+12,y+73,kw,"Attendance","8 present","2 absent",BLUE)
        kpi(d,x+2*(kw+12),y+73,kw,"Training plan","Day 1 · 2 hours","Orientation",AMBER)
        box(d,(x,y+182,x+w,y+568))
        txt(d,(x+18,y+196),"Attendance register · sample participants",16,TEXT,True)
        table(d,x+15,y+233,[70,215,210,220,190,135,170],["#","Participant","KGBV","Training plan","Mobile","Present","Absent"],[
            ["01","Anita Y.","KGBV Bahraich 1","Orientation","9•••••••12",("green","●"),"○"],
            ["02","Sunita D.","KGBV Bahraich 1","Orientation","9•••••••35",("green","●"),"○"],
            ["03","Kavita K.","KGBV Bahraich 1","Orientation","9•••••••71","○",("amber","●")],
            ["04","Pooja S.","KGBV Bahraich 1","Orientation","9•••••••48",("green","●"),"○"],
            ["05","Shalini R.","KGBV Bahraich 1","Orientation","9•••••••20",("green","●"),"○"],
        ],47,11)
        box(d,(x+w-230,y+510,x+w-15,y+551),GREEN,None,8)
        txt(d,(x+w-122,y+523),"Save attendance",12,SURFACE,True,anchor="mm")
    elif kind == "library":
        box(d,(x,y,x+w,y+55))
        label(d,x+15,y+7,"Audience"); txt(d,(x+15,y+29),"Teachers and students",12,TEXT)
        label(d,x+285,y+7,"Training plan"); txt(d,(x+285,y+29),"All training",12,TEXT)
        label(d,x+560,y+7,"Resource type"); txt(d,(x+560,y+29),"All types",12,TEXT)
        label(d,x+835,y+7,"Search"); txt(d,(x+835,y+29),"Find a resource",12,TEXT)
        titles=[("PDF","Operations Guide: Digital Teaching Device","Phase 1 · English","3.1 MB"),("VIDEO","Using the Digital Teaching Device","Phase 2 · English","Preview"),("PRESENTATION","Digital Classroom Solution · Orientation Deck","Phase 1 · English","4.1 MB"),("FORM","Pre-training Assessment · Teachers","Phase 1 · 10 questions","Interactive"),("VIDEO","Troubleshooting Common Device Issues","Refresher I · Hindi","Preview"),("PACKAGE","Self-paced Digital Learning Modules","Students · English","Interactive")]
        cw=(w-28)//3
        for i,(typ,name,info,size) in enumerate(titles):
            col=i%3; row=i//3; xx=x+col*(cw+14); yy=y+75+row*230
            box(d,(xx,yy,xx+cw,yy+210))
            band=[GREEN,BLUE,TEAL,AMBER,"#8B6BC2",FOREST][i]
            d.rounded_rectangle((xx,yy,xx+cw,yy+69),radius=12,fill=band)
            d.rectangle((xx,yy+56,xx+cw,yy+69),fill=band)
            txt(d,(xx+17,yy+15),typ,12,SURFACE,True)
            txt(d,(xx+17,yy+88),name[:41],14,TEXT,True)
            txt(d,(xx+17,yy+119),info,12,MUTED)
            txt(d,(xx+17,yy+151),size,11,MUTED)
            box(d,(xx+17,yy+171,xx+138,yy+197),"#EDF5F0",None,6)
            txt(d,(xx+28,yy+177),"Open preview",10,GREEN,True)
    elif kind == "learner":
        box(d,(x,y,x+w,y+116),FOREST,None,14,0)
        txt(d,(x+22,y+17),"Hello, Anita",22,SURFACE,True)
        txt(d,(x+22,y+53),"TT-UP00101 · KGBV Bahraich 1 · 5 of 25 training hours completed",13,"#D2E3DA")
        labels=["Orientation","Device & content","Digital skills","Refresher I","Refresher II"]
        widths=[1,4,1,1,1]; total=sum(widths); offset=x+22
        for i,(name,wt) in enumerate(zip(labels,widths)):
            sw=(w-44)*(wt/total)
            txt(d,(offset,y+79),f"Phase {i+1} · {name}",10,SURFACE,True)
            d.rounded_rectangle((offset,y+98,offset+sw-10,y+106),radius=4,fill="#56766C")
            d.rounded_rectangle((offset,y+98,offset+max(12,(sw-10)*(.7 if i==0 else .18 if i==1 else .04)),y+106),radius=4,fill=LIME)
            offset+=sw
        col=(w-28)//3
        # session card, resources and progress card
        for j,(head,body) in enumerate([("My training","Phase 1 · Orientation\n04 Nov 2026 · 2 hours\nKGBV Bahraich 1\nTrainer: Rohan Verma"),("Before you start","Operations Guide · PDF\nOrientation Deck · PPT\nPre-training assessment\nFeedback opens on day 1"),("My progress","Phase 1 · Orientation · Live\nPhase 2 · Device & content\nPhase 3 · Digital skills\nCertificates · View progress")]):
            xx=x+j*(col+14); yy=y+137
            box(d,(xx,yy,xx+col,yy+340))
            txt(d,(xx+17,yy+16),head,16,TEXT,True)
            for i,line in enumerate(body.split("\n")):
                if i==0 and j==0:
                    box(d,(xx+14,yy+55,xx+col-14,yy+105),"#F2F7F4",None,7,0)
                yline=yy+64+i*54 if j!=1 else yy+62+i*56
                txt(d,(xx+19,yline),line,12,GREEN if i==0 else MUTED,i==0)
                d.line((xx+15,yline+30,xx+col-15,yline+30),fill="#EBF0ED")
            if j==1:
                box(d,(xx+16,yy+285,xx+col-16,yy+320),GREEN,None,7)
                txt(d,(xx+col/2,yy+294),"Open learning resources",11,SURFACE,True,anchor="ma")
    elif kind == "assessment":
        col=(w-26)//2
        box(d,(x,y,x+col,y+450))
        txt(d,(x+20,y+18),"Assessment · sample form",17,TEXT,True)
        txt(d,(x+20,y+49),"Answer each question, then submit your response.",12,MUTED)
        questions=[("1. A good technology-enabled lesson starts with…",["The learning objective","Choosing a video","The device brand"]),("2. How can you check understanding?",["Short in-class quiz","Skip questions","Longer video"]),("3. Store student data in…",["Approved school system","Public folder","Messaging group"])]
        for i,(q,opts) in enumerate(questions):
            yy=y+88+i*105
            txt(d,(x+20,yy),q,13,TEXT,True)
            for j,o in enumerate(opts):
                d.ellipse((x+22,yy+27+j*22,x+34,yy+39+j*22),outline=GREEN,width=2,fill=GREEN if j==0 else SURFACE)
                txt(d,(x+44,yy+26+j*22),o,11,MUTED)
        box(d,(x+20,y+415,x+153,y+443),GREEN,None,6,0)
        txt(d,(x+86,y+421),"Submit assessment",10,SURFACE,True,anchor="ma")
        xx=x+col+16
        box(d,(xx,y,xx+col,y+214))
        txt(d,(xx+19,y+17),"Session feedback",17,TEXT,True)
        txt(d,(xx+19,y+50),"How useful was today’s session?",12,MUTED)
        for i in range(5):
            bx=xx+18+i*53
            box(d,(bx,y+78,bx+45,y+119),"#F4F7F5",LINE,7)
            txt(d,(bx+22,y+88),str(i+1),15,GREEN,True,anchor="ma")
        txt(d,(xx+19,y+143),"Anything we should improve?",11,MUTED)
        box(d,(xx+18,y+164,xx+col-20,y+196),"#FBFCFB",LINE,6)
        box(d,(xx+18,y+221,xx+col-20,y+450))
        txt(d,(xx+36,y+238),"Certificates",17,TEXT,True)
        for i,(name,desc,pctg) in enumerate([("Initial training · Modules 1–3","15 hours · due by Mar 2027",.62),("Full programme · 25 hours","After Refresher II",.24)]):
            yy=y+286+i*75
            txt(d,(xx+36,yy),name,13,TEXT,True)
            txt(d,(xx+36,yy+25),desc,11,MUTED)
            d.rounded_rectangle((xx+36,yy+48,xx+col-35,yy+57),radius=4,fill="#E7EEEA")
            d.rounded_rectangle((xx+36,yy+48,xx+36+int((col-71)*pctg),yy+57),radius=4,fill=GREEN)
    elif kind == "certificate":
        col=(w-30)//2
        box(d,(x,y,x+col,y+540))
        txt(d,(x+22,y+19),"Certificate progress",18,TEXT,True)
        txt(d,(x+22,y+52),"Issued when training and required criteria are complete",12,MUTED)
        for i,(title,sub,pctg,state) in enumerate([("Initial training · Modules 1–3","15 hours · due by 01 Mar 2027",.67,"2 of 3 phases done"),("Full programme · 25 hours","After Refresher II",.24,"1 of 5 phases done")]):
            yy=y+110+i*175
            box(d,(x+18,yy,x+col-18,yy+145),"#FAFCFB")
            txt(d,(x+35,yy+17),title,14,TEXT,True)
            txt(d,(x+35,yy+47),sub,11,MUTED)
            d.rounded_rectangle((x+35,yy+77,x+col-35,yy+89),radius=5,fill="#E6EEEA")
            d.rounded_rectangle((x+35,yy+77,x+35+int((col-70)*pctg),yy+89),radius=5,fill=GREEN)
            txt(d,(x+35,yy+105),state,11,BLUE,True)
        txt(d,(x+22,y+485),"Attendance and assessment thresholds are demo placeholders.",11,MUTED)
        xx=x+col+16
        # diploma-like sample certificate
        box(d,(xx,y,xx+w-col-16,y+540),"#FBFCF8","#CED9CD",18,2)
        d.rectangle((xx+15,y+15,x+w-25,y+26),fill=LIME)
        txt(d,(xx+(w-col-16)/2,y+70),"TRAINING CERTIFICATE",15,GREEN,True,anchor="ma")
        txt(d,(xx+(w-col-16)/2,y+119),"Certificate of completion",25,FOREST,True,anchor="ma")
        txt(d,(xx+(w-col-16)/2,y+175),"This certifies that",13,MUTED,anchor="ma")
        txt(d,(xx+(w-col-16)/2,y+221),"Anita Yadav",27,FOREST,True,anchor="ma")
        txt(d,(xx+(w-col-16)/2,y+270),"has completed the initial teacher training",13,MUTED,anchor="ma")
        txt(d,(xx+(w-col-16)/2,y+299),"KGBV Digital Classrooms · 15 hours",13,MUTED,anchor="ma")
        d.line((xx+80,y+405,x+w-col-96,y+405),fill="#AAB9B0",width=1)
        txt(d,(xx+110,y+417),"Programme Director",11,MUTED,anchor="ma")
        txt(d,(x+w-col-75,y+417),"Sample preview",11,GREEN,True,anchor="ma")
    elif kind == "summary":
        roles=[
            ("ADMIN","Programme oversight",["Project and training plans","Batch and trainer setup","Reports and monitoring"],GREEN),
            ("TRAINER","Session delivery",["My Work and assigned batches","Participants and attendance","Training plan and resources"],BLUE),
            ("TRAINEE","Learner progress",["My Training and next session","Assessment and feedback","Certificate progress"],TEAL)
        ]
        cw=(w-56)//3
        for i,(role,head,items,color) in enumerate(roles):
            xx=x+i*(cw+28)
            box(d,(xx,y+28,xx+cw,y+395))
            d.rounded_rectangle((xx,y+28,xx+cw,y+115),radius=12,fill=color)
            d.rectangle((xx,y+98,xx+cw,y+115),fill=color)
            txt(d,(xx+20,y+45),role,12,"#EAF4EF",True)
            txt(d,(xx+20,y+68),head,19,SURFACE,True)
            for j,item in enumerate(items):
                yy=y+147+j*65
                d.ellipse((xx+20,yy+3,xx+41,yy+24),fill=LIME if j==0 else "#E6EFEA")
                txt(d,(xx+30,yy+4),"✓",12,FOREST,True,anchor="ma")
                txt(d,(xx+53,yy),item,13,TEXT,True)
                d.line((xx+20,yy+43,xx+cw-20,yy+43),fill="#E9EFEC")
        for i in (1,2):
            ax=x+i*(cw+28)-21
            txt(d,(ax,y+205),"→",23,GREEN,True,anchor="mm")
        box(d,(x+140,y+458,x+w-140,y+537),"#EDF5F0",None,12,0)
        txt(d,(x+w/2,y+480),"SAMPLE DATA · BROWSER-BASED PROTOTYPE",13,GREEN,True,anchor="ma")
        txt(d,(x+w/2,y+505),"Three role views connect one training journey",12,MUTED,anchor="ma")


def make_slide(scene, chapter, total, lang):
    im, d, x, y, w = base_screen(scene, chapter, total, lang)
    draw_content(im, d, x, y, w, scene["kind"])
    # On-screen callout clarifies the illustrated panel is grounded in the local demo prototype.
    txt(d, (1810, 937), "PROTOTYPE SAMPLE VIEW", 10, MUTED, True, anchor="ra")
    # chapter progress rule
    d.rounded_rectangle((80, 1001, 1840, 1010), radius=5, fill="#DDE6E1")
    d.rounded_rectangle((80, 1001, 80+int(1760*(chapter+1)/total), 1010), radius=5, fill=GREEN)
    return im


def stamp(seconds):
    ms = max(0, int(round(seconds*1000)))
    h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


def sentences(value, lang):
    parts = re.split(r"(?<=[.!?।])\s+", value.strip())
    return [p.strip() for p in parts if p.strip()] or [value.strip()]


async def main():
    data = json.loads((ROOT / "narration-expanded.json").read_text(encoding="utf-8"))
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    language_voices = [("english", "en-IN-NeerjaNeural"), ("hindi", "hi-IN-SwaraNeural")]
    if len(sys.argv) > 1:
        language_voices = [item for item in language_voices if item[0] == sys.argv[1].lower()]
        if not language_voices:
            raise SystemExit("Usage: build_expanded_demo.py [english|hindi]")
    for lang, voice in language_voices:
        slides = SCENES
        narration = data[lang]
        work = ROOT / f".expanded_{lang}_render"
        if work.exists():
            shutil.rmtree(work)
        work.mkdir()
        clips, cues, offset = [], [], 0.0
        for i, (screen, script) in enumerate(zip(slides, narration)):
            print(f"{lang}: rendering module {i+1}/{len(slides)}", flush=True)
            audio = work / f"audio_{i+1:02}.mp3"
            await asyncio.wait_for(edge_tts.Communicate(script["voice"], voice, rate="-3%").save(str(audio)), timeout=50)
            png = work / f"screen_{i+1:02}.png"
            make_slide({**screen, "title": script["title"]}, i, len(slides), lang).save(png, quality=95)
            probe = subprocess.run([ffmpeg,"-i",str(audio),"-f","null","-"],capture_output=True,text=True)
            mt = re.search(r"Duration: (\d+):(\d+):(\d+(?:\.\d+)?)", probe.stderr)
            duration = (int(mt.group(1))*3600+int(mt.group(2))*60+float(mt.group(3)) if mt else 15.0)+0.6
            clip = work / f"clip_{i+1:02}.mp4"
            subprocess.run([ffmpeg,"-y","-loop","1","-framerate","25","-i",str(png),"-i",str(audio),"-t",f"{duration:.3f}","-vf","format=yuv420p","-c:v","libx264","-preset","medium","-crf","21","-c:a","aac","-b:a","160k","-ar","48000","-shortest",str(clip)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
            parts = sentences(script["voice"],lang)
            weight = sum(max(1,len(p)) for p in parts)
            cursor = offset
            for p in parts:
                span = (duration-.4)*len(p)/weight
                cues.append((cursor,cursor+span,p))
                cursor += span
            offset += duration
            clips.append(clip)
        concat = work / "concat.txt"
        concat.write_text("".join(f"file '{c.as_posix()}'\n" for c in clips),encoding="utf-8")
        suffix = "english" if lang=="english" else "hindi"
        video = ROOT / f"teacher-training-tracker-modules-{suffix}.mp4"
        subprocess.run([ffmpeg,"-y","-f","concat","-safe","0","-i",str(concat),"-c","copy","-movflags","+faststart",str(video)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
        srt = []
        for n,(a,b,caption) in enumerate(cues,1):
            srt += [str(n),f"{stamp(a)} --> {stamp(b)}",caption,""]
        (ROOT/f"teacher-training-tracker-modules-{suffix}.srt").write_text("\n".join(srt),encoding="utf-8-sig")
        print(f"Created {video.name} ({offset/60:.1f} minutes), voice {voice}",flush=True)
        shutil.rmtree(work)


if __name__ == "__main__":
    asyncio.run(main())
