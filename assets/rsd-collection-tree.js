/* ============================================
   RSD Collection Tree — dropdown toggles
   assets/rsd-collection-tree.js
   ============================================ */

(function () {
  'use strict';

  /* ── Preserve active filters on part-type links ── */
  // var search = window.location.search;
  // if (search) {
  //   document.querySelectorAll('.rsd-col-tree__part-item').forEach(function (link) {
  //     link.href = link.href.split('?')[0] + search;
  //   });
  // }

    /* ── Preserve active Shopify filters on part-type links ── */
  const params = new URLSearchParams(window.location.search);
  const filterParams = new URLSearchParams();
  params.forEach(function (value, key) {
    if (key.indexOf('filter.') === 0) {
      filterParams.append(key, value);
    }
  });
  var filterSearch = filterParams.toString();
  if (filterSearch) {
    document.querySelectorAll('.rsd-col-tree__part-item').forEach(function (link) {
      link.href = link.href.split('?')[0] + '?' + filterSearch;
    });
  }

  function closeAll(except) {
    document.querySelectorAll('[data-rsd-tree-trigger][aria-expanded="true"]').forEach(function (trigger) {
      if (trigger === except) return;
      trigger.setAttribute('aria-expanded', 'false');
      var dropdown = trigger.nextElementSibling;
      if (dropdown) dropdown.setAttribute('aria-hidden', 'true');
    });
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-rsd-tree-trigger]');

    if (!trigger) {
      closeAll();
      return;
    }

    var isOpen = trigger.getAttribute('aria-expanded') === 'true';
    closeAll(trigger);

    if (!isOpen) {
      trigger.setAttribute('aria-expanded', 'true');
      var dropdown = trigger.nextElementSibling;
      if (dropdown) dropdown.setAttribute('aria-hidden', 'false');
    } else {
      trigger.setAttribute('aria-expanded', 'false');
      var dropdown = trigger.nextElementSibling;
      if (dropdown) dropdown.setAttribute('aria-hidden', 'true');
    }
  });

}());
