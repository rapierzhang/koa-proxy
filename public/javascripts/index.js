function changeList(key) {
  cookie.set('groupId', key);
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