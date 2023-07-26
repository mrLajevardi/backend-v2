npm run pm2:stop
$exclude = "C:\arad-v2\node_modules*"
$path = "C:\arad-v2\*"
$files_and_folders = Get-ChildItem -Path $path -Recurse | where-object{$_.fullname -notlike $exclude} 
$files = $files_and_folders | where-object{ $_.PSIsContainer -eq $false}
$folders = $files_and_folders | where-object{ $_.PSIsContainer -eq $true}
$working_directory = Get-Location
if ($null -ne $files){
    $files| Remove-Item -Force 
}
if ( $null -ne $folders) {
    foreach ($folder in $folders) {

        if (Test-Path $folder.FullName) {
      
          Remove-Item $folder.FullName -Force -Recurse
      
        } else {
      
          Write-Host "$($folder.FullName) does not exist, skipping deletion"
      
        }
      
      }
}
$files_and_folders = Get-ChildItem -Path "$working_directory" | where-object{$_.fullname -notlike "$working_directory\node_modules*"}
$dest = "C:\arad-v2"
$files_and_folders| Copy-Item -Destination {Join-Path $dest $_.FullName.Substring("$working_directory".Length)} -Force -Recurse -Container
cd C:\arad-v2;npm install;npm run build;npm run pm2:reload