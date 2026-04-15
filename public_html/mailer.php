<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method Not Allowed"]);
    exit;
}

$to = "contact@raberbelkacem.com";

// Extract base fields
$firstName = isset($_POST['firstName']) ? htmlspecialchars(strip_tags(trim($_POST['firstName']))) : 'N/A';
$lastName = isset($_POST['lastName']) ? htmlspecialchars(strip_tags(trim($_POST['lastName']))) : 'N/A';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : 'N/A';
$company = isset($_POST['company']) && !empty($_POST['company']) ? htmlspecialchars(strip_tags(trim($_POST['company']))) : 'Non renseigné';
$tab = isset($_POST['_tab']) ? htmlspecialchars(strip_tags(trim($_POST['_tab']))) : 'N/A';

$subject = "Nouveau contact - Portfolio BR ($firstName $lastName)";

// Determine which tab was active and collect specific data
$extraDetails = "";

$baseFields = ['firstName', 'lastName', 'email', 'company', '_tab'];

foreach($_POST as $key => $val) {
    if(!in_array($key, $baseFields)) {
        if(is_array($val)) {
            $val = implode(", ", array_map(function($v) { return htmlspecialchars(strip_tags($v)); }, $val));
        } else {
            $val = htmlspecialchars(strip_tags(trim($val)));
        }
        
        if(empty($val)) continue; // ignore empty fields
        
        // Formatting field names to look pretty
        $cleanKey = ucfirst(str_replace('_', ' ', preg_replace('/(?<!^)([A-Z])/', ' $1', $key)));
        
        $extraDetails .= "<tr>
            <td style='padding:12px; border-bottom:1px solid #eeeeee; width: 35%; color:#6b7280; font-size:13px;'><strong>{$cleanKey}:</strong></td>
            <td style='padding:12px; border-bottom:1px solid #eeeeee; font-size:14px; color:#111827;'>".nl2br($val)."</td>
        </tr>";
    }
}

if(empty($extraDetails)) {
    $extraDetails = "<tr><td colspan='2' style='padding:10px; color:#9ca3af; font-size:13px; font-style:italic;'>Aucune donnée supplémentaire fournie.</td></tr>";
}

// Security & Metadata
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

// Geolocation with ip-api
$geoInfo = "Inconnue (Localhost/IP Réservée)";
if (!in_array($ip, ['127.0.0.1', '::1']) && filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
    $geo_json = @file_get_contents("http://ip-api.com/json/{$ip}?fields=status,country,city,isp");
    if ($geo_json) {
        $geo_data = json_decode($geo_json, true);
        if (isset($geo_data['status']) && $geo_data['status'] === 'success') {
            $geoInfo = "{$geo_data['city']}, {$geo_data['country']} (ISP: {$geo_data['isp']})";
        }
    }
}

// Mail Template
$htmlContent = "
<!DOCTYPE html>
<html>
<head>
<meta charset='utf-8'>
<style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; color: #1f2937; margin: 0; padding: 30px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
    .header { background: #0f172a; color: #ffffff; padding: 30px 25px; text-align: center; }
    .header h2 { margin: 0; font-weight: 600; font-size: 22px; letter-spacing: 1px; color: #f8fafc;}
    .header span.brand { color: #4ade80; }
    .header p { margin: 10px 0 0 0; font-size: 14px; color: #94a3b8; }
    .content { padding: 35px 25px; }
    .footer { background: #f8fafc; padding: 25px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px; margin-top: 30px; color: #4f46e5; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; }
    .section-title.first { margin-top: 0; }
    .badge { display: inline-block; padding: 4px 10px; background: #e0e7ff; color: #4338ca; border-radius: 100px; font-size: 12px; font-weight: 600; }
</style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>PORTFOLIO <span class='brand'>BR.</span></h2>
            <p>Nouvelle soumission de formulaire</p>
        </div>
        
        <div class='content'>
            <div class='section-title first'>👤 Informations de Contact</div>
            <table>
                <tr><td style='padding:12px; border-bottom:1px solid #eeeeee; width: 35%; color:#6b7280; font-size:13px;'><strong>Nom complet :</strong></td><td style='padding:12px; border-bottom:1px solid #eeeeee; font-size:15px; font-weight:600;'>$firstName $lastName</td></tr>
                <tr><td style='padding:12px; border-bottom:1px solid #eeeeee; color:#6b7280; font-size:13px;'><strong>Email :</strong></td><td style='padding:12px; border-bottom:1px solid #eeeeee;'><a href='mailto:$email' style='color:#4f46e5; font-weight:500; text-decoration:none;'>$email</a></td></tr>
                <tr><td style='padding:12px; border-bottom:1px solid #eeeeee; color:#6b7280; font-size:13px;'><strong>Entreprise :</strong></td><td style='padding:12px; border-bottom:1px solid #eeeeee; font-size:14px;'>$company</td></tr>
                <tr><td style='padding:12px; border-bottom:1px solid #eeeeee; color:#6b7280; font-size:13px;'><strong>Type de Demande :</strong></td><td style='padding:12px; border-bottom:1px solid #eeeeee;'><span class='badge'>".strtoupper(str_replace('tab-', '', $tab))."</span></td></tr>
            </table>

            <div class='section-title'>📄 Détails du Formulaire</div>
            <table>
                {$extraDetails}
            </table>

            <div class='section-title'>🌐 Tracabilité & Méta-données</div>
            <table>
                <tr><td style='padding:12px; border-bottom:1px solid #eeeeee; color:#6b7280; font-size:12px;'><strong>Adresse IP Client :</strong></td><td style='padding:12px; border-bottom:1px solid #eeeeee; font-size: 12px; font-family: monospace; color: #d97706; background:#fffbeb; display:inline-block; margin-top:10px; border-radius:4px;'>{$ip}</td></tr>
                <tr><td style='padding:12px; border-bottom:1px solid #eeeeee; color:#6b7280; font-size:12px;'><strong>Localisation (GeoIP) :</strong></td><td style='padding:12px; border-bottom:1px solid #eeeeee; font-size: 13px; font-weight:500;'>$geoInfo</td></tr>
                <tr><td style='padding:12px; border-bottom:1px solid #eeeeee; color:#6b7280; font-size:12px;'><strong>Navigateur (User-Agent) :</strong></td><td style='padding:12px; border-bottom:1px solid #eeeeee; font-size: 11px; color: #9ca3af; line-height: 1.4;'>$userAgent</td></tr>
            </table>
        </div>
        
        <div class='footer'>
            The Grand Voyage — Système de notification automatisée<br>
            <span style='opacity: 0.7;'>Email généré le " . date('d/m/Y à H:i:s') . "</span>
        </div>
    </div>
</body>
</html>
";

$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: Portfolio BR <noreply@raberbelkacem.com>" . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";

if(mail($to, $subject, $htmlContent, $headers)) {
    echo json_encode(["status" => "success", "message" => "Email sent successfully."]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to send email via standard PHP mail()."]);
}
?>
