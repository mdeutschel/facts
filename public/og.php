<?php

declare(strict_types=1);

header('Content-Type: text/html; charset=utf-8');

$siteName = 'Fakten-Stammtisch';
$siteUrl = 'https://fakten-stammtisch.de';
$defaultTitle = $siteName;
$defaultDescription = 'Faktenbasierte Argumente für Stammtischdiskussionen';
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

function renderContentBlock(array $block): string
{
  $type = (string)($block['type'] ?? '');
  $out = '';

  switch ($type) {
    case 'fact':
      $out .= '<li>' . h((string)($block['text'] ?? '')) . '</li>';
      break;

    case 'text':
      $out .= '<p>' . h((string)($block['text'] ?? '')) . '</p>';
      break;

    case 'table':
      if (isset($block['caption'])) {
        $out .= '<p><em>' . h((string)$block['caption']) . '</em></p>';
      }
      $out .= '<table>';
      if (isset($block['headers']) && is_array($block['headers'])) {
        $out .= '<tr>';
        foreach ($block['headers'] as $header) {
          $out .= '<th>' . h((string)$header) . '</th>';
        }
        $out .= '</tr>';
      }
      if (isset($block['rows']) && is_array($block['rows'])) {
        foreach ($block['rows'] as $row) {
          if (!is_array($row)) continue;
          $out .= '<tr>';
          foreach ($row as $cell) {
            $out .= '<td>' . h((string)$cell) . '</td>';
          }
          $out .= '</tr>';
        }
      }
      $out .= '</table>';
      break;

    case 'stat_grid':
      if (isset($block['items']) && is_array($block['items'])) {
        $out .= '<ul>';
        foreach ($block['items'] as $item) {
          if (!is_array($item)) continue;
          $label = h((string)($item['label'] ?? ''));
          $value = h((string)($item['value'] ?? ''));
          $sublabel = isset($item['sublabel']) ? ' (' . h((string)$item['sublabel']) . ')' : '';
          $out .= '<li>' . $label . ': ' . $value . $sublabel . '</li>';
        }
        $out .= '</ul>';
      }
      break;

    case 'comparison':
      if (isset($block['caption'])) {
        $out .= '<p><em>' . h((string)$block['caption']) . '</em></p>';
      }
      if (isset($block['items']) && is_array($block['items'])) {
        foreach ($block['items'] as $item) {
          if (!is_array($item)) continue;
          $out .= '<h4>' . h((string)($item['title'] ?? '')) . '</h4><ul>';
          if (isset($item['rows']) && is_array($item['rows'])) {
            foreach ($item['rows'] as $row) {
              if (!is_array($row)) continue;
              $out .= '<li>' . h((string)($row['label'] ?? '')) . ': ' . h((string)($row['value'] ?? '')) . '</li>';
            }
          }
          if (isset($item['total']) && is_array($item['total'])) {
            $out .= '<li><strong>' . h((string)($item['total']['label'] ?? '')) . ': ' . h((string)($item['total']['value'] ?? '')) . '</strong></li>';
          }
          $out .= '</ul>';
        }
      }
      if (isset($block['savings'])) {
        $out .= '<p><strong>Ersparnis: ' . h((string)$block['savings']) . '</strong></p>';
      }
      break;

    case 'range_bar':
      if (isset($block['caption'])) {
        $out .= '<p><em>' . h((string)$block['caption']) . '</em></p>';
      }
      $unit = (string)($block['unit'] ?? '');
      if (isset($block['items']) && is_array($block['items'])) {
        $out .= '<ul>';
        foreach ($block['items'] as $item) {
          if (!is_array($item)) continue;
          $suffix = $unit !== '' ? ' ' . h($unit) : '';
          $out .= '<li>' . h((string)($item['label'] ?? '')) . ': ' . h((string)($item['min'] ?? '')) . ' bis ' . h((string)($item['max'] ?? '')) . $suffix . '</li>';
        }
        $out .= '</ul>';
      }
      break;

    case 'bar_chart':
    case 'line_chart':
      if (isset($block['caption'])) {
        $out .= '<p><em>' . h((string)$block['caption']) . '</em></p>';
      }
      $unit = (string)($block['unit'] ?? '');
      if (isset($block['items']) && is_array($block['items'])) {
        $out .= '<ul>';
        foreach ($block['items'] as $item) {
          if (!is_array($item)) continue;
          $suffix = $unit !== '' ? ' ' . h($unit) : '';
          $out .= '<li>' . h((string)($item['label'] ?? '')) . ': ' . h((string)($item['value'] ?? '')) . $suffix . '</li>';
        }
        $out .= '</ul>';
      }
      break;

    case 'timeline':
      if (isset($block['caption'])) {
        $out .= '<p><em>' . h((string)$block['caption']) . '</em></p>';
      }
      if (isset($block['steps']) && is_array($block['steps'])) {
        $out .= '<ul>';
        foreach ($block['steps'] as $step) {
          if (!is_array($step)) continue;
          $sublabel = isset($step['sublabel']) ? ' (' . h((string)$step['sublabel']) . ')' : '';
          $out .= '<li>' . h((string)($step['label'] ?? '')) . ': ' . h((string)($step['value'] ?? '')) . $sublabel . '</li>';
        }
        $out .= '</ul>';
      }
      break;

    case 'progress_stack':
      if (isset($block['caption'])) {
        $out .= '<p><em>' . h((string)$block['caption']) . '</em></p>';
      }
      if (isset($block['segments']) && is_array($block['segments'])) {
        $out .= '<ul>';
        foreach ($block['segments'] as $segment) {
          if (!is_array($segment)) continue;
          $sublabel = isset($segment['sublabel']) ? ' (' . h((string)$segment['sublabel']) . ')' : '';
          $out .= '<li>' . h((string)($segment['label'] ?? '')) . ': ' . h((string)($segment['value'] ?? '')) . '%' . $sublabel . '</li>';
        }
        $out .= '</ul>';
        if (isset($block['total'])) {
          $out .= '<p>Gesamt: ' . h((string)$block['total']) . '</p>';
        }
      }
      break;
  }

  return $out;
}

