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

  /* ── gv-mmy-bar: hide tree items that have no products for the active tag filter ── */
  var _filterCache = {};

  function _extractHandle(href) {
    try {
      var m = new URL(href).pathname.match(/\/collections\/([^/?#]+)/);
      return m ? m[1] : null;
    } catch (e) { return null; }
  }

  function _checkCollection(handle, tag, cb) {
    var key = handle + '|' + tag;
    console.log(key, handle, tag)
    if (_filterCache[key] !== undefined) { cb(_filterCache[key]); return; }
    fetch(
      '/collections/' + handle +
      '?filter.p.tag=' + encodeURIComponent(tag) +
      '&sections[]=rsd-collection-count'
    )
      .then(function (r) { return r.json(); })
      .then(function (data) {
        console.log(data)
        var div = document.createElement('div');
        div.innerHTML = data['rsd-collection-count'] || '';
        var has = div.textContent.trim() === '1';
        _filterCache[key] = has;
        cb(has);
      })
      .catch(function () { _filterCache[key] = true; cb(true); });
  }

  function _updateParentTriggers(grid) {
    grid.querySelectorAll('.rsd-col-tree__item').forEach(function (item) {
      var dropdown = item.querySelector('.rsd-col-tree__dropdown');
      if (!dropdown) return;
      var children = dropdown.querySelectorAll('.rsd-col-tree__link:not(.rsd-col-tree__link--all)');
      if (!children.length) return;
      var allHidden = Array.from(children).every(function (l) {
        return l.classList.contains('rsd-col-tree__link--hidden');
      });
      item.classList.toggle('rsd-col-tree__item--hidden', allHidden);
    });
  }

  function _applyTagFilter(tag) {
    var grid = document.querySelector('.rsd-collection-tree__grid');
    if (!grid) return;
    var directLinks = Array.from(grid.querySelectorAll('.rsd-col-tree__trigger--link'));
    var childLinks  = Array.from(grid.querySelectorAll('.rsd-col-tree__link:not(.rsd-col-tree__link--all)'));
    var all = directLinks.concat(childLinks);
    var pending = all.length;
    if (!pending) return;
    all.forEach(function (link) {
      var handle = _extractHandle(link.href);
      function done(has) {
        if (link.classList.contains('rsd-col-tree__trigger--link')) {
          link.closest('.rsd-col-tree__item').classList.toggle('rsd-col-tree__item--hidden', !has);
        } else {
          link.classList.toggle('rsd-col-tree__link--hidden', !has);
        }
        if (--pending === 0) _updateParentTriggers(grid);
      }
      if (!handle) { done(true); return; }
      _checkCollection(handle, tag, done);
    });
  }

  function _clearTagFilter() {
    document.querySelectorAll('.rsd-col-tree__trigger--hidden, .rsd-col-tree__link--hidden, .rsd-col-tree__item--hidden')
      .forEach(function (el) {
        el.classList.remove('rsd-col-tree__trigger--hidden', 'rsd-col-tree__link--hidden', 'rsd-col-tree__item--hidden');
      });
  }

  function _onUrlChange() {
    var newTag = new URLSearchParams(window.location.search).get('filter.p.tag');
    if (newTag === _activeTag) return;
    _activeTag = newTag;
    if (newTag) _applyTagFilter(newTag);
    else _clearTagFilter();
  }

  var _activeTag = params.get('filter.p.tag');
  if (_activeTag) _applyTagFilter(_activeTag);

  var _origPush = history.pushState.bind(history);
  history.pushState = function () {
    _origPush.apply(history, arguments);
    _onUrlChange();
  };
  window.addEventListener('popstate', _onUrlChange);

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
