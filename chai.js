(function () {
  "use strict";

  const PREFIX = "chai-";
  const scale = (n) => `${parseInt(n) * 4}px`;

  const colors = {
    red: "#f87171",
    blue: "#60a5fa",
    green: "#4ade80",
    yellow: "#fbbf24",
    purple: "#a855f7",
    pink: "#ec4899",
    gray: "#6b7280",
    black: "#000",
    white: "#fff",
  };
  const fontSizes = {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
  };

  function parseClass(cls) {
    if (!cls.startsWith(PREFIX)) return null;

    const token = cls.replace(PREFIX, "");
    const parts = token.split("-");

    const type = parts[0];
    const val = parts[1];

    switch (type) {
      case "p":
        return { padding: scale(val) };
      case "m":
        return { margin: scale(val) };

      case "px":
        return { paddingLeft: scale(val), paddingRight: scale(val) };

      case "py":
        return { paddingTop: scale(val), paddingBottom: scale(val) };

      case "mt":
        return { marginTop: scale(val) };
      case "mb":
        return { marginBottom: scale(val) };
      case "ml":
        return { marginLeft: scale(val) };
      case "mr":
        return { marginRight: scale(val) };

      case "bg":
        return { backgroundColor: colors[val] || val };

      case "text":
        if (["left", "center", "right"].includes(val)) {
          return { textAlign: val };
        }
        if (fontSizes[val]) {
          return { fontSize: fontSizes[val] };
        }
        return { color: colors[val] || val };

      case "font":
        return { fontWeight: val };

      case "uppercase":
        return { textTransform: "uppercase" };

      case "tracking":
        return { letterSpacing: "0.05em" };

      case "leading":
        return { lineHeight: 1.5 };

      case "border":
        if (!val) return { border: "1px solid #444" };
        return { border: `1px solid ${colors[val] || val}` };

      case "rounded":
        if (val === "full") return { borderRadius: "9999px" };
        if (val === "xl") return { borderRadius: "1rem" };
        if (val === "lg") return { borderRadius: "0.5rem" };
        return { borderRadius: "0.25rem" };

      case "shadow":
        return {
          boxShadow: "0 10px 15px rgba(0,0,0,0.2)",
        };

      case "flex":
        if (val === "col") return { display: "flex", flexDirection: "column" };
        return { display: "flex" };

      case "items":
        return { alignItems: val };

      case "justify":
        return { justifyContent: val };

      case "gap":
        return { gap: scale(val) };

      case "w":
        if (val === "full") return { width: "100%" };
        return { width: scale(val) };

      case "h":
        return { height: scale(val) };

      case "opacity":
        return { opacity: val / 100 };

      default:
        return null;
    }
  }

  function applyStyles(el, styles) {
    Object.entries(styles).forEach(([k, v]) => {
      el.style[k] = v;
    });
  }

  function apply() {
    const elements = document.querySelectorAll("*");

    elements.forEach((el) => {
      const classes = [...el.classList];

      classes.forEach((cls) => {
        const styles = parseClass(cls);

        if (styles) {
          applyStyles(el, styles);
          el.classList.remove(cls);
        }
      });
    });
  }

  window.runPlayground = function () {
    const input = document.getElementById("html-input").value;
    const frame = document.getElementById("preview-frame");

    frame.srcdoc = `
    <html>
      <head>
        <link rel="stylesheet" href="chai.css">
      </head>
      <body style="padding:20px;font-family:sans-serif;">
        ${input}
        <script src="chai.js"><\/script>
      </body>
    </html>
  `;
  };

  window.loadPreset = function (type) {
    const textarea = document.getElementById("html-input");

    const presets = {
      card: `<div class="chai-p-6 chai-bg-blue chai-text-white chai-rounded-xl">Card</div>`,
      button: `<button class="chai-p-3 chai-bg-green chai-text-white chai-rounded-lg">Click</button>`,
      grid: `<div class="chai-flex chai-gap-4">
  <div class="chai-bg-blue chai-p-4">1</div>
  <div class="chai-bg-red chai-p-4">2</div>
</div>`,
      navbar: `<div class="chai-flex chai-justify-between chai-p-4 chai-bg-black chai-text-white">
  <div>Logo</div>
  <div class="chai-flex chai-gap-3">
    <span>Home</span>
    <span>About</span>
  </div>
</div>`,
    };

    textarea.value = presets[type];
  };

  window.copyCode = function () {
    const text = document.getElementById("html-input");
    text.select();
    document.execCommand("copy");
    showToast("Copied!");
  };

  function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.innerText = msg;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => apply());
  } else {
    apply();
  }
})();
