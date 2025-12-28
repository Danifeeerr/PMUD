/*jshint esversion: 6 */
$(function() {

function TaskVC(ajaxUrl, name = "Task", id = "#tasks") {
  this.name = name;
  this.id = id;
  this.url = ajaxUrl;
  this.active = Cookie.get("active") ? JSON.parse(Cookie.get("active")) : false;
  this.search = Cookie.get("search") ? JSON.parse(Cookie.get("search")) : "";
  this.order  = Cookie.get("order")  ? JSON.parse(Cookie.get("order"))  : {};
  this.itemsOnPage = Cookie.get("itemsOnPage") ? JSON.parse(Cookie.get("itemsOnPage")) : 10;
  this.currentPage = 1;

  // VIEWs

  TaskVC.prototype.taskList = function(tasks) {
    return `<h1>${this.name} list</h1>
    <span class="nobr" style="float:left;">Items/page <select name="itemsOnPage" class="iopage"><option value="5">5</option><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option></select>
    Pagination: </span><div class="pagination"></div>
    <button class="new">New task</button>
    <button class="reset">Reset tasks</button>
    <button class="list_a"></button>
    <p/>
    Task Title
    <button class="uporder" title="Up order">&blacktriangle;</button>
    <button class="doorder" title="Down order">&blacktriangledown;</button>
    <button class="noorder" title="No order">&blacksquare;</button>
    <span class="nobr"><input type="text" class="search" value="${this.search}" placeholder="Search" onfocus="let v=this.value; this.value=''; this.value=v"> <img class="dsearch" title="Clean Search" src="public/icon_delete.png"/></span>
    ` +
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

  TaskVC.prototype.taskForm = function(msg, id, action, title, done) {
    return `<h1>${this.name} form</h1>
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

  async function fetchJSON(url, options = {}) {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      ...options
    });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  function encodeForm(data) {
    return new URLSearchParams(data).toString();
  }

  TaskVC.prototype.listController = async function() {
    Cookie.set("active", JSON.stringify(this.active), 7);
    Cookie.set("search", JSON.stringify(this.search), 7);
    Cookie.set("order",  JSON.stringify(this.order),  7);
    Cookie.set("itemsOnPage", JSON.stringify(this.itemsOnPage), 7);

    let where = {};
    if (this.active)
      where.done = false;
    if (this.search)
      where.title = ["includes", this.search];

    let params = [where, this.order, (this.currentPage-1)*this.itemsOnPage, this.itemsOnPage];
    try {
      let p1 = fetchJSON(this.url + '?' + encodeForm({ params: JSON.stringify(params) }));
      let p2 = fetchJSON(this.url + '/count?' + encodeForm({ params: JSON.stringify([where]) }));

      const [r1, r2] = await Promise.all([p1, p2]);
      let tasks = r1.message;
      let count = r2.message;

      $(this.id).html(this.taskList(tasks));
      $(this.id+' .list_a').html(this.active ? 'All tasks' : 'Active tasks');
      $(this.id+' .iopage').val(this.itemsOnPage);
      $(this.id+' .pagination').pagination({
          items: count,
          itemsOnPage: this.itemsOnPage,
          currentPage: this.currentPage,
          cssStyle: 'compact-theme',
          onPageClick: (pn, e) => {this.currentPage = pn; this.listController(); $(this.id+' .pagination').pagination('drawPage', pn);}  
      });
      if (this.order.title === undefined) {
        $(this.id+' .noorder').show(); $(this.id+' .uporder').hide(); $(this.id+' .doorder').hide();
      } else if (this.order.title) {
        $(this.id+' .noorder').hide(); $(this.id+' .uporder').hide(); $(this.id+' .doorder').show();
      } else { 
        $(this.id+' .noorder').hide(); $(this.id+' .uporder').show(); $(this.id+' .doorder').hide();
      }
      if (this.search) $(this.id+' .search').focus();
    } catch(error) {
      console.error(error);
    }
  };

  TaskVC.prototype.newController = function() {
    $(this.id).html(this.taskForm('New task', null, 'create', '', ''));
    $(this.id+' input[name=title]').focus();
  };

  TaskVC.prototype.editController = async function(id) {
    try {
      const r = await fetchJSON(this.url + '/' + id);
      let task = r.message;
      $(this.id).html(this.taskForm('Edit task', id, 'update', task.title, task.done));
      $(this.id+' input[name=title]').focus();
    } catch(error) {
      console.error(error);
    }
  };

  TaskVC.prototype.createController = async function() { //no funciona

    let titles = $(this.id+' input[name=title]').val();
    let done = $(this.id+' input[name=done]').is(':checked');
    try {
      await fetchJSON(this.url, {
        method: 'POST',
        body: JSON.stringify({title: titles, done: done })
      });
      this.listController();  
    } catch(error) {
      console.error(error);
    }
  };

  TaskVC.prototype.updateController = async function(id) {//no funciona

    let title = $(this.id+' input[name=title]').val();
    let done = $(this.id+' input[name=done]').is(':checked');
    try {
      await fetchJSON(this.url + '/' + id, {
        method: 'PUT',
        body: JSON.stringify({title: title, done: done })
      });
      this.listController();  
    } catch(error) {
      console.error(error);
    }

  };

  TaskVC.prototype.switchController = async function(id) {
    try {
      await fetchJSON(this.url + '/' + id + '/switch', {
        method: 'PATCH'
      });
      this.listController();  
    } catch(error) {
      console.error(error);
    }
  };

  TaskVC.prototype.deleteController = async function(id) {
    try {
      await fetchJSON(this.url + '/' + id, {
        method: 'DELETE'
      });
      this.listController();  
    } catch(error) {
      console.error(error);
    }
  };

  TaskVC.prototype.resetController = async function() {
    try {
      await fetchJSON(this.url + '/reset', {
        method: 'PUT'
      });
      this.listController();  
    } catch(error) {
      console.error(error);
    }
  };


  // ROUTER
  TaskVC.prototype.eventsController = function() {
    $(document).on('click', this.id+' .list',   () => this.listController());
    $(document).on('click', this.id+' .list_a', () => {this.active = !this.active; this.listController();});
    $(document).on('click', this.id+' .new',    () => this.newController());
    $(document).on('click', this.id+' .edit',   (e)=> this.editController(Number($(e.currentTarget).attr('taskid'))));
    $(document).on('click', this.id+' .create', () => this.createController());
    $(document).on('click', this.id+' .update', (e)=> this.updateController(Number($(e.currentTarget).attr('taskid'))));
    $(document).on('click', this.id+' .switch', (e)=> this.switchController(Number($(e.currentTarget).attr('taskid'))));
    $(document).on('click', this.id+' .delete', (e)=> this.deleteController(Number($(e.currentTarget).attr('taskid'))));
    $(document).on('click', this.id+' .reset',  (e)=> this.resetController());
    $(document).on('input', this.id+' .iopage', () => {this.itemsOnPage = Number($(this.id+' .iopage').val()); this.currentPage = 1; this.listController();});
    $(document).on('input', this.id+' .search', () => {this.search = $(this.id+' .search').val(); this.listController();});
    $(document).on('click', this.id+' .dsearch',() => {this.search = ''; this.listController();});
    $(document).on('click', this.id+' .uporder',() => {this.order = {};             this.listController();});
    $(document).on('click', this.id+' .doorder',() => {this.order = {title: false}; this.listController();});
    $(document).on('click', this.id+' .noorder',() => {this.order = {title: true};  this.listController();});
    $(document).on('keypress', this.id+' .form',(e) => {if (e.keyCode === 13) $(this.id+ " button[type=submit]").trigger("click");});
  };

  this.listController();
  this.eventsController();
}

// Creation of an object View-Controller for the tasks
let task_vc = new TaskVC('http://localhost:8000/tasks');
let task_vch = new TaskVC('http://ubiwan.epsevg.upc.edu:3001/tasks', 'Remote task', '#home_tasks');
});
