#--------------------------------
# update main server
# -------------------------------

$path = "C:\arad-v2\*"
$working_directory = Get-Location
$pm2_proccess = 'arad-v2.bak'
$payg_proccess = 'check_payg_services'
npm run pm2:stop
pm2 stop $payg_proccess
Remove-Item -Path $path -Recurse -Force
$path = "C:\arad-v2"
xcopy /E /Y /Exclude:exclude.txt .\ $path
Copy-Item -Path "C:\configs\.env" $path
cd $path;npm install;npm run build;npm run pm2:reload;pm2 reload $payg_proccess

#--------------------------------
# update backup server
# -------------------------------

$bak_path = "C:\arad-v2.bak\*"
pm2 stop $pm2_proccess
Remove-Item -Path $bak_path -Recurse -Force
$bak_path = "C:\arad-v2.bak"
cd $working_directory
xcopy /E /Y /Exclude:exclude.txt .\ $bak_path
Copy-Item -Path "C:\configs\.env" $bak_path
cd $bak_path;npm install;npm run build;pm2 reload $pm2_proccess