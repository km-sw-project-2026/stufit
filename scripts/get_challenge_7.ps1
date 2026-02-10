$uri = 'https://stufit.phsgp0701.workers.dev/api/challenges/7'
$headers = @{ 'X-Username'='agent_test_1819' }
try {
  $r = Invoke-WebRequest -Uri $uri -Method GET -Headers $headers -UseBasicParsing -ErrorAction Stop
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
