with open("app/couple_contact.css", "r", encoding="utf-8") as f:
    css = f.read()

# 1. Background and ambient
css = css.replace(
    "background: radial-gradient(circle at 50% 30%, #FAF2FE 0%, #F5E5FD 55%, #EED2FB 100%);\n  color: #3B0253;",
    "background: radial-gradient(circle at 50% 30%, #4a0468 0%, #2e0143 55%, #150022 100%);\n  color: #ffffff;"
)

css = css.replace(
    "background: radial-gradient(ellipse 65% 55% at 50% 40%, rgba(154, 38, 215, 0.12) 0%, transparent 75%);",
    "background: radial-gradient(ellipse 65% 55% at 50% 40%, rgba(198, 85, 253, 0.22) 0%, transparent 75%);"
)

css = css.replace(
    "background: #9A26D7;\n  box-shadow: 0 0 6px 1.5px rgba(154, 38, 215, 0.45);",
    "background: #C655FD;\n  box-shadow: 0 0 8px 2px rgba(198, 85, 253, 0.65);"
)

# 2. Eyebrow, Title & Subtitle
css = css.replace(
    "color: #9A26D7;\n  margin-bottom: 10px;",
    "color: #C655FD;\n  margin-bottom: 10px;"
)

css = css.replace(
    """  background: linear-gradient(135deg, #3B0253 0%, #3B0253 60%, #9A26D7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.contact-subtitle {""",
    """  background: linear-gradient(135deg, #ffffff 0%, #F3D8FF 45%, #C655FD 80%, #9A26D7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 4px 18px rgba(198, 85, 253, 0.4));
}

.contact-subtitle {"""
)

css = css.replace(
    "color: #68427B;\n  margin: 0 auto;\n}\n\n.contact-gold-divider",
    "color: #E9D5FF;\n  margin: 0 auto;\n}\n\n.contact-gold-divider"
)

css = css.replace(
    "background: linear-gradient(90deg, transparent, rgba(154, 38, 215, 0.45), transparent);",
    "background: linear-gradient(90deg, transparent, rgba(198, 85, 253, 0.5), transparent);"
)

# 3. Inside Heart
css = css.replace(
    "color: #9A26D7;\n  text-transform: uppercase;\n  margin-bottom: 4px;",
    "color: #C655FD;\n  text-transform: uppercase;\n  margin-bottom: 4px;"
)

css = css.replace(
    "color: #3B0253;\n  margin: 0 0 12px;",
    "color: #ffffff;\n  margin: 0 0 12px;"
)

css = css.replace(
    "color: #760EAB;\n  transition: all 0.25s ease;",
    "color: #F3D8FF;\n  transition: all 0.25s ease;"
)

css = css.replace(
    "color: #3B0253;\n  text-shadow: 0 0 16px rgba(154, 38, 215, 0.35);",
    "color: #ffffff;\n  text-shadow: 0 0 16px rgba(198, 85, 253, 0.8);"
)

# 4. Action Pills
css = css.replace(
    """  border: 1px solid rgba(154, 38, 215, 0.22);
  background: rgba(255, 255, 255, 0.9);
  color: #68427B;""",
    """  border: 1px solid rgba(198, 85, 253, 0.35);
  background: rgba(46, 1, 67, 0.78);
  color: #E9D5FF;"""
)

css = css.replace(
    """  background: rgba(154, 38, 215, 0.14);
  border-color: #9A26D7;
  color: #760EAB;""",
    """  background: rgba(198, 85, 253, 0.2);
  border-color: #C655FD;
  color: #ffffff;"""
)

# 5. Farewell Section
css = css.replace(
    "color: #9A26D7;\n  letter-spacing: 0.12em;\n  margin-bottom: 14px;",
    "color: #C655FD;\n  letter-spacing: 0.12em;\n  margin-bottom: 14px;"
)

css = css.replace(
    "color: #760EAB;\n  margin: 0 0 10px;",
    "color: #F3D8FF;\n  margin: 0 0 10px;"
)

css = css.replace(
    """  font-family: "Cinzel", "Cinzel Decorative", Georgia, serif;
  font-size: clamp(24px, 3.4vw, 34px);
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #3B0253;
  margin: 0 0 18px;
  background: linear-gradient(135deg, #3B0253 0%, #3B0253 60%, #9A26D7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;""",
    """  font-family: "Cinzel", "Cinzel Decorative", Georgia, serif;
  font-size: clamp(24px, 3.4vw, 34px);
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #ffffff;
  margin: 0 0 18px;
  background: linear-gradient(135deg, #ffffff 0%, #F3D8FF 45%, #C655FD 80%, #9A26D7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 4px 18px rgba(198, 85, 253, 0.4));"""
)

css = css.replace(
    "color: #68427B;\n  letter-spacing: 0.06em;\n  margin-bottom: 24px;",
    "color: #E9D5FF;\n  letter-spacing: 0.06em;\n  margin-bottom: 24px;"
)

css = css.replace(
    "color: #760EAB;\n}",
    "color: #F3D8FF;\n}"
)

css = css.replace(
    "color: rgba(154, 38, 215, 0.5);",
    "color: rgba(198, 85, 253, 0.6);"
)

css = css.replace(
    "color: #68427B;\n  margin: 0;",
    "color: #E9D5FF;\n  margin: 0;"
)

css = css.replace(
    "color: #760EAB;\n  letter-spacing: 0.08em;",
    "color: #ffffff;\n  letter-spacing: 0.08em;"
)

with open("app/couple_contact.css", "w", encoding="utf-8") as f:
    f.write(css)

print("couple_contact.css updated.")

# Update CoupleContactScene.tsx fillId gradient
with open("app/components/CoupleContactScene.tsx", "r", encoding="utf-8") as f:
    tsx = f.read()

old_fill = """                      <linearGradient id={fillId} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.96" />
                        <stop offset="50%" stopColor="#FAF2FE" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#F5E5FD" stopOpacity="0.98" />
                      </linearGradient>"""

new_fill = """                      <linearGradient id={fillId} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3d0356" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="#2e0143" stopOpacity="0.88" />
                        <stop offset="100%" stopColor="#190028" stopOpacity="0.92" />
                      </linearGradient>"""

tsx = tsx.replace(old_fill, new_fill)

with open("app/components/CoupleContactScene.tsx", "w", encoding="utf-8") as f:
    f.write(tsx)

print("CoupleContactScene.tsx updated.")
