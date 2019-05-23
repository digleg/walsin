function rowCreate() {
  var table = document.getElementById('condition_tbl');
  // alert(JSON.stringify(table));
  const rowNum = table.rows.length;
  var tr = document.createElement('TR');
  tr.setAttribute('id', 'addr' + rowNum);
  tr.innerHTML =
    '<td>' +
    (rowNum + 2) +
    "</td><td><input name='field" +
    rowNum +
    "' type='text' placeholder='field' class='form-control input-md'  /> </td><td><input  name='op" +
    rowNum +
    "' type='text' placeholder='op'  class='form-control input-md'></td><td><input  name='val" +
    rowNum +
    "' type='text' placeholder='val'  class='form-control input-md'></td><td><input name='combine" +
    rowNum +
    "' type='text' placeholder='combine' class='form-control input-md'/>";
  table.appendChild(tr);
}
