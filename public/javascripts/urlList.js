function del(groupId) {
  location.assign('../group/' + groupId + '/delete');
  parent.refresh();
}