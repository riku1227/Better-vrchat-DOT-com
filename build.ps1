Remove-item dist -Recurse

Copy-Item -Path better_vrc_dot_com -Destination dist/manifest_v2 -Recurse
Remove-item dist/manifest_v2/manifest.json
Rename-Item dist/manifest_v2/manifest_v2.json manifest.json

Copy-Item -Path better_vrc_dot_com -Destination dist/manifest_v3 -Recurse
Remove-item dist/manifest_v3/manifest_v2.json

powershell compress-archive dist/manifest_v2/* dist/manifest_v2
powershell compress-archive dist/manifest_v3/* dist/manifest_v3