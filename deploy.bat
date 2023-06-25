npm run pm2:stop
del /q /s "C:\arad-v2"
FOR /D %%p IN ("C:\arad-v2\*") DO rmdir "%%p" /s /q
xcopy /s .\ C:\arad-v2 /Y
cd C:\arad-v2
npm install
npm run build
npm run pm2:reload