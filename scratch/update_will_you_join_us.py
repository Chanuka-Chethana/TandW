with open("app/will_you_join_us.css", "r", encoding="utf-8") as f:
    css = f.read()

# 1. Scene background
css = css.replace(
    "background: radial-gradient(circle at 50% 35%, #FAF2FE 0%, #F5E5FD 55%, #EED2FB 100%);\n  color: #3B0253;",
    "background: radial-gradient(circle at 50% 35%, #4a0468 0%, #2e0143 45%, #150022 100%);\n  color: #ffffff;"
)

# 2. Ambient glow
css = css.replace(
    "background: radial-gradient(ellipse 65% 55% at 50% 45%, rgba(154, 38, 215, 0.12) 0%, transparent 75%);",
    "background: radial-gradient(ellipse 65% 55% at 50% 45%, rgba(198, 85, 253, 0.22) 0%, transparent 75%);"
)

# 3. Ornament & eyebrow
css = css.replace(
    "color: #9A26D7;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  filter: drop-shadow(0 0 12px rgba(154, 38, 215, 0.45));",
    "color: #C655FD;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  filter: drop-shadow(0 0 16px rgba(198, 85, 253, 0.65));"
)

css = css.replace(
    "color: #9A26D7;\n  margin: 0 0 14px 0;",
    "color: #C655FD;\n  margin: 0 0 14px 0;"
)

# 4. Title & subtitle
css = css.replace(
    "background: linear-gradient(135deg, #3B0253 0%, #760EAB 45%, #9A26D7 75%, #9A26D7 100%);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  filter: drop-shadow(0 4px 16px rgba(154, 38, 215, 0.25));",
    "background: linear-gradient(135deg, #ffffff 0%, #F3D8FF 40%, #C655FD 80%, #9A26D7 100%);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  filter: drop-shadow(0 4px 20px rgba(198, 85, 253, 0.45));"
)

css = css.replace(
    "color: #68427B;\n  margin: 0;\n  max-width: 580px;",
    "color: #E9D5FF;\n  margin: 0;\n  max-width: 580px;"
)

# 5. Divider
css = css.replace(
    "background: linear-gradient(90deg, transparent, rgba(154, 38, 215, 0.5), transparent);",
    "background: linear-gradient(90deg, transparent, rgba(198, 85, 253, 0.6), transparent);"
)

# 6. Card typography & CTA
css = css.replace(
    "color: #3B0253;\n  margin: 0 0 12px 0;",
    "color: #ffffff;\n  margin: 0 0 12px 0;"
)

css = css.replace(
    "color: #68427B;\n  margin: 0 0 24px 0;",
    "color: #E9D5FF;\n  margin: 0 0 24px 0;"
)

css = css.replace(
    "border: 1px solid rgba(154, 38, 215, 0.4);\n  background: rgba(154, 38, 215, 0.1);\n  color: #9A26D7;",
    "border: 1px solid rgba(198, 85, 253, 0.45);\n  background: rgba(46, 1, 67, 0.78);\n  color: #ffffff;\n  backdrop-filter: blur(8px);"
)

# Declining card seal
css = css.replace(
    "background: radial-gradient(circle at 35% 35%, #F5E5FD 0%, #DDD6FE 80%, #A78BFA 100%);\n  color: #3B0253;",
    "background: radial-gradient(circle at 35% 35%, #3B0253 0%, #2e0143 80%, #150022 100%);\n  color: #E9D5FF;"
)

# 7. Bottom fade
css = css.replace(
    "background: linear-gradient(to bottom, transparent, #FAF2FE);",
    "background: linear-gradient(to bottom, transparent, #150022);"
)

with open("app/will_you_join_us.css", "w", encoding="utf-8") as f:
    f.write(css)

print("will_you_join_us.css updated successfully.")
