param(
  [string]$ApiBaseUrl = $(if ($env:INFIP_API_BASE_URL) { $env:INFIP_API_BASE_URL } else { 'https://api.infip.pro' }),
  [string]$ApiKey = $env:INFIP_API_KEY,
  [string]$Model = 'img4',
  [int]$StartIndex = 1,
  [int]$EndIndex = 20,
  [switch]$Force
)

$ErrorActionPreference = 'Stop'

if (-not $ApiKey) {
  throw 'Set INFIP_API_KEY or pass -ApiKey before running the script.'
}

$projectRoot = Split-Path -Parent $PSScriptRoot
$tempRoot = Join-Path $env:TEMP 'cleaning-image-batch'

$basePrompt = 'Professional cleaning scene in Darwin, Australia, documentary commercial photography, Sony A7 IV, 24-70mm lens at 32mm, f/4, soft natural daylight with bounce fill, neutral-clean color grade with mild warm highlights, realistic plain navy uniforms and professional equipment, no logos, no text, sharp detail, straight architectural lines, clean modern environment, high realism.'
$negativePrompt = 'Avoid cartoon, illustration, painting, anime, CGI, plastic skin, extra fingers, distorted hands, duplicate tools, unrealistic reflections, extreme lens flare, text, words, letters, signage, watermark, logo, embroidered branding, dark moody lighting, oversaturated color, unsafe PPE, graphic trauma detail.'

$prompts = @(
  @{ Index = 1; Path = 'public/images/branding/hero-home-darwin-cleaning-01.jpg'; Detail = 'Bright Darwin home interior, cleaner in navy polo wiping a white kitchen island, tiled floors, ceiling fan, tropical daylight, negative space for hero text on the right, premium local service look.' },
  @{ Index = 2; Path = 'public/images/branding/hero-home-darwin-cleaning-02.jpg'; Detail = 'Wide living room and dining space in a modern Darwin home, cleaner preparing equipment near large windows, clean editorial framing, bright and trustworthy mood, room left for text overlay.' },
  @{ Index = 3; Path = 'public/images/services/service-residential-routine-clean-01.jpg'; Detail = 'Routine house cleaning in Darwin, cleaner vacuuming and detailing living room surfaces, realistic home styling, natural light, tidy but lived-in environment.' },
  @{ Index = 4; Path = 'public/images/services/service-residential-deep-clean-01.jpg'; Detail = 'Deep cleaning a Darwin bathroom, detailed tile and grout work, bright reflective surfaces, realistic gloves and tools, documentary close-medium framing.' },
  @{ Index = 5; Path = 'public/images/services/service-end-of-lease-clean-01.jpg'; Detail = 'End of lease cleaning scene in an empty Darwin rental, cleaner detailing window tracks and skirting boards, inspection-ready presentation, sharp architectural lines.' },
  @{ Index = 6; Path = 'public/images/services/service-airbnb-turnover-01.jpg'; Detail = 'Airbnb turnover cleaning in Darwin, fresh bed linen, bathroom reset, cleaner staging guest-ready apartment, morning natural light, polished but realistic.' },
  @{ Index = 7; Path = 'public/images/services/service-office-cleaning-01.jpg'; Detail = 'After-hours office cleaning in Darwin, cleaner sanitising desks and glass partitions, modern commercial workspace, clean reflections, practical corporate tone.' },
  @{ Index = 8; Path = 'public/images/services/service-retail-cleaning-01.jpg'; Detail = 'Retail store cleaning scene, polished floor and glass storefront, cleaner working before opening hours, subtle tropical urban context, trustworthy commercial look.' },
  @{ Index = 9; Path = 'public/images/services/service-medical-cleaning-01.jpg'; Detail = 'Medical centre cleaning, professional PPE, disinfecting treatment room surfaces, controlled lighting, clean and calm healthcare-safe presentation.' },
  @{ Index = 10; Path = 'public/images/services/service-strata-common-area-01.jpg'; Detail = 'Apartment common-area cleaning in Darwin, corridor and lift lobby detail, cleaner with cart, premium residential building atmosphere, realistic perspective.' },
  @{ Index = 11; Path = 'public/images/services/service-carpet-cleaning-01.jpg'; Detail = 'Carpet steam cleaning in a Darwin home, extractor wand in use, visible texture recovery, natural daylight, premium specialist surface-cleaning look.' },
  @{ Index = 12; Path = 'public/images/services/service-window-cleaning-01.jpg'; Detail = 'Interior and exterior window cleaning scene, streak-free glass with Darwin sunlight, cleaner using squeegee, marina or tropical greenery cues in the background.' },
  @{ Index = 13; Path = 'public/images/services/service-pressure-washing-01.jpg'; Detail = 'Pressure washing driveway and patio in Darwin, realistic water spray, tropical greenery, bright sky, controlled directional action shot.' },
  @{ Index = 14; Path = 'public/images/services/service-oven-cleaning-01.jpg'; Detail = 'Oven cleaning detail shot, cleaner removing built-up grease from modern kitchen oven, polished stainless surfaces, realistic documentary style.' },
  @{ Index = 15; Path = 'public/images/services/service-emergency-restoration-01.jpg'; Detail = 'Post-water-damage restoration cleaning scene, controlled professional response in Darwin property, moisture cleanup equipment visible, calm non-dramatic realism.' },
  @{ Index = 16; Path = 'public/images/services/service-mould-remediation-01.jpg'; Detail = 'Mould remediation scene, technician in correct PPE inspecting and cleaning affected wall area, high realism, safe and non-graphic, bright neutral light.' },
  @{ Index = 17; Path = 'public/images/services/service-biohazard-response-01.jpg'; Detail = 'Specialist high-risk cleaning team in controlled indoor environment, full PPE, professional posture, public-safe composition with no graphic content.' },
  @{ Index = 18; Path = 'public/images/areas/team-on-site-darwin-01.jpg'; Detail = 'Biraj Oli cleaning team arriving at a Darwin property, branded navy uniforms, equipment organized, bright tropical daylight, approachable and professional.' },
  @{ Index = 19; Path = 'public/images/areas/team-on-site-darwin-02.jpg'; Detail = 'Two cleaners reviewing checklist outside a Darwin commercial building, subtle greenery, clean uniforms, documentary local-business tone.' },
  @{ Index = 20; Path = 'public/images/areas/team-on-site-darwin-03.jpg'; Detail = 'Cleaner and client walkthrough at a bright Darwin property entry, friendly professional interaction, local service trust image, soft natural light.' }
)

