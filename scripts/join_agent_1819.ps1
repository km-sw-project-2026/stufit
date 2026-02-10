$u = 'agent_test_1819'
$cid = 7
Write-Output "Trying join as $u to challenge $cid"
try {
  $headers = @{ "Content-Type" = "application/json"; "X-Username" = $u }
  $join = Invoke-RestMethod -Uri "https://stufit.phsgp0701.workers.dev/api/challenges/$cid/join" -Method POST -Headers $headers -Body '{}' -ErrorAction Stop
  Write-Output "JOIN_RESPONSE:"; $join | ConvertTo-Json -Compress
} catch {
  Write-Output "JOIN_ERROR:"; if ($_.Exception.Response) { $_.Exception.Response.StatusCode.Value__ } else { $_.Exception.Message }
  try { $stream = $_.Exception.Response.GetResponseStream(); $reader = New-Object System.IO.StreamReader($stream); Write-Output $reader.ReadToEnd() } catch {}
}
