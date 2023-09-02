npm run pm2:stop
$path = "C:\arad-v2\*"
Remove-Item -Path $path -Recurse -Force
$working_directory = Get-Location
$path = "C:\arad-v2"
Copy-Item -Path ".\*" -Destination $path -Recurse
cd C:\arad-v2;npm install;npm run build;npm run pm2:reload
