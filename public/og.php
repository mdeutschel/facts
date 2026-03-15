<?php

declare(strict_types=1);

header('Content-Type: text/html; charset=utf-8');

$siteName = 'Fakten-Stammtisch';
$siteUrl = 'https://fakten-stammtisch.de';
$defaultTitle = $siteName;
$defaultDescription = 'Faktenbasierte Argumente fuer Stammtischdiskussionen';
$defaultPath = '/';
$defaultImage = $siteUrl . '/og-image.png';

function h(string $value): string
{
  return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function toJsonLd(array $payload): string
{
  $json = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  if ($json === false) {
    return '{}';
  }
  return $json;
}

$topicId = trim((string)($_GET['topic'] ?? ''));
$topicId = preg_replace('/[^a-z0-9-]/', '', strtolower($topicId));

$title = $defaultTitle;
$description = $defaultDescription;
$path = $defaultPath;
$faqJsonLd = null;

if ($topicId !== '') {
  $topicFile = __DIR__ . '/data/' . $topicId . '.json';
  if (is_file($topicFile)) {
    $raw = file_get_contents($topicFile);
    if ($raw !== false) {
      $topic = json_decode($raw, true);
      if (is_array($topic)) {
        $topicTitle = trim((string)($topic['title'] ?? ''));
        $topicSubtitle = trim((string)($topic['subtitle'] ?? ''));
        if ($topicTitle !== '') {
          $title = $topicTitle;
        }
        if ($topicSubtitle !== '') {
          $description = $topicSubtitle;
        }
        $path = '/thema/' . $topicId;

        $mainEntity = [];
        if (isset($topic['arguments']) && is_array($topic['arguments'])) {
          foreach ($topic['arguments'] as $argument) {
            if (!is_array($argument)) {
              continue;
            }
            $claim = trim((string)($argument['claim'] ?? ''));
            $response = trim((string)($argument['response'] ?? ''));
            if ($claim === '' || $response === '') {
              continue;
            }
            $mainEntity[] = [
              '@type' => 'Question',
              'name' => $claim,
              'acceptedAnswer' => [
                '@type' => 'Answer',
                'text' => $response,
              ],
            ];
          }
        }

        if ($mainEntity !== []) {
          $faqJsonLd = [
            '@context' => 'https://schema.org',
            '@type' => 'FAQPage',
            'mainEntity' => $mainEntity,
          ];
        }
      }
    }
  }
}

$canonicalUrl = $siteUrl . $path;
$fullTitle = $title . ' | ' . $siteName;

$websiteJsonLd = [
  '@context' => 'https://schema.org',
  '@type' => 'WebSite',
  'name' => $siteName,
  'url' => $siteUrl,
  'description' => $defaultDescription,
  'inLanguage' => 'de',
  'potentialAction' => [
    '@type' => 'SearchAction',
    'target' => $siteUrl . '/suche?q={search_term_string}',
    'query-input' => 'required name=search_term_string',
  ],
];

?>
<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?= h($fullTitle) ?></title>
    <meta name="description" content="<?= h($description) ?>" />
    <link rel="canonical" href="<?= h($canonicalUrl) ?>" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="<?= h($siteName) ?>" />
    <meta property="og:locale" content="de_DE" />
    <meta property="og:title" content="<?= h($title) ?>" />
    <meta property="og:description" content="<?= h($description) ?>" />
    <meta property="og:url" content="<?= h($canonicalUrl) ?>" />
    <meta property="og:image" content="<?= h($defaultImage) ?>" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="<?= h($title) ?>" />
    <meta name="twitter:description" content="<?= h($description) ?>" />
    <meta name="twitter:image" content="<?= h($defaultImage) ?>" />

    <script type="application/ld+json"><?= toJsonLd($websiteJsonLd) ?></script>
    <?php if (is_array($faqJsonLd)): ?>
      <script type="application/ld+json"><?= toJsonLd($faqJsonLd) ?></script>
    <?php endif; ?>

    <meta http-equiv="refresh" content="0;url=<?= h($path) ?>" />
  </head>
  <body>
    <p>Weiterleitung...</p>
    <script>
      window.location.replace(<?= json_encode($path, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?>)
    </script>
  </body>
</html>
