function addHeaderChange() {
  const html = `
    <div class="header-field-list">
      <span class="header-old-field">原字段:</span>
      <input class="header-old-field-input" value="" name="headerOldFieldInput">
      <span class="header-new-field">新字段:</span>
      <input class="header-new-field-input" value="" name="headerNewFieldInput">
    </div>
  `;
  $(".header-change-content").append(html);
}

function addHeaderField() {
  const html = `
    <div class="header-field-add-list">
      <span class="header-field-add-name-key">key:</span>
      <input class="header-field-add-input" value="" name="headerFieldAddKey">
      <span class="header-field-add-name-value">value:</span>
      <input class="header-field-add-input" value="" name="headerFieldAddValue">
    </div>
  `;
  $(".header-field-add-content").append(html);
}

function addBodyChange() {
  const html = `
    <div class="body-field-list">
      <span class="body-old-field">原字段:</span>
      <input class="body-old-field-input" value="" name="bodyOldFieldInput">
      <span class="body-new-field">新字段:</span>
      <input class="body-new-field-input" value="" name="bodyNewFieldInput">
    </div>
  `;
  $(".body-change-content").append(html);
}

function addBodyField() {
  const html = `
    <div class="body-field-add-list">
      <span class="body-field-add-name-key">key:</span>
      <input class="body-field-add-input" value="" name="bodyFieldAddKey">
      <span class="body-field-add-name-value">value:</span>
      <input class="body-field-add-input" value="" name="bodyFieldAddValue">
    </div>
  `;
  $(".body-field-add-content").append(html);
}

function submit() {
  $('form')[0].submit();
  parent.refresh();
}