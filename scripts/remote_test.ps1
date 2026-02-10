$u = "agent_test_$((Get-Random -Minimum 1000 -Maximum 9999))"
$body = @{ username = $u; password = "pwd" } | ConvertTo-Json
Write-Output "=== USERNAME: $u ==="
Write-Output "--- Register ---"
try {
  $reg = Invoke-RestMethod -Uri "https://stufit.phsgp0701.workers.dev/api/auth/register" -Method POST -Headers @{ "Content-Type"="application/json" } -Body $body -ErrorAction Stop
  Write-Output "REGISTER_RESPONSE:"; $reg | ConvertTo-Json -Compress
} catch {
  Write-Output "REGISTER_ERROR:"; if ($_.Exception.Response) { $_.Exception.Response.StatusCode.Value__ } else { $_.Exception.Message }
  try { $stream = $_.Exception.Response.GetResponseStream(); $reader = New-Object System.IO.StreamReader($stream); Write-Output $reader.ReadToEnd() } catch {}
}
Write-Output "--- Login ---"
try {
  $login = Invoke-RestMethod -Uri "https://stufit.phsgp0701.workers.dev/api/auth/login" -Method POST -Headers @{ "Content-Type"="application/json" } -Body $body -ErrorAction Stop
  Write-Output "LOGIN_RESPONSE:"; $login | ConvertTo-Json -Compress
} catch {
  Write-Output "LOGIN_ERROR:"; if ($_.Exception.Response) { $_.Exception.Response.StatusCode.Value__ } else { $_.Exception.Message }
  try { $stream = $_.Exception.Response.GetResponseStream(); $reader = New-Object System.IO.StreamReader($stream); Write-Output $reader.ReadToEnd() } catch {}
}
Write-Output "--- Public Challenges ---"
try {
  $pub = Invoke-RestMethod -Uri "https://stufit.phsgp0701.workers.dev/api/challenges/public" -Method GET -ErrorAction Stop
  Write-Output ($pub | ConvertTo-Json -Compress)
} catch {
  Write-Output "PUB_ERROR:"; if ($_.Exception.Response) { $_.Exception.Response.StatusCode.Value__ } else { $_.Exception.Message }
  try { $stream = $_.Exception.Response.GetResponseStream(); $reader = New-Object System.IO.StreamReader($stream); Write-Output $reader.ReadToEnd() } catch {}
}
$cid = $null
if ($pub -is [System.Array]) { if ($pub.Length -gt 0) { $cid = $pub[0].challenge_id } }
if (-not $cid -and $pub -and $pub.challenge_id) { $cid = $pub.challenge_id }
Write-Output "Selected challenge id: $cid"
if ($cid) {
  Write-Output "--- Join challenge $cid ---"
  try {
    $headers = @{ "Content-Type" = "application/json"; "X-Username" = $u }
    $join = Invoke-RestMethod -Uri "https://stufit.phsgp0701.workers.dev/api/challenges/$cid/join" -Method POST -Headers $headers -Body '{}' -ErrorAction Stop
    Write-Output "JOIN_RESPONSE:"; $join | ConvertTo-Json -Compress
  } catch {
    Write-Output "JOIN_ERROR:"; if ($_.Exception.Response) { $_.Exception.Response.StatusCode.Value__ } else { $_.Exception.Message }
    try { $stream = $_.Exception.Response.GetResponseStream(); $reader = New-Object System.IO.StreamReader($stream); Write-Output $reader.ReadToEnd() } catch {}
  }
} else { Write-Output "No public challenges found to join." }
