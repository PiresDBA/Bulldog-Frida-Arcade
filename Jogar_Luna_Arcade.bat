@echo off
title Salsichinha Luna Arcade - Servidor Local
color 0A

echo.
echo  ====================================================
echo      SALSICHINHA LUNA ARCADE - Iniciando...
echo  ====================================================
echo.
echo  [1/2] Iniciando servidor local na porta 8080...
echo.

:: Inicia o servidor Python em segundo plano
start "" /B python -m http.server 8080

:: Aguarda 2 segundos para o servidor subir
timeout /t 2 /nobreak >nul

echo  [2/2] Abrindo o jogo no navegador...
echo.
echo  Para parar o servidor, feche esta janela.
echo.

:: Abre o navegador com cache ignorado (hard refresh forcado via URL unica)
start "" "http://localhost:8080/index.html"

:: Mantém a janela aberta enquanto o servidor roda
python -m http.server 8081 >nul 2>&1

pause
