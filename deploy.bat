del /q /s "C:\arad-v2"
FOR /D %%p IN ("C:\arad-v2\*") DO rmdir "%%p" /s /q
xcopy /s .\ C:\arad-v2 /Y
cd C:\arad-v2
npm install
npm run build
@REM npm run pm2:reload