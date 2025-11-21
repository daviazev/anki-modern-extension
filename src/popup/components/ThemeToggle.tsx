/**
 * THEME TOGGLE COMPONENT
 * Componente React para alternar temas no popup da extensão
 */

import { useEffect, useState } from "react";
import type { ThemeName } from "~styles/tokens";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>("academic");
  const [isLoading, setIsLoading] = useState(true);

  // Buscar tema atual quando o componente montar
  useEffect(() => {
    getCurrentThemeFromContent();
  }, []);

  /**
   * Busca o tema atual do content script
   */
  async function getCurrentThemeFromContent() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab?.id) {
        setIsLoading(false);
        return;
      }

      // Verificar se é uma página do AnkiWeb
      if (!tab.url?.includes("ankiweb.net") && !tab.url?.includes("ankiuser.net")) {
        console.log("[Theme Toggle] Não está no AnkiWeb");
        setIsLoading(false);
        return;
      }

      const response = await chrome.tabs.sendMessage(tab.id, { 
        action: "getTheme" 
      });

      if (response?.success) {
        setCurrentTheme(response.theme);
      }
    } catch (error) {
      console.error("[Theme Toggle] Erro ao buscar tema:", error);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Alterna o tema
   */
  async function handleToggleTheme() {
    setIsLoading(true);
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab?.id) {
        console.error("[Theme Toggle] Tab não encontrada");
        setIsLoading(false);
        return;
      }

      const response = await chrome.tabs.sendMessage(tab.id, { 
        action: "toggleTheme" 
      });

      if (response?.success) {
        setCurrentTheme(response.theme);
      }
    } catch (error) {
      console.error("[Theme Toggle] Erro ao alternar tema:", error);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Define um tema específico
   */
  async function handleSetTheme(theme: ThemeName) {
    setIsLoading(true);
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab?.id) {
        setIsLoading(false);
        return;
      }

      const response = await chrome.tabs.sendMessage(tab.id, { 
        action: "setTheme",
        theme 
      });

      if (response?.success) {
        setCurrentTheme(response.theme);
      }
    } catch (error) {
      console.error("[Theme Toggle] Erro ao definir tema:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const themeDisplay = {
    academic: { name: "Academic", emoji: "☀️", color: "#2EAADC" },
    focus: { name: "Focus", emoji: "🌙", color: "#BB86FC" }
  };

  const current = themeDisplay[currentTheme];
  const opposite: ThemeName = currentTheme === "academic" ? "focus" : "academic";

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "16px",
      padding: "16px",
      background: "#f7f7f5",
      borderRadius: "12px"
    },
    themeInfo: {
      display: "flex",
      alignItems: "center",
      gap: "12px"
    },
    emoji: {
      fontSize: "32px"
    },
    label: {
      fontSize: "12px",
      color: "#787774",
      fontWeight: 500,
      textTransform: "uppercase" as const,
      letterSpacing: "0.5px"
    },
    name: {
      fontSize: "18px",
      fontWeight: 700,
      color: "#37352f"
    },
    buttons: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "8px"
    },
    toggleBtn: {
      padding: "12px 16px",
      background: current.color,
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontWeight: 600,
      cursor: isLoading ? "not-allowed" : "pointer",
      transition: "all 0.2s ease",
      fontSize: "14px",
      opacity: isLoading ? 0.6 : 1
    },
    options: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "8px"
    },
    themeBtn: (isActive: boolean) => ({
      padding: "10px 12px",
      background: isActive ? current.color : "white",
      border: `2px solid ${isActive ? current.color : "#e1e1e0"}`,
      borderRadius: "6px",
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.15s ease",
      fontSize: "13px",
      color: isActive ? "white" : "#37352f",
      opacity: isLoading ? 0.5 : 1
    })
  };

  return (
    <div style={{ ...styles.container }} className={className}>
      <div style={styles.themeInfo}>
        <span style={styles.emoji}>{current.emoji}</span>
        <div>
          <div style={styles.label}>Tema Atual</div>
          <div style={styles.name}>{current.name}</div>
        </div>
      </div>

      <div style={styles.buttons}>
        <button
          onClick={handleToggleTheme}
          disabled={isLoading}
          style={styles.toggleBtn}
          title={`Alternar para ${themeDisplay[opposite].name}`}
        >
          {isLoading ? "⏳" : "↔️"} Alternar
        </button>

        <div style={styles.options}>
          <button
            onClick={() => handleSetTheme("academic")}
            disabled={isLoading || currentTheme === "academic"}
            style={styles.themeBtn(currentTheme === "academic")}
            title="Academic (Light)"
          >
            ☀️ Academic
          </button>
          <button
            onClick={() => handleSetTheme("focus")}
            disabled={isLoading || currentTheme === "focus"}
            style={styles.themeBtn(currentTheme === "focus")}
            title="Focus (Dark)"
          >
            🌙 Focus
          </button>
        </div>
      </div>
    </div>
  );
}