$topicId = trim((string)($_GET['topic'] ?? ''));
$topicId = preg_replace('/[^a-z0-9-]/', '', strtolower($topicId));

$title = $defaultTitle;
$description = $defaultDescription;
$path = $defaultPath;
$faqJsonLd = null;
$claimReviews = [];

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

            $claimReviews[] = [
              '@context' => 'https://schema.org',
              '@type' => 'ClaimReview',
              'url' => $siteUrl . $path,
              'claimReviewed' => $claim,
              'author' => [
                '@type' => 'Organization',
                'name' => $siteName,
                'url' => $siteUrl,
              ],
              'reviewRating' => [
                '@type' => 'Rating',
                'ratingExplanation' => $response,
                'bestRating' => 5,
                'worstRating' => 1,
              ],
              'itemReviewed' => [
                '@type' => 'Claim',
                'appearance' => [
                  '@type' => 'CreativeWork',
                  'name' => 'Stammtisch-Behauptung',
                ],
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
    <?php foreach ($claimReviews as $cr): ?>
      <script type="application/ld+json"><?= toJsonLd($cr) ?></script>
    <?php endforeach; ?>

    <meta http-equiv="refresh" content="0;url=<?= h($path) ?>" />
    <link rel="alternate" type="text/plain" href="<?= h($siteUrl) ?>/llms.txt" title="LLM-optimized summary" />
    <link rel="alternate" type="text/plain" href="<?= h($siteUrl) ?>/llms-full.txt" title="LLM-optimized full content" />
  </head>
  <body>
    <h1><?= h($title) ?></h1>
    <p><?= h($description) ?></p>

<?php if ($topicId !== '' && isset($topic) && is_array($topic)): ?>

    <?php if (isset($topic['sections']) && is_array($topic['sections'])): ?>
      <h2>Fakten</h2>
      <?php foreach ($topic['sections'] as $section): ?>
        <?php if (!is_array($section)) continue; ?>
        <h3><?= h((string)($section['title'] ?? '')) ?></h3>
        <?php if (isset($section['content']) && is_array($section['content'])): ?>
          <?php
          $inFactList = false;
          foreach ($section['content'] as $block):
            if (!is_array($block)) continue;
            $isFact = ($block['type'] ?? '') === 'fact';
            if ($isFact && !$inFactList) {
              echo '<ul>';
              $inFactList = true;
            } elseif (!$isFact && $inFactList) {
              echo '</ul>';
              $inFactList = false;
            }
            echo renderContentBlock($block);
          endforeach;
          if ($inFactList) echo '</ul>';
          ?>
        <?php endif; ?>
      <?php endforeach; ?>
    <?php endif; ?>

    <?php if (isset($topic['arguments']) && is_array($topic['arguments'])): ?>
      <h2>Argumente</h2>
      <?php foreach ($topic['arguments'] as $argument): ?>
        <?php if (!is_array($argument)) continue; ?>
        <h3>Behauptung: <?= h((string)($argument['claim'] ?? '')) ?></h3>
        <p><strong>Antwort:</strong> <?= h((string)($argument['response'] ?? '')) ?></p>
      <?php endforeach; ?>
    <?php endif; ?>

    <?php if (isset($topic['sources']) && is_array($topic['sources'])): ?>
      <h2>Quellen</h2>
      <ul>
        <?php foreach ($topic['sources'] as $source): ?>
          <?php if (!is_array($source)) continue; ?>
          <li>
            <?= h((string)($source['label'] ?? '')) ?>
            <?php if (isset($source['url'])): ?>
              — <a href="<?= h((string)$source['url']) ?>"><?= h((string)$source['url']) ?></a>
            <?php endif; ?>
          </li>
        <?php endforeach; ?>
      </ul>
    <?php endif; ?>

<?php else: ?>

    <?php
    $topicsFile = __DIR__ . '/data/topics.json';
    $topicsList = [];
    if (is_file($topicsFile)) {
      $rawTopics = file_get_contents($topicsFile);
      if ($rawTopics !== false) {
        $decoded = json_decode($rawTopics, true);
        if (is_array($decoded) && isset($decoded['topics'])) {
          $topicsList = $decoded['topics'];
        }
      }
    }
    ?>
    <h2>Themen</h2>
    <ul>
      <?php foreach ($topicsList as $t): ?>
        <?php if (!is_array($t)) continue; ?>
        <li>
          <a href="<?= h($siteUrl . '/thema/' . (string)($t['id'] ?? '')) ?>">
            <?= h((string)($t['title'] ?? '')) ?>
          </a>
          — <?= h((string)($t['subtitle'] ?? '')) ?>
          <?php if (isset($t['keyStats']) && is_array($t['keyStats'])): ?>
            <br /><small><?= h(implode(' · ', $t['keyStats'])) ?></small>
          <?php endif; ?>
        </li>
      <?php endforeach; ?>
    </ul>

    <h2>Vollständiger Inhalt für KI-Systeme</h2>
    <p>
      <a href="<?= h($siteUrl) ?>/llms.txt">Zusammenfassung (llms.txt)</a> ·
      <a href="<?= h($siteUrl) ?>/llms-full.txt">Alle Inhalte als Plaintext (llms-full.txt)</a>
    </p>

    <h2>Über diese Seite</h2>
    <p>
      Fakten-Stammtisch ist eine deutschsprachige Website, die faktenbasierte Argumente und
      quellengestützte Informationen zu politischen und gesellschaftlichen Themen in Deutschland bereitstellt.
      Die Inhalte richten sich an Menschen, die in informellen Diskussionen fundierte Gegenargumente
      suchen. Alle Aussagen werden mit Primärquellen belegt.
    </p>
    <p>
      <a href="<?= h($siteUrl) ?>/impressum">Impressum &amp; Datenschutz</a> ·
      <a href="<?= h($siteUrl) ?>/feedback">Feedback</a> ·
      E-Mail: feedback@fakten-stammtisch.de
    </p>

<?php endif; ?>

    <script>
      window.location.replace(<?= json_encode($path, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?>)
    </script>
  </body>
</html>
