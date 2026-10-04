document.addEventListener("DOMContentLoaded", function() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      el.classList.add('is-visible');
      el.classList.add('in');
      // animate donut segments
      el.querySelectorAll('.donut-seg').forEach(function(seg) {
        var len = parseFloat(seg.getAttribute('data-len') || '0');
        var C = 339.292;
        seg.style.strokeDasharray = len.toFixed(2) + ' ' + C.toFixed(2);
      });
      // count up donut center + [data-count]
      el.querySelectorAll('[data-count]').forEach(function(node) {
        if (node.dataset.done) return;
        node.dataset.done = '1';
        var target = parseFloat(node.getAttribute('data-count'));
        var suffix = node.getAttribute('data-suffix') || '';
        var dec = node.getAttribute('data-dec') === '1' ? 1 : (String(target).indexOf('.') > -1 ? 1 : 0);
        var t0 = performance.now(), dur = 1200;
        function step(t) {
          var p = Math.min(1, (t - t0) / dur);
          var eased = 1 - Math.pow(1 - p, 3);
          node.textContent = (target * eased).toFixed(dec) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
      observer.unobserve(el);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.fade-in-section, .chart').forEach(function(s) { observer.observe(s); });
  var counterElement = document.getElementById('counter');
  if (counterElement && !counterElement.hasAttribute('data-count')) {
    var currentNum = 0, targetNum = 104, duration = 2000, intervalTime = duration / targetNum;
    var counterObserver = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        var timer = setInterval(function() {
          currentNum++;
          counterElement.innerText = currentNum + "+";
          if (currentNum >= targetNum) clearInterval(timer);
        }, intervalTime);
        counterObserver.disconnect();
      }
    });
    counterObserver.observe(counterElement);
  }
});
