function changeList(key, index) {
  cookie.set('groupId', key);
  cookie.set('index', index);
  $('iframe').attr('src', `/admin/urlList/${key}`);
  $('.module-arrow').hide().eq(index).show();
}

function addItem() {
  $('iframe').attr('src', `/admin/group/insert`);
}

function refresh() {
  location.reload();
}

function build() {
  $('iframe').attr('src', '/admin/build');
}

function release() {
  $('iframe').attr('src', '/admin/restart');
}

function delCookie() {
  cookie.remove('index');
  cookie.remove('groupId');
}

$(() => {
  if (cookie.get('groupId')) {
    $('iframe').attr('src', `/admin/urlList/${cookie.get('groupId')}`);
  }

  if (cookie.get('index')) {
    $('.module-arrow').hide().eq(cookie.get('index')).show();
  }
});