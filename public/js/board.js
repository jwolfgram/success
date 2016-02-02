function submitForm() {
  console.log('I was pressed');
  document.getElementById('task-form').submit();
}

document.getElementById('save-task').addEventListener(
    'click', submitForm, false
);