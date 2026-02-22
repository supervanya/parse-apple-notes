function run(argv) {
  var yearsBack = parseInt(argv[0]) || 2;
  var snippetLen = parseInt(argv[1]) || 200;

  var app = Application("Notes");

  // Batch-fetch all scalar properties (fast: ~2.4s for ~900 notes)
  var ids = app.notes.id();
  var names = app.notes.name();
  var modDates = app.notes.modificationDate();
  var createDates = app.notes.creationDate();
  var texts = app.notes.plaintext();
  var locked = app.notes.passwordProtected();

  // Get note object references for container access
  var noteRefs = app.notes();

  // Cutoff date
  var cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - yearsBack);

  // Deduplicate by ID and filter by modification date
  var seen = {};
  var notes = [];
  for (var i = 0; i < ids.length; i++) {
    if (seen[ids[i]]) continue;
    seen[ids[i]] = true;

    var modDate = new Date(modDates[i]);
    if (modDate < cutoff) continue;

    // Get container/folder name (per-note, slower but only for filtered notes)
    var folderName = "Notes";
    try {
      folderName = noteRefs[i].container().name();
    } catch (e) {
      folderName = "Unknown";
    }

    // Extract a short snippet for AI context
    var snippet = "";
    if (!locked[i] && texts[i]) {
      snippet = texts[i]
        .substring(0, snippetLen)
        .replace(/\n+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    notes.push({
      title: names[i],
      folder: folderName,
      modifiedDate: modDates[i],
      createdDate: createDates[i],
      charCount: texts[i] ? texts[i].length : 0,
      locked: locked[i],
      snippet: snippet
    });
  }

  // Sort by folder name, then by modification date descending within each folder
  notes.sort(function (a, b) {
    var fa = a.folder.toLowerCase();
    var fb = b.folder.toLowerCase();
    if (fa < fb) return -1;
    if (fa > fb) return 1;
    return new Date(b.modifiedDate) - new Date(a.modifiedDate);
  });

  // Count unique folders
  var folderSet = {};
  for (var j = 0; j < notes.length; j++) {
    folderSet[notes[j].folder] = true;
  }

  return JSON.stringify(
    {
      fetchedAt: new Date().toISOString(),
      cutoffDate: cutoff.toISOString(),
      totalNotesInApp: Object.keys(seen).length,
      notesInRange: notes.length,
      uniqueFolders: Object.keys(folderSet).length,
      notes: notes
    },
    null,
    2
  );
}
