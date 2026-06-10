(function () {
  if (document.body.classList.contains('template-collection')) return;

  var past = 'Thu, 01 Jan 1970 00:00:00 GMT';
  var cookies = ['gv_mmy', 'gv_vehicle_json'];

  cookies.forEach(function (name) {
    document.cookie = name + '=;expires=' + past + ';path=/';
    document.cookie = name + '=;expires=' + past + ';path=/;domain=' + location.hostname;
    document.cookie = name + '=;expires=' + past + ';path=/;domain=.' + location.hostname;
  });
})();
