function run(argv) {
  var noteCount = parseInt(argv[0]) || 20;
  var maxChars = parseInt(argv[1]) || 8000;

  var app = Application("Notes");

  // Batch-fetch all properties (fast: ~1.2s total for ~900 notes)
  var ids = app.notes.id();
  var names = app.notes.name();
  var modDates = app.notes.modificationDate();
  var texts = app.notes.plaintext();
  var locked = app.notes.passwordProtected();

  // Deduplicate by ID (same note appears in parent + child folders)
  var seen = {};
  var notes = [];
  for (var i = 0; i < ids.length; i++) {
    if (!seen[ids[i]]) {
      seen[ids[i]] = true;
      notes.push({
        name: names[i],
        modDate: modDates[i],
        text: texts[i],
        locked: locked[i]
      });
    }
  }

  // Sort by modification date descending
  notes.sort(function (a, b) {
    return new Date(b.modDate) - new Date(a.modDate);
  });

  // Take top N
  var topN = notes.slice(0, noteCount);

  // Format output
  var now = new Date();
  var output = topN.map(function (n, idx) {
    var content;
    if (n.locked) {
      content = "[LOCKED - password protected note]";
    } else if (!n.text || n.text.trim().length === 0) {
      content = "[EMPTY NOTE]";
    } else {
      content = n.text;
    }

    var truncated = false;
    if (content.length > maxChars) {
      content =
        content.substring(0, maxChars) +
        "\n[... truncated from " +
        n.text.length +
        " chars]";
      truncated = true;
    }

    var msAgo = now - new Date(n.modDate);
    var daysAgo = Math.floor(msAgo / 86400000);

    return {
      rank: idx + 1,
      title: n.name,
      lastModified: n.modDate,
      daysAgo: daysAgo,
      charCount: n.text ? n.text.length : 0,
      truncated: truncated,
      locked: n.locked,
      content: content
    };
  });

  return JSON.stringify(
    {
      fetchedAt: now.toISOString(),
      totalNotes: notes.length,
      returned: output.length,
      notes: output
    },
    null,
    2
  );
}