Add-Type -AssemblyName System.Drawing

function Save-JpegFromUrl {
  param(
    [Parameter(Mandatory = $true)]
    [string]$ImageUrl,
    [Parameter(Mandatory = $true)]
    [string]$DestinationPath
  )

  $directory = Split-Path -Parent $DestinationPath
  if (-not (Test-Path $directory)) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
  }

  if (-not (Test-Path $tempRoot)) {
    New-Item -ItemType Directory -Path $tempRoot -Force | Out-Null
  }

  $tempPng = Join-Path $tempRoot ([System.IO.Path]::GetRandomFileName() + '.png')
  Invoke-WebRequest -Uri $ImageUrl -OutFile $tempPng

  $image = [System.Drawing.Image]::FromFile($tempPng)
  try {
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
      Where-Object { $_.MimeType -eq 'image/jpeg' } |
      Select-Object -First 1
    $parameters = New-Object System.Drawing.Imaging.EncoderParameters 1
    $parameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 92L
    $image.Save($DestinationPath, $codec, $parameters)
  } finally {
    $image.Dispose()
    Remove-Item $tempPng -Force -ErrorAction SilentlyContinue
  }
}

$selectedPrompts = $prompts | Where-Object { $_.Index -ge $StartIndex -and $_.Index -le $EndIndex }

if (-not $selectedPrompts) {
  throw "No prompts found between indexes $StartIndex and $EndIndex."
}

$results = foreach ($item in $selectedPrompts) {
  $destinationPath = Join-Path $projectRoot $item.Path
  if ((-not $Force) -and (Test-Path $destinationPath)) {
    [pscustomobject]@{
      Index = $item.Index
      File = $item.Path
      Status = 'skipped'
      Url = $null
    }
    continue
  }

  $prompt = "$basePrompt $($item.Detail) $negativePrompt"
  $payload = @{
    model = $Model
    prompt = $prompt
    n = 1
    size = '1792x1024'
    response_format = 'url'
  } | ConvertTo-Json -Depth 5

  $response = Invoke-RestMethod `
    -Method Post `
    -Uri "$ApiBaseUrl/v1/images/generations" `
    -Headers @{ Authorization = "Bearer $ApiKey" } `
    -ContentType 'application/json' `
    -Body $payload

  $imageUrl = $response.data[0].url

  if (-not $imageUrl) {
    throw "Image generation failed for item $($item.Index): $($item.Path)"
  }

  Save-JpegFromUrl -ImageUrl $imageUrl -DestinationPath $destinationPath

  [pscustomobject]@{
    Index = $item.Index
    File = $item.Path
    Status = 'generated'
    Url = $imageUrl
  }
}

$results | ConvertTo-Json -Depth 5
