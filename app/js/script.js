$(document).ready(function() {

  let tbl = $('table');
  let tbdy = $('tbody');

  if (JSON.parse(localStorage.getItem('data'))) {
    createTable(JSON.parse(localStorage.getItem('data')));
  }

  /* GET data on click && UPD myStorage && build table*/
  $('.local-storage').click(function() {
    $.ajax({
      url: 'https://api.github.com/users/muraha/repos',
      headers: {
        /*        "Authorization": localStorage.getItem('f3b8dd0d5ca3917ac4dbad2ced5389453ae2ea82')
    */},
      dataType: 'json',
      type: 'GET',
      success: function(json) {
        localStorage.setItem('data', JSON.stringify(json));
        createTable(JSON.parse(localStorage.getItem('data')));
      },
      error: function() {
        console.log('error T_T')
      }
    });
  });

  /* Build table */
  function createTable(json) {
    tbl.show();
    tbdy.empty();
    for (let i = 0; i < json.length; i++) {
      if (!json[i].description)
        json[i].description = '';
      tbdy.append(`<tr>
      <td class="name">${json[i].name}</td>
      <td class="created">${json[i].created_at}</td>
      <td class="url"><a href = ${json[i].html_url}>...${json[i].html_url.slice(25)}</a></td>
      <td class="desc">${json[i].description}</td>
			<td><button class="edit" title="Edit"><i class="far fa-edit"></i></button><button class="delete" title="Delete"><i class="fas fa-times-circle"></i></button></td>
      </tr>`); // toDo: make url clickable
      $('td:last-of-type')[i].id = json[i].id;
    };
  };

  /* Remove element */
  tbdy.on('click', '.delete', function() {
    let a = confirm('Are You sure want to delete repository?'); // add name of repo
    let idDel = 0
    if (a) {
      idDel = $(this)[0].parentNode.id
    };
    let myStorage = JSON.parse(localStorage.getItem('data'));
    for (let i = 0; i < myStorage.length; i++) {
      if (idDel == myStorage[i].id) {
        myStorage.splice(i, 1);
        break;
      }
    }
    localStorage.setItem('data', JSON.stringify(myStorage));
    createTable(myStorage);
  });


  /* Add new repository*/
  let btnNew = $('.add');
  let formNew = $('.new-rep');
  let newCancel = $('.new-rep .reset');
  let newSubmit = $('.new-rep .submit');
  let nameA = $('#new-form-name')
  let descA = $('#new-form-desc')

  btnNew.click(function () {
    nameA.removeClass('warning');
    formNew.toggle();
    nameA.focus();
  });

  newCancel.click(function() {
    formNew.hide();
  });

  newSubmit.click(function() {
      if (!nameA[0].value) {
      nameA.addClass('warning');
      alert('Please insert Repository Name');
    } else {
      let myStorage = JSON.parse(localStorage.getItem('data'));
      let newId = [];
      for (let i = 0; i < myStorage.length; i++) {
        newId.push(myStorage[i].id)
      };
      newId = Math.max.apply(null, newId) + 1;
      let date = new Date().toJSON().slice('', -5) + 'Z';
      let url = nameA[0].value.toLowerCase().trim().replace(/(\s|\W)/g, '-');
      myStorage.push({
        'id': newId,
        'name': nameA[0].value,
        'created_at': date,
        'html_url': 'https://github.com/muraha/' + url,
        'description': descA[0].value
      });
      localStorage.setItem('data', JSON.stringify(myStorage));
      createTable(myStorage);
      nameA.removeClass('warning')
      nameA.val('');
      descA.val('');
      formNew.hide();
    }
  });

  /* edit element */
  let id = 0;
  let i = 0
  let formUpd = $('.upd-rep');
  let updCancel = $('.upd-rep .reset');
  let updSubmit = $('.upd-rep .submit');
  let nameU = $('#upd-form-name');
  let descU = $('#upd-form-desc');
  let dateU = $('#upd-form-date');

  tbl.on('click', '.edit', function () {
    nameU.removeClass('warning');
    formUpd.show();
    nameU.focus();
    id = $(this)[0].parentNode.id;
    let myStorage = JSON.parse(localStorage.getItem('data'));
    for (i = 0; i < myStorage.length; i++) {
      if (id == myStorage[i].id) {
        break;
      }
    };
    nameU[0].value = myStorage[i].name;
    dateU[0].value = myStorage[i].created_at.slice(0, 16);
    descU[0].value = myStorage[i].description;

  })

  updCancel.on('click', function() {
    formUpd.hide();
  });

  updSubmit.on('click', function() {
    if (!nameU[0].value) {
      nameU.addClass('warning');
      alert('Please insert valid Repository Name');
    } else {
      let date = dateU[0].value + 'Z';
      let url = nameU[0].value.toLowerCase().trim().replace(/(\s|\W)/g, '-');
      let myStorage = JSON.parse(localStorage.getItem('data'));
      if (id == myStorage[i].id) {
        myStorage[i].name = nameU[0].value;
        myStorage[i].created_at = date
        myStorage[i].html_url = 'https://github.com/muraha/' + url
        myStorage[i].description = descU[0].value
        localStorage.setItem('data', JSON.stringify(myStorage));
        formUpd.hide();
        createTable(myStorage);
        nameU.removeClass('warning')
      } else {
        alert('Repository You want to edit was deleted');
        formUpd.hide();
      }
    }
  });

});
