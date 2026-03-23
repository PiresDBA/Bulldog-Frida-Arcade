@echo off
echo ======================================================
echo 🐕 Salsichinha Luna Arcade - Iniciando Jogo...
echo ======================================================
echo Tentando rodar o servidor de desenvolvimento (Vite)...
npm run dev
if %errorlevel% neq 0 (
  echo [ERRO] Falha ao rodar npm run dev!
  echo Verifique se o Node.js esta instalado no computador.
  pause
)
pause
