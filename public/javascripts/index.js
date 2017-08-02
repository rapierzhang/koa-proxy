function changeList(key, index) {
  cookie.set('groupId', key);
  cookie.set('index', index);
  $('iframe').attr('src', `./admin/urlList/${key}`);
}

function addItem() {
  $('iframe').attr('src', `./admin/group/insert`);
}

function refresh() {
  location.reload();
}

$(() => {
  $('iframe').attr('src', `./admin/urlList/${cookie.get('groupId')}`);
});