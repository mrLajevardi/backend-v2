$path = "C:\arad-v2\*"
$working_directory = Get-Location
npm run pm2:stop
Remove-Item -Path $path -Recurse -Force
$path = "C:\arad-v2"
Copy-Item -Path ".\*" -Destination $path -Recurse
Copy-Item -Path "C:\configs\.env" $path
cd $path;npm install;npm run build;npm run pm2:reload
$bak_path = "C:\arad-v2.bak\*"
pm2 stop arad-v2.bak
Remove-Item -Path $bak_path -Recurse -Force
$bak_path = "C:\arad-v2.bak"
cd $working_directory
Copy-Item -Path ".\*" -Destination $bak_path -Recurse
Copy-Item -Path "C:\configs\.env" $bak_path
cd $bak_path;npm install;npm run build;pm2 reload arad-v2.bak