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
$lastName  = isset($_POST['lastName'])  ? htmlspecialchars(strip_tags(trim($_POST['lastName'])))  : 'N/A';
$email     = isset($_POST['email'])     ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : 'N/A';
$company   = isset($_POST['company']) && !empty($_POST['company']) ? htmlspecialchars(strip_tags(trim($_POST['company']))) : 'Non renseigné';
$tab       = isset($_POST['_tab'])      ? htmlspecialchars(strip_tags(trim($_POST['_tab'])))      : 'N/A';

// ─── Smart Subject Generation ──────────────────────────────────────────────
function getSmartSubject($tab, $firstName, $lastName, $company, $post) {
    $name = "{$firstName} {$lastName}";
    $compSuffix = ($company !== 'Non renseigné') ? " — {$company}" : "";

    switch ($tab) {
        case 'tab-devis':
            $type = isset($post['type_de_projet']) && !empty($post['type_de_projet'])
                    ? htmlspecialchars(strip_tags($post['type_de_projet'])) : 'Projet';
            $deadline = isset($post['deadline']) && !empty($post['deadline'])
                    ? htmlspecialchars(strip_tags($post['deadline'])) : null;
            $budget = isset($post['budget_estime']) && !empty($post['budget_estime'])
                    ? number_format((float)$post['budget_estime'], 0, ',', ' ') . ' €' : null;
            $subject = "Demande de Devis — {$type} | {$name}{$compSuffix}";
            if ($budget) $subject .= " [{$budget}]";
            if ($deadline) $subject .= " · Délai: {$deadline}";
            return $subject;

        case 'tab-meeting':
            $type = isset($post['type_de_meeting']) && !empty($post['type_de_meeting'])
                    ? htmlspecialchars(strip_tags($post['type_de_meeting'])) : 'Meeting';
            $platform = isset($post['plateforme']) && !empty($post['plateforme'])
                    ? htmlspecialchars(strip_tags($post['plateforme'])) : null;
            $slot = isset($post['creneau_horaire']) && !empty($post['creneau_horaire'])
                    ? htmlspecialchars(strip_tags($post['creneau_horaire'])) : null;
            $subject = "Demande de Meeting — {$type} | {$name}{$compSuffix}";
            if ($platform) $subject .= " via {$platform}";
            if ($slot)     $subject .= " ({$slot})";
            return $subject;

        case 'tab-partner':
            $type = isset($post['type_partenariat']) && !empty($post['type_partenariat'])
                    ? htmlspecialchars(strip_tags($post['type_partenariat'])) : 'Partenariat';
            $sector = isset($post['secteur_activite']) && !empty($post['secteur_activite'])
                    ? htmlspecialchars(strip_tags($post['secteur_activite'])) : null;
            $subject = "Proposition de Partenariat — {$type} | {$name}{$compSuffix}";
            if ($sector) $subject .= " · Secteur: {$sector}";
            return $subject;

        case 'tab-other':
            $subj = isset($post['sujet_autre']) && !empty($post['sujet_autre'])
                    ? htmlspecialchars(strip_tags($post['sujet_autre'])) : 'Message';
            return "Contact — {$subj} | {$name}{$compSuffix}";

        default:
            return "Nouveau Contact Portfolio | {$name}{$compSuffix}";
    }
}

$subject = getSmartSubject($tab, $firstName, $lastName, $company, $_POST);

// ─── Tab Label for Display ─────────────────────────────────────────────────
$tabLabels = [
    'tab-devis'   => 'Demande de Devis',
    'tab-meeting' => 'Demande de Meeting',
    'tab-partner' => 'Partenariat',
    'tab-other'   => 'Autre',
];
$tabLabel = $tabLabels[$tab] ?? strtoupper(str_replace('tab-', '', $tab));

// Tab-specific badge colors
$badgeColors = [
    'tab-devis'   => ['bg' => '#dbeafe', 'text' => '#1d4ed8'],
    'tab-meeting' => ['bg' => '#dcfce7', 'text' => '#15803d'],
    'tab-partner' => ['bg' => '#fef3c7', 'text' => '#b45309'],
    'tab-other'   => ['bg' => '#f3f4f6', 'text' => '#374151'],
];
$badge = $badgeColors[$tab] ?? ['bg' => '#e0e7ff', 'text' => '#4338ca'];

// ─── Extra Fields ──────────────────────────────────────────────────────────
$extraDetails = "";
$baseFields = ['firstName', 'lastName', 'email', 'company', '_tab'];

// Pretty field name mapping
$fieldLabels = [
    'type_de_projet'      => 'Type de projet',
    'deadline'            => 'Délai souhaité',
    'budget_estime'       => 'Budget estimé',
    'services'            => 'Services requis',
    'description_projet'  => 'Description du projet',
    'type_de_meeting'     => 'Type de meeting',
    'plateforme'          => 'Plateforme',
    'date_souhaitee'      => 'Date souhaitée',
    'creneau_horaire'     => 'Créneau horaire',
    'objectif_meeting'    => 'Objectif',
    'type_partenariat'    => 'Type de partenariat',
    'secteur_activite'    => 'Secteur d\'activité',
    'description_entreprise' => 'Description entreprise',
    'site_web'            => 'Site web',
    'sujet_autre'         => 'Sujet',
    'message_libre'       => 'Message',
];

foreach ($_POST as $key => $val) {
    if (in_array($key, $baseFields)) continue;

    if (is_array($val)) {
        $val = implode(", ", array_map(fn($v) => htmlspecialchars(strip_tags($v)), $val));
    } else {
        $val = htmlspecialchars(strip_tags(trim($val)));
    }
    if (empty($val)) continue;

    // Format budget with euro symbol
    if ($key === 'budget_estime' && is_numeric($val)) {
        $val = number_format((float)$val, 0, ',', ' ') . ' €';
    }

    $cleanKey = $fieldLabels[$key] ?? ucfirst(str_replace('_', ' ', $key));

    $extraDetails .= "
        <tr>
            <td style='padding:12px 16px; border-bottom:1px solid #f1f5f9; width:35%; color:#6b7280; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;'>{$cleanKey}</td>
            <td style='padding:12px 16px; border-bottom:1px solid #f1f5f9; font-size:14px; color:#0f172a; line-height:1.5;'>" . nl2br($val) . "</td>
        </tr>";
}

if (empty($extraDetails)) {
    $extraDetails = "<tr><td colspan='2' style='padding:12px 16px; color:#9ca3af; font-size:13px; font-style:italic;'>Aucune donnée supplémentaire fournie.</td></tr>";
}

// ─── Security & Metadata ──────────────────────────────────────────────────
$ip        = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

$geoInfo = "Inconnue (Localhost/IP Réservée)";
if (!in_array($ip, ['127.0.0.1', '::1']) && filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
    $geo_json = @file_get_contents("http://ip-api.com/json/{$ip}?fields=status,country,city,isp,countryCode");
    if ($geo_json) {
        $geo_data = json_decode($geo_json, true);
        if (isset($geo_data['status']) && $geo_data['status'] === 'success') {
            $geoInfo = "{$geo_data['city']}, {$geo_data['country']} (ISP: {$geo_data['isp']})";
        }
    }
}

$sentAt = date('d/m/Y \à H:i:s T');

// ─── HTML Email Template ──────────────────────────────────────────────────
$htmlContent = "
<!DOCTYPE html>
<html>
<head>
<meta charset='utf-8'>
<meta name='viewport' content='width=device-width, initial-scale=1'>
</head>
<body style='font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1f2937; margin: 0; padding: 24px;'>
    <div style='max-width: 620px; margin: 0 auto;'>

        <!-- Header -->
        <div style='background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 16px 16px 0 0; padding: 36px 32px; text-align: center;'>
            <div style='font-size: 13px; letter-spacing: 3px; color: #64748b; margin-bottom: 8px; text-transform: uppercase; font-weight: 600;'>Portfolio</div>
            <div style='font-size: 30px; font-weight: 800; color: #ffffff; letter-spacing: 2px;'>BR<span style='color: #4ade80;'>.</span></div>
            <div style='margin-top: 12px; font-size: 13px; color: #94a3b8;'>{$sentAt}</div>
        </div>

        <!-- Type badge -->
        <div style='background: #1e293b; padding: 16px 32px; display: flex; align-items: center; gap: 12px;'>
            <span style='display:inline-block; background:{$badge['bg']}; color:{$badge['text']}; padding: 5px 14px; border-radius: 100px; font-size: 12px; font-weight: 700; letter-spacing: 0.5px;'>{$tabLabel}</span>
        </div>

        <!-- Body -->
        <div style='background: #ffffff; padding: 0;'>

            <!-- Contact Info -->
            <div style='padding: 28px 32px 0;'>
                <div style='font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; margin-bottom: 16px;'>Informations de contact</div>
                <table style='width:100%; border-collapse: collapse;'>
                    <tr>
                        <td style='padding:10px 0; border-bottom:1px solid #f1f5f9; width:35%; font-size:12px; color:#94a3b8; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;'>Nom</td>
                        <td style='padding:10px 0; border-bottom:1px solid #f1f5f9; font-size:15px; font-weight:700; color:#0f172a;'>{$firstName} {$lastName}</td>
                    </tr>
                    <tr>
                        <td style='padding:10px 0; border-bottom:1px solid #f1f5f9; font-size:12px; color:#94a3b8; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;'>Email</td>
                        <td style='padding:10px 0; border-bottom:1px solid #f1f5f9;'><a href='mailto:{$email}' style='color:#4f46e5; font-weight:500; text-decoration:none;'>{$email}</a></td>
                    </tr>
                    <tr>
                        <td style='padding:10px 0; font-size:12px; color:#94a3b8; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;'>Entreprise</td>
                        <td style='padding:10px 0; font-size:14px; color:#374151;'>{$company}</td>
                    </tr>
                </table>
            </div>

            <!-- Divider -->
            <div style='height:1px; background: linear-gradient(to right, transparent, #e2e8f0, transparent); margin: 24px 0;'></div>

            <!-- Form Details -->
            <div style='padding: 0 32px 28px;'>
                <div style='font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; margin-bottom: 16px;'>Détails de la demande</div>
                <table style='width:100%; border-collapse: collapse; background:#f8fafc; border-radius:10px; overflow:hidden;'>
                    {$extraDetails}
                </table>
            </div>

            <!-- Divider -->
            <div style='height:1px; background: linear-gradient(to right, transparent, #e2e8f0, transparent);'></div>

            <!-- Metadata -->
            <div style='padding: 20px 32px 28px; background: #f8fafc; border-radius: 0 0 0 0;'>
                <div style='font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; margin-bottom: 14px;'>Tracabilite</div>
                <table style='width:100%; border-collapse: collapse;'>
                    <tr>
                        <td style='padding:7px 0; font-size:11px; color:#94a3b8; font-weight:600; width:35%;'>IP Client</td>
                        <td style='padding:7px 0; font-family:monospace; font-size:12px; color:#d97706; background:#fffbeb; padding:4px 8px; border-radius:4px;'>{$ip}</td>
                    </tr>
                    <tr>
                        <td style='padding:7px 0; font-size:11px; color:#94a3b8; font-weight:600;'>GeoIP</td>
                        <td style='padding:7px 0; font-size:12px; color:#374151;'>{$geoInfo}</td>
                    </tr>
                    <tr>
                        <td style='padding:7px 0; font-size:11px; color:#94a3b8; font-weight:600;'>User-Agent</td>
                        <td style='padding:7px 0; font-size:10px; color:#9ca3af; line-height:1.4;'>{$userAgent}</td>
                    </tr>
                </table>
            </div>

        </div>

        <!-- Footer -->
        <div style='background: #0f172a; border-radius: 0 0 16px 16px; padding: 20px 32px; text-align:center;'>
            <div style='font-size: 11px; color: #475569;'>Notification automatisée · raberbelkacem.com</div>
        </div>

    </div>
</body>
</html>
";

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-type:text/html;charset=UTF-8\r\n";
$headers .= "From: Portfolio BR <noreply@raberbelkacem.com>\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

if (mail($to, $subject, $htmlContent, $headers, "-f noreply@raberbelkacem.com")) {
    echo json_encode(["status" => "success", "message" => "Email sent successfully."]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to send email."]);
}
?>
