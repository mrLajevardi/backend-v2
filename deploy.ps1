$bak_path = "C:\arad-v2.bak"
$path = "C:\arad-v2\*"
$working_directory = Get-Location
npm run pm2:stop
cd $bak_path; npm run pm2:reload
cd $working_directory
Remove-Item -Path $path -Recurse -Force
$path = "C:\arad-v2"
Copy-Item -Path ".\*" -Destination $path -Recurse
Copy-Item -Path "C:\configs\.env" $path
npm run pm2:stop
cd C:\arad-v2;npm install;npm run build;npm run pm2:reload
$bak_path = "C:\arad-v2.bak\*"
Remove-Item -Path $bak_path -Recurse -Force
$bak_path = "C:\arad-v2.bak"
Copy-Item -Path ".\*" -Destination $bak_path -Recurse
Copy-Item -Path "C:\configs\.env" $bak_path
