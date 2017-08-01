function changeList(key) {
  $('iframe').attr('src', `./admin/module/urlList/${key}`);
}

function addItem() {
  $('iframe').attr('src', `./admin/module/groupAdd`);
}

function refresh() {
  location.reload();
}