/*jshint esversion: 6 */
$(function() {

// VIEWs

const taskList = function(tasks) { 
  return `<h1>Task list</h1>
  <button class="new">New task</button>
  <button class="reset">Reset tasks</button>
  <button class="active">Active Tasks</button>

  <p/>
  <input type="text" class="search" value="${search}" placeholder="Search" name "filter">
  <button class="erase">Clear</button>
  <p/>
  Order: <button class ="order">${order ? 'ASC' : 'DESC'}</button>
  `+
  
  tasks.reduce(
    (ac, task) => ac += 
    `<div>
    <button type="submit" class="delete" taskid="${task.id}" title="Delete"> <img src="public/icon_delete.png"/> </button>
    <button type="button" class="edit"   taskid="${task.id}" title="Edit"  > <img src="public/icon_edit.png"/> </button>
    <button type="button" class="switch" taskid="${task.id}" title=${task.done ? 'Start' : 'Stop'}> <img src="${task.done ? 'public/icon_play.png' : 'public/icon_stop.png'}"/> </button>
    ${task.title}
    </div>\n`, 
    "");
};

const taskForm = function(msg, id, action, title, done) {
  return `<h1>Task form</h1>
  ${msg}: <p class="form">
  <input type="text"     name="title"  value="${title}" placeholder="title"/>
  Done: 
  <input type="checkbox" name="done"   ${done ? 'checked' : ''}/>
  <button type="submit" class="${action}" taskid="${id}">${action}</button>
  </p>
  <button class="list">Go back</button>
  `;
};


// CONTROLLERs

const listController = function() {
  //$('#tasks').html(taskList(task_model.getAll()));
  let where = {};
  if (active) {
    where.done = false;
  }
  if (search){
    where.title = ["includes", search];
  }
  $('#tasks').html(taskList(task_model.getAll(where, {"title": order})));
};

const newController = function() {
  $('#tasks').html(taskForm('New task', null, 'create', '', ''));
};

const editController = function(id) {
  let task = task_model.get(id);
  $('#tasks').html(taskForm('Edit task', id, 'update', task.title, task.done));
};

const createController = function() {
  task_model.create($('input[name=title]').val(), $('input[name=done]').is(':checked'));  
  listController();
};

const updateController = function(id) {
  task_model.update(id, $('input[name=title]').val(), $('input[name=done]').is(':checked'));
  listController();
};

const switchController = function(id) {
  // Alterna el estado "done" de la tarea (hecha / pendiente)
  let task = task_model.get(id);
  task_model.update(id, task.title, !task.done);
  listController();
};

const deleteController = function(id) {
  // Elimina la tarea y actualiza la vista
  task_model.delete(id);
  listController();
};

const resetController = function() {
  // Reinicia el modelo (borra todas las tareas o las restablece a su estado inicial)
  task_model.reset();
  listController();
};



// ROUTER

const eventsController = function() {
  $(document).on('click','.list',   () => listController());
  $(document).on('click','.active',   () => {active = !active; listController(); $(".active").text(active ? "All" : "Active Tasks");});
  $(document).on('click','.new',    () => newController());
  $(document).on('click','.edit',   (e)=> editController(Number($(e.currentTarget).attr("taskid"))));
  $(document).on('click','.create', () => createController());
  $(document).on('click','.update', (e)=> updateController(Number($(e.currentTarget).attr("taskid"))));
  $(document).on('click','.switch', (e)=> switchController(Number($(e.currentTarget).attr("taskid"))));
  $(document).on('click','.delete', (e)=> deleteController(Number($(e.currentTarget).attr("taskid"))));
  $(document).on('click','.reset',  (e)=> resetController());
  $(document).on('input','.search',  (e)=> {search = $(".search").val(); listController(); $(".search").focus(); $(".search")[0].setSelectionRange(search.length, search.length);});
  $(document).on('click','.erase',  (e)=> {search = ""; listController();});
  $(document).on('keypress','.form', (e)=> {if(e.keyCode === 13) $("button[type=submit]").trigger("click");});
  $(document).on('click','.order',  (e)=> {order = !order; listController(); $(".order").text(order ? "ASC" : "DESC");});
};

let active = false;
let search = "";
let order = true;

let task_model = new TaskModel();
listController();
eventsController();
});
