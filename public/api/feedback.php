<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

function respond(int $statusCode, bool $success, string $message): void
{
  http_response_code($statusCode);
  echo json_encode([
    'success' => $success,
    'message' => $message,
  ], JSON_UNESCAPED_UNICODE);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  header('Allow: POST');
  respond(405, false, 'Nur POST ist erlaubt.');
}

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$isJson = str_starts_with($contentType, 'application/json');
$isForm = str_starts_with($contentType, 'application/x-www-form-urlencoded') || str_starts_with($contentType, 'multipart/form-data');

if (!$isJson && !$isForm) {
  respond(415, false, 'Ungültiger Content-Type.');
}

$data = [];

if ($isJson) {
  $rawInput = file_get_contents('php://input');
  if ($rawInput === false) {
    respond(400, false, 'Anfrage konnte nicht gelesen werden.');
  }

  $decoded = json_decode($rawInput, true);
  if (!is_array($decoded)) {
    respond(400, false, 'Ungültiges JSON.');
  }

  $data = $decoded;
} else {
  $data = $_POST;
}

$submissionType = trim((string)($data['submissionType'] ?? ''));
$existingTopicId = trim((string)($data['existingTopicId'] ?? ''));
$existingTopicTitle = trim((string)($data['existingTopicTitle'] ?? ''));
$newTopicTitle = trim((string)($data['newTopicTitle'] ?? ''));
$argumentText = trim((string)($data['argumentText'] ?? ''));
$sources = trim((string)($data['sources'] ?? ''));
$senderName = trim((string)($data['senderName'] ?? ''));
$senderEmail = trim((string)($data['senderEmail'] ?? ''));
$honeypot = trim((string)($data['honeypot'] ?? ''));
$startedAt = (int)($data['startedAt'] ?? 0);

if ($honeypot !== '') {
  respond(400, false, 'Spam-Schutz ausgelöst.');
}

$nowMs = (int) floor(microtime(true) * 1000);
if ($startedAt <= 0 || ($nowMs - $startedAt) < 3000) {
  respond(400, false, 'Formular wurde zu schnell abgeschickt. Bitte versuche es erneut.');
}

if (!in_array($submissionType, ['existing_topic', 'new_topic'], true)) {
  respond(400, false, 'Ungültiger Typ.');
}

if ($submissionType === 'existing_topic' && $existingTopicId === '') {
  respond(400, false, 'Bitte ein bestehendes Thema auswählen.');
}

if ($submissionType === 'new_topic' && $newTopicTitle === '') {
  respond(400, false, 'Bitte einen Titel für das neue Thema angeben.');
}

if ($argumentText === '') {
  respond(400, false, 'Bitte einen Vorschlag angeben.');
}

if ($senderEmail !== '' && !filter_var($senderEmail, FILTER_VALIDATE_EMAIL)) {
  respond(400, false, 'Bitte eine gültige E-Mail-Adresse angeben.');
}

// Prevent mail header injection.
$senderEmail = str_replace(["\r", "\n"], '', $senderEmail);
$senderName = str_replace(["\r", "\n"], ' ', $senderName);

$recipient = 'TODO-feedback@example.de';
$siteName = 'Fakten-Stammtisch';

$topicLine = $submissionType === 'existing_topic'
  ? sprintf('Bestehendes Thema: %s (%s)', $existingTopicTitle !== '' ? $existingTopicTitle : 'Unbekannt', $existingTopicId)
  : sprintf('Neues Thema: %s', $newTopicTitle);

$mailSubject = sprintf('[%s] Neues Feedback', $siteName);
$mailBody = implode("\n", [
  'Neues Feedback über das Formular:',
  '',
  'Typ: ' . ($submissionType === 'existing_topic' ? 'Neues Argument zu bestehendem Thema' : 'Neues Thema'),
  $topicLine,
  '',
  'Vorschlag/Argument:',
  $argumentText,
  '',
  'Quellen:',
  $sources !== '' ? $sources : '(keine Angabe)',
  '',
  'Name:',
  $senderName !== '' ? $senderName : '(keine Angabe)',
  '',
  'E-Mail:',
  $senderEmail !== '' ? $senderEmail : '(keine Angabe)',
  '',
  'Zeitpunkt (Server): ' . date('c'),
]);

$headers = [
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
  'From: ' . $siteName . ' <no-reply@' . ($_SERVER['HTTP_HOST'] ?? 'localhost') . '>',
];

if ($senderEmail !== '') {
  $headers[] = 'Reply-To: ' . ($senderName !== '' ? $senderName . ' ' : '') . '<' . $senderEmail . '>';
}

$mailSent = mail($recipient, $mailSubject, $mailBody, implode("\r\n", $headers));

if (!$mailSent) {
  respond(500, false, 'E-Mail konnte nicht gesendet werden. Bitte später erneut versuchen.');
}

respond(200, true, 'Danke! Dein Feedback wurde erfolgreich gesendet.');
