$uri = 'https://stufit.phsgp0701.workers.dev/api/challenges/7/join'
$headers = @{ 'X-Username'='agent_test_1819'; 'Content-Type'='application/json' }
try {
  $r = Invoke-WebRequest -Uri $uri -Method POST -Headers $headers -Body '{}' -UseBasicParsing -ErrorAction Stop
  Write-Output "STATUS: $($r.StatusCode)"
  Write-Output "CONTENT:"
  Write-Output $r.Content
} catch {
  if ($_.Exception.Response) {
    $resp = $_.Exception.Response
    Write-Output "STATUS: $($resp.StatusCode.Value__)"
    $stream = $resp.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    Write-Output "CONTENT:"
    Write-Output $reader.ReadToEnd()
  } else {
    Write-Output "ERROR:`n$($_.Exception.Message)"
  }
}
