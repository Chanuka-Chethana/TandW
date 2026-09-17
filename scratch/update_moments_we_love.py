with open("app/moments_we_love.css", "r", encoding="utf-8") as f:
    css = f.read()

# 1. Master container
css = css.replace(
    "background: radial-gradient(circle at 50% 25%, #FAF2FE 0%, #F5E5FD 55%, #EED2FB 100%);\n  color: #3B0253;",
    "background: radial-gradient(circle at 50% 25%, #4a0468 0%, #2e0143 55%, #150022 100%);\n  color: #ffffff;"
)

# 2. Ambient glow & stars
css = css.replace(
    "background: radial-gradient(ellipse 65% 50% at 50% 35%, rgba(154, 38, 215, 0.12) 0%, transparent 75%);",
    "background: radial-gradient(ellipse 65% 50% at 50% 35%, rgba(198, 85, 253, 0.22) 0%, transparent 75%);"
)

css = css.replace(
    "background: #9A26D7;\n  box-shadow: 0 0 6px 1.5px rgba(154, 38, 215, 0.45);",
    "background: #C655FD;\n  box-shadow: 0 0 8px 2px rgba(198, 85, 253, 0.65);"
)

# 3. Eyebrow & Titles
css = css.replace(
    "color: #9A26D7;\n  margin-bottom: 6px;",
    "color: #C655FD;\n  margin-bottom: 6px;"
)

css = css.replace(
    """  background: linear-gradient(135deg, #3B0253 0%, #3B0253 60%, #9A26D7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.moments-subtitle {""",
    """  background: linear-gradient(135deg, #ffffff 0%, #F3D8FF 45%, #C655FD 80%, #9A26D7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 4px 18px rgba(198, 85, 253, 0.4));
}

.moments-subtitle {"""
)

css = css.replace(
    "color: #68427B;\n  margin: 0 auto 10px;\n  max-width: 520px;",
    "color: #E9D5FF;\n  margin: 0 auto 10px;\n  max-width: 520px;"
)

# 4. Choreography badge
css = css.replace(
    """  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(154, 38, 215, 0.35);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 9999px;
  font-family: "Montserrat", sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #760EAB;
  box-shadow: 0 4px 16px rgba(59, 2, 83, 0.08);""",
    """  background: rgba(46, 1, 67, 0.85);
  border: 1px solid rgba(198, 85, 253, 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 9999px;
  font-family: "Montserrat", sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #F3D8FF;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.45);"""
)

css = css.replace(
    "color: #9A26D7;\n  animation: pulseSparkle 2s infinite ease-in-out;",
    "color: #C655FD;\n  animation: pulseSparkle 2s infinite ease-in-out;"
)

css = css.replace(
    "color: #9A26D7;\n  opacity: 0.75;",
    "color: #C655FD;\n  opacity: 0.85;"
)

# 5. Control bar
css = css.replace(
    """  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(154, 38, 215, 0.25);
  backdrop-filter: blur(8px);
  border-radius: 9999px;
  padding: 4px;
  z-index: 30;
  margin-top: 8px;
}

.control-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 9999px;
  background: transparent;
  border: none;
  color: #68427B;""",
    """  background: rgba(46, 1, 67, 0.78);
  border: 1px solid rgba(198, 85, 253, 0.35);
  backdrop-filter: blur(8px);
  border-radius: 9999px;
  padding: 4px;
  z-index: 30;
  margin-top: 8px;
}

.control-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 9999px;
  background: transparent;
  border: none;
  color: #E9D5FF;"""
)

css = css.replace(
    """  background: rgba(154, 38, 215, 0.15);
  color: #760EAB;
  border: 1px solid rgba(154, 38, 215, 0.4);
  box-shadow: 0 2px 8px rgba(59, 2, 83, 0.1);""",
    """  background: rgba(198, 85, 253, 0.25);
  color: #ffffff;
  border: 1px solid rgba(198, 85, 253, 0.6);
  box-shadow: 0 2px 12px rgba(198, 85, 253, 0.3);"""
)

css = css.replace("color: #3B0253;\n}", "color: #ffffff;\n}")

# 6. Scroll cue
css = css.replace(
    "color: #68427B;\n  opacity: 0.85;",
    "color: #E9D5FF;\n  opacity: 0.9;"
)

css = css.replace(
    "color: #9A26D7;\n  animation: cueBounce 1.8s ease-in-out infinite;",
    "color: #C655FD;\n  animation: cueBounce 1.8s ease-in-out infinite;"
)

# 7. Showcase header & description
css = css.replace(
    "color: #9A26D7;\n  margin-bottom: 10px;",
    "color: #C655FD;\n  margin-bottom: 10px;"
)

css = css.replace(
    """  font-family: "Cinzel", "Cinzel Decorative", Georgia, serif;
  font-size: clamp(26px, 4vw, 38px);
  font-weight: 700;
  letter-spacing: 0.12em;
  margin: 0 0 12px;
  background: linear-gradient(135deg, #3B0253 0%, #3B0253 60%, #9A26D7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.showcase-desc {""",
    """  font-family: "Cinzel", "Cinzel Decorative", Georgia, serif;
  font-size: clamp(26px, 4vw, 38px);
  font-weight: 700;
  letter-spacing: 0.12em;
  margin: 0 0 12px;
  background: linear-gradient(135deg, #ffffff 0%, #F3D8FF 45%, #C655FD 80%, #9A26D7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 4px 18px rgba(198, 85, 253, 0.4));
}

.showcase-desc {"""
)

css = css.replace(
    "color: #68427B;\n  margin: 0 auto;\n}\n\n.showcase-divider",
    "color: #E9D5FF;\n  margin: 0 auto;\n}\n\n.showcase-divider"
)

css = css.replace(
    "background: linear-gradient(90deg, transparent, rgba(154, 38, 215, 0.4), transparent);",
    "background: linear-gradient(90deg, transparent, rgba(198, 85, 253, 0.5), transparent);"
)

# 8. Replay button
css = css.replace(
    """  background: rgba(154, 38, 215, 0.1);
  border: 1px solid rgba(154, 38, 215, 0.35);
  color: #760EAB;""",
    """  background: rgba(46, 1, 67, 0.8);
  border: 1px solid rgba(198, 85, 253, 0.4);
  color: #ffffff;"""
)

with open("app/moments_we_love.css", "w", encoding="utf-8") as f:
    f.write(css)

print("moments_we_love.css updated successfully.")
