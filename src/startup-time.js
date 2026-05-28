let startTime;
let markers = [];

module.exports = {
  setStartTime() {
    if (!startTime) {
      startTime = Date.now();
    }
  },
  addMarker(label, dateTime) {
    if (!startTime) {
      return;
    }

    dateTime = dateTime || Date.now();
    markers.push({ label, time: dateTime - startTime });
  },
  importData(data) {
    startTime = data.startTime;
    markers = data.markers;
  },
  exportData() {
    if (!startTime) {
      return undefined;
    }

    return { startTime, markers };
  },
  deleteData() {
    startTime = undefined;
    markers = [];
  },
  printReport() {
    if (!markers.length) return;
    const sorted = markers.slice().sort((a, b) => a.time - b.time);
    const total = sorted[sorted.length - 1].time;
    const lines = ['', '=== Atom Startup Profile ==='];
    for (let i = 0; i < sorted.length; i++) {
      const delta = i > 0 ? sorted[i].time - sorted[i - 1].time : sorted[i].time;
      const bar = delta > 50 ? ' ' + '\u2588'.repeat(Math.min(Math.round(delta / 20), 40)) : '';
      lines.push(
        `  ${String(sorted[i].time).padStart(5)}ms (+${String(delta).padStart(4)}ms) ${sorted[i].label}${bar}`
      );
    }
    lines.push(`  ${'─'.repeat(50)}`);
    lines.push(`  Total: ${total}ms`);
    lines.push('');
    console.log(lines.join('\n'));
  }
};
