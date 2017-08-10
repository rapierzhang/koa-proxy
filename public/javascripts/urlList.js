function del(groupId) {
  parent.delCookie();
  location.assign('../group/' + groupId + '/delete');
  parent.refresh();
}