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
  const [isAnkiWebPage, setIsAnkiWebPage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

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
        setIsAnkiWebPage(false);
        setErrorMessage("Nenhuma aba ativa encontrada");
        setIsLoading(false);
        return;
      }

      // Verificar se é uma página do AnkiWeb
      const isAnkiPage = tab.url?.includes("ankiweb.net") || tab.url?.includes("ankiuser.net");
      setIsAnkiWebPage(isAnkiPage);
      
      if (!isAnkiPage) {
        setErrorMessage("Abra uma página do AnkiWeb para usar os temas");
        setIsLoading(false);
        return;
      }

      const response = await chrome.tabs.sendMessage(tab.id, { 
        action: "getTheme" 
      });

      if (response?.success) {
        setCurrentTheme(response.theme);
        setErrorMessage("");
      }
    } catch (error) {
      // Content script não carregado - instruir usuário a recarregar
      setErrorMessage("⟳ Recarregue a página do AnkiWeb (F5)");
      console.warn("[Theme Toggle] Content script não respondeu. Página precisa ser recarregada.", error);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Alterna o tema
   */
  async function handleToggleTheme() {
    if (!isAnkiWebPage) {
      setErrorMessage("Abra uma página do AnkiWeb primeiro");
      return;
    }
    
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab?.id) {
        setErrorMessage("Nenhuma aba ativa encontrada");
        setIsLoading(false);
        return;
      }

      const response = await chrome.tabs.sendMessage(tab.id, { 
        action: "toggleTheme" 
      });

      if (response?.success) {
        setCurrentTheme(response.theme);
        setErrorMessage("");
      }
    } catch (error) {
      setErrorMessage("⟳ Recarregue a página do AnkiWeb (F5)");
      console.warn("[Theme Toggle] Falha ao alternar tema. Content script não carregado.", error);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Define um tema específico
   */
  async function handleSetTheme(theme: ThemeName) {
    if (!isAnkiWebPage) {
      setErrorMessage("Abra uma página do AnkiWeb primeiro");
      return;
    }
    
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab?.id) {
        setErrorMessage("Nenhuma aba ativa encontrada");
        setIsLoading(false);
        return;
      }

      const response = await chrome.tabs.sendMessage(tab.id, { 
        action: "setTheme",
        theme 
      });

      if (response?.success) {
        setCurrentTheme(response.theme);
        setErrorMessage("");
      }
    } catch (error) {
      setErrorMessage("⟳ Recarregue a página do AnkiWeb (F5)");
      console.warn("[Theme Toggle] Falha ao definir tema. Content script não carregado.", error);
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
    }),
    errorBox: {
      padding: "12px",
      background: "#fff3cd",
      border: "1px solid #ffc107",
      borderRadius: "8px",
      fontSize: "13px",
      color: "#856404",
      textAlign: "center" as const,
      fontWeight: 500
    }
  };

  return (
    <div style={{ ...styles.container }} className={className}>
      {errorMessage && (
        <div style={styles.errorBox}>
          {errorMessage}
        </div>
      )}
      
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
          disabled={isLoading || !isAnkiWebPage}
          style={styles.toggleBtn}
          title={!isAnkiWebPage ? "Abra uma página do AnkiWeb" : `Alternar para ${themeDisplay[opposite].name}`}
        >
          {isLoading ? "⏳" : "↔️"} Alternar
        </button>

        <div style={styles.options}>
          <button
            onClick={() => handleSetTheme("academic")}
            disabled={isLoading || !isAnkiWebPage || currentTheme === "academic"}
            style={styles.themeBtn(currentTheme === "academic")}
            title="Academic (Light)"
          >
            ☀️ Academic
          </button>
          <button
            onClick={() => handleSetTheme("focus")}
            disabled={isLoading || !isAnkiWebPage || currentTheme === "focus"}
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
