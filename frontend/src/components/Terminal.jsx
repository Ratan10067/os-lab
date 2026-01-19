import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import "xterm/css/xterm.css";

const Terminal = forwardRef(
  (
    {
      onData,
      onResize,
      fontSize = 14,
      fontFamily = "'JetBrains Mono', 'Fira Code', monospace",
    },
    ref,
  ) => {
    const terminalRef = useRef(null);
    const xtermRef = useRef(null);
    const fitAddonRef = useRef(null);
    const onDataRef = useRef(onData);
    const onResizeRef = useRef(onResize);

    // Keep refs updated
    useEffect(() => {
      onDataRef.current = onData;
    }, [onData]);

    useEffect(() => {
      onResizeRef.current = onResize;
    }, [onResize]);

    useImperativeHandle(ref, () => ({
      write: (data) => {
        if (xtermRef.current) {
          xtermRef.current.write(data);
        }
      },
      clear: () => {
        if (xtermRef.current) {
          xtermRef.current.clear();
        }
      },
      focus: () => {
        if (xtermRef.current) {
          xtermRef.current.focus();
        }
      },
      fit: () => {
        if (fitAddonRef.current) {
          fitAddonRef.current.fit();
        }
      },
    }));

    useEffect(() => {
      if (!terminalRef.current || xtermRef.current) return;

      // Create terminal instance
      const xterm = new XTerm({
        cursorBlink: true,
        cursorStyle: "block",
        fontSize,
        fontFamily,
        lineHeight: 1.2,
        letterSpacing: 0,
        theme: {
          background: "#0a0a0f",
          foreground: "#f0f0f5",
          cursor: "#22c55e",
          cursorAccent: "#0a0a0f",
          selectionBackground: "rgba(34, 197, 94, 0.3)",
          selectionForeground: "#f0f0f5",
          black: "#1a1a24",
          red: "#ef4444",
          green: "#22c55e",
          yellow: "#eab308",
          blue: "#3b82f6",
          magenta: "#a855f7",
          cyan: "#06b6d4",
          white: "#f0f0f5",
          brightBlack: "#606070",
          brightRed: "#f87171",
          brightGreen: "#4ade80",
          brightYellow: "#facc15",
          brightBlue: "#60a5fa",
          brightMagenta: "#c084fc",
          brightCyan: "#22d3ee",
          brightWhite: "#ffffff",
        },
        allowProposedApi: true,
        scrollback: 5000,
        convertEol: true,
      });

      // Create and load addons
      const fitAddon = new FitAddon();
      const webLinksAddon = new WebLinksAddon();

      xterm.loadAddon(fitAddon);
      xterm.loadAddon(webLinksAddon);

      // Open terminal in container
      xterm.open(terminalRef.current);

      // Initial fit
      setTimeout(() => {
        fitAddon.fit();
      }, 100);

      // Store references
      xtermRef.current = xterm;
      fitAddonRef.current = fitAddon;

      // Handle user input - use ref to always call latest callback
      const dataDisposable = xterm.onData((data) => {
        if (onDataRef.current) {
          onDataRef.current(data);
        }
      });

      // Handle resize
      const resizeDisposable = xterm.onResize(({ cols, rows }) => {
        if (onResizeRef.current) {
          onResizeRef.current({ cols, rows });
        }
      });

      // Handle window resize
      const handleWindowResize = () => {
        fitAddon.fit();
      };
      window.addEventListener("resize", handleWindowResize);

      // Focus terminal
      xterm.focus();

      // Write welcome message
      xterm.writeln(
        "\x1b[32m╭───────────────────────────────────────────╮\x1b[0m",
      );
      xterm.writeln(
        "\x1b[32m│\x1b[0m   \x1b[1;36mWelcome to OS Lab - Web Terminal\x1b[0m       \x1b[32m│\x1b[0m",
      );
      xterm.writeln(
        "\x1b[32m│\x1b[0m   Practice OS concepts in a sandbox       \x1b[32m│\x1b[0m",
      );
      xterm.writeln(
        "\x1b[32m╰───────────────────────────────────────────╯\x1b[0m",
      );
      xterm.writeln("");

      // Cleanup
      return () => {
        dataDisposable.dispose();
        resizeDisposable.dispose();
        window.removeEventListener("resize", handleWindowResize);
        xterm.dispose();
        xtermRef.current = null;
        fitAddonRef.current = null;
      };
    }, [fontSize, fontFamily]);

    return (
      <div
        ref={terminalRef}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "300px",
        }}
      />
    );
  },
);

Terminal.displayName = "Terminal";

export default Terminal;
