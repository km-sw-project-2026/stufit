$uri = 'https://stufit.phsgp0701.workers.dev/api/challenges/7/members'
try {
  $r = Invoke-WebRequest -Uri $uri -Method GET -UseBasicParsing -ErrorAction Stop
  Write-Output "STATUS: $($r.StatusCode)"
  Write-Output "BODY:"
  Write-Output $r.Content
} catch {
  if ($_.Exception.Response) {
    $resp = $_.Exception.Response
    Write-Output "STATUS: $($resp.StatusCode.Value__)"
    $stream = $resp.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    Write-Output "BODY:"
    Write-Output $reader.ReadToEnd()
  } else {
    Write-Output "ERROR:`n$($_.Exception.Message)"
  }
}
