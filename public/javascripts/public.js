function sub() {
  $('form')[0].submit();
}

function submit() {
  $('form')[0].submit();
  parent.refresh();
}

function back() {
  history.back();
}

function del(groupId) {
  parent.delCookie();
  location.assign('../group/' + groupId + '/delete');
  parent.refresh();
}