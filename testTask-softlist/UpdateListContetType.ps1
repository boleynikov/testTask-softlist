#Import-Module PnP.PowerShell
$clientId="6cddbf50-90c0-476e-8468-3a8638ae45f5"
$clientSecret="V0LHNOGfswTVd+cWmGjwMmDF1liUUI73YiUoDnz3Tgc="
$siteURL="https://softlist365.sharepoint.com/sites/devOleinikov"

Connect-PnPOnline -Url $siteURL -ClientId $clientId -ClientSecret $clientSecret -WarningAction Ignore
$ContentTypeName="Елемент"
$CTypes = Get-PnPContentType -List "Purchase Requests";
$contentTypeId = "61469e45-a237-4059-9b37-e6b26e3fcc65";
foreach($contentType in $CTypes)
{
    Write-Host $contentType.Name
    if($contentType.Name -eq $ContentTypeName)
    {
        Write-Host "Changing"
        $contentType.DisplayFormClientSideComponentId = $contentTypeId;
        $contentType.NewFormClientSideComponentId = $contentTypeId;
        $contentType.EditFormClientSideComponentId = $contentTypeId;
        $contentType.Update($false)
        Write-Host "Changed"
    }
}
