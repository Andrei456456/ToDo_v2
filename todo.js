
class Task {
    //id
    //title Загаловок
    //isDone закончен - незакончен true-false
    //toggle() проверка выполнено - не выполнено
    constructor(id, title, date, isDone,) {// toggle) {
        this._id = id;
        this._title = title;
        this._date = date;
        this._isDone = isDone;
        //this._toggle = toggle;
        this._taskObj = {
            'id': this._id,
            'title': this._title,
            'date': this._date,
            'isDone': this._isDone,
            }
    }
    get idTask() {
        return this._id;
    }
    get titleTask() {
        return this._title;
    }
    get dateTask() {
        return this._date;
    }
    get isDoneTask() {
        return this._isDone;
    }
    // get toggleTask() {
    //     return this._toggle;
    // }
    getTask() {
        return this._taskObj;
    }

    static parse({ id, title, date, isDone }) {
        return new Task(
            id,
            title,
            date,
            isDone
        );
    }

    static deparse({ id, title, date,isDone }) {
        return JSON.stringify({
            id,
            title,
            date,
            isDone,
        });
    }

}

class AbstractStore {
    //addtask(task) -> Promise<Task> возвращает обещание
   //обернуть чтобы сымитировать задкржку времени.
    //removeTask(id) -> Promise<Task> возвращает обещание
   
    //updateTask(task) -> Promise<Task> возвращает обещание
}



//class Store extends AbstractStore {
class Store {
        constructor() {
            this._dbTasks = [];
        }

    checkStore() {
        return this._dbTasks.length !== 0 ;
    }
    //addTask(task) -> Promise<Task> возвращает обещание
    addTask(task) {
        this._dbTasks.push(task);
    }

    getBaseTasks() {
        return this._dbTasks;
    }

    getlastTask() {
        return this._dbTasks[this._dbTasks.length - 1];
    }

    //removeTask(id) -> Promise<Task> возвращает обещание
    removeTask(id) {
        const newBaseTasks = []; 
        this._dbTasks.forEach((task) => {
            if( task.id !== id) {
               newBaseTasks.push(task);
           }
        });
        this._dbTasks = newBaseTasks;
        console.log(this._dbTasks);
    }
   
    //updateTask(task) -> Promise<Task> возвращает обещание
    updateTask(id) {
        let newIsDone = '';
        this._dbTasks.forEach((task) => {
            if( task.id === id) {
                task.isDone = (task.isDone) ? false : true; 
                newIsDone = task.isDone; 
           }
        });
        console.log(this._dbTasks);
        return newIsDone;
    }

}

class StoreLS {//extends AbstractStore {

    checkStore() {
        //console.log(localStorage.getItem('dbTasks') !== null );
        
        return  new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('checkStore');
                resolve(localStorage.getItem('dbTasks') !== null);
            }, 2000);
        });
    }
    
    getBaseTasks() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('getBaseTasks');
                resolve(JSON.parse(localStorage.getItem('dbTasks')));
            }, 2000);
        });
    }

    addTask(task) {
        new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('addTasks');
            if (this.checkStore()) {
                let currentBase = this.getBaseTasks();
                localStorage.removeItem('dbTasks');
                currentBase.push(task);
                resolve( localStorage.setItem('dbTasks', JSON.stringify(currentBase)));
            } else {
                let currentBase = [];
                currentBase.push(task); 
                resolve(localStorage.setItem('dbTasks', JSON.stringify(currentBase)));
            }
            }, 2000);
        });
    }

    getlastTask() {
        const currentBase = this.getBaseTasks(); 
        return currentBase[currentBase.length - 1];
    }

    removeTask(id) {
        const currentBase = this.getBaseTasks();
        localStorage.removeItem('dbTasks');

        const newBaseTasks = []; 
        //console.log(id);
        currentBase.forEach((task) => {
            //console.log(task.id);
            if( task.id !== id) {
               newBaseTasks.push(task);
           }
        });
        localStorage.setItem('dbTasks', JSON.stringify(newBaseTasks));
      
    }
   
    updateTask(id) {
        let newIsDone = '';
        const currentBase = this.getBaseTasks();
        localStorage.removeItem('dbTasks');


        currentBase.forEach((task) => {
            if( task.id === id) {
                task.isDone = (task.isDone) ? false : true; 
                newIsDone = task.isDone; 
           }
        });
        localStorage.setItem('dbTasks', JSON.stringify(currentBase));
        return newIsDone;
    }

    //addTask(task) -> Promise<Task> возвращает обещание
   
    //removeTask(id) -> Promise<Task> возвращает обещание
   
    //updateTask(task) -> Promise<Task> возвращает обещание
}


class StoreHTTP extends AbstractStore {
    //addTask(task) -> Promise<Task> возвращает обещание
   
    //removeTask(id) -> Promise<Task> возвращает обещание
   
    //updateTask(task) -> Promise<Task> возвращает обещание
   
}
   

class TaskManager {  //полиморфный
    constructor(store) {
        // if(!(store instanceof AbstractStore)){
        //     throw new Error(//taskManager может работать только со Store которые наследники абстрактного Store
        //         );
        // }
        this.store = store;

    }

    checkStore() {
        return this.store.checkStore();
    }

    getStore() {
        return this.store.getBaseTasks();
    }

    //делает все самостоятельно
    createTask(title, date) {
        this.id = `task${Date.now()}`;
        this.isDone = false;
        const newTask = new Task(this.id, title, date, this.isDone).getTask();
        this.store.addTask(newTask);
    }

    getLastTask() {
        return this.store.getlastTask();
    }

    deleteTask(id) {
        this.store.removeTask(id);
    }

    isDoneTask(id) {
       return this.store.updateTask(id);
    }
    //toggleTask(id)
}

class Render {
    constructor(taskContainerRef) {
        this.taskContainerRef = taskContainerRef;
    }
    
    render(task) {
        //{id:'', title:'', date:'', isDone:''}
        const div = document.createElement("div");
        div.setAttribute('id', `${task.id}`);

        const title = document.createElement("p");
        title.textContent = task.title;
        const date = document.createElement("p");
        date.textContent = task.date;
  
        const buttonSave = document.createElement("button");
        if (task.isDone === true) {
          div.classList.add('done-todo');
          buttonSave.classList.add('td-item-buttonSave-true');
        }
        buttonSave.textContent = "Done";
      
        const buttonDelete = document.createElement("button");
      
        buttonDelete.textContent = "Delete";
  
        const styleViewTasksItem = [
          { name: div, arrClasses: ['td-item']},
          { name: title, arrClasses: ['td-item-title']},
          { name: date, arrClasses: ['td-item-date']},
          { name: buttonSave, arrClasses: ['td-item-buttonSave','td-item-button']},
          { name: buttonDelete, arrClasses: ['td-item-buttonDelete', 'td-item-button']},
        ];
        styleViewTasksItem.forEach( item => {
          this._setTasksClasses(item.name, item.arrClasses);
        });

        div.appendChild(title);
        div.appendChild(date);
        div.appendChild(buttonSave);
        div.appendChild(buttonDelete);
  
        this.taskContainerRef.appendChild(div);
    }

    _setTasksClasses(name, arrClasses) {
        for (let item of arrClasses ) {
          name.classList.add(item);
        }
    }
  
    resetInputsTitleDate() {
        const inputTitleRef = document.querySelector(".title");
        const inputDateRef = document.querySelector(".date");
        inputTitleRef.value = "";
        inputDateRef.value = "";
    }
    
    removeTaskById(id) {
        const taskRef = document.querySelector(`#${id}`);
        taskRef.remove();
    }

    renderSingleTaskById(id, isDone) { 
        const taskRef = document.querySelector(`#${id}`);
        const buttonRef = document.querySelector(`#${id} > .td-item-buttonSave`);
        if (isDone === true) {
        taskRef.classList.add('done-todo');
        buttonRef.classList.add('td-item-buttonSave-true');
        } else {
            taskRef.classList.remove('done-todo');
            buttonRef.classList.remove('td-item-buttonSave-true');
        }
    }
}

class Todo {
    constructor(taskManager, render) {
        this.taskManager = taskManager;
        this.render = render;
        this._actionsBase = [ 
            { 'actionName': 'Delete', 'actionLink': this.deleteTask.bind(this) },
            { 'actionName': 'Done', 'actionLink': this.doneTask.bind(this) } ];
    }

    get actionsBase() {
     return this._actionsBase;   
    }

    firstUpdateTasks() {
        let firstValueOfStore = ''; 
        const existenceDataAtStore = this.taskManager.checkStore()
        .then(() => {
            if (existenceDataAtStore) { 
                firstValueOfStore = this.taskManager.getStore()
                // .then((firstValueOfStore) => {
                    firstValueOfStore.forEach((task) => {
                        this.render.render(task);    
                    });
//});
            }
        });
    }

    addTask() {
        const inputTitleRef = document.querySelector(".title").value;
        const inputDateRef = document.querySelector(".date").value;
        console.log(`${inputTitleRef} ${inputDateRef}`);
        
        this.createTask(inputTitleRef, inputDateRef);
       
        this.render.render( this.taskManager.getLastTask());
        this.render. resetInputsTitleDate();
    }

    createTask (title, date) {
        this.taskManager.createTask(title, date);
    }

    clickTask (tasksRef) {
        const actionAfterClick = this.checkClickForAction(tasksRef);
        console.log(actionAfterClick);
        if (actionAfterClick.actionName !== '') {
            this.actionsBase.forEach( (action) => {
                if ( actionAfterClick.actionName === action.actionName) {
                    this.makeAction(action.actionLink, actionAfterClick.idElement);
                }
            });
        }
    }

    checkClickForAction(tasksRef) {
     this.tasksRef = tasksRef;
        let target = event.target;
        let actionName = '';
        let idElement = '';

        while (target !== this.tasksRef) {
            if (target.tagName === 'BUTTON') {
                this._actionsBase.forEach((element) => {
                    if (target.textContent === element.actionName) {
                        actionName = element.actionName;
                        idElement = target.parentNode.id;
                    }
                });
            }
        target = target.parentNode;
        }
        return { 'actionName': actionName,
                'idElement': idElement };
    }

    makeAction(action, arg) {
        action(arg);
    }

    deleteTask(idElement) {
        this.taskManager.deleteTask(idElement);
        this.render.removeTaskById(idElement);
    }

    doneTask(idElement) {
        const isDone = this.taskManager.isDoneTask(idElement);
        this.render.renderSingleTaskById(idElement, isDone);
    }

    //toggleTask(id)

   

}

class TodoApp {
    constructor() {      //todo) { //???? зачем здесь todo, лишнее!
       // const store = new Store();
        const store = new StoreLS();
        const taskManager = new TaskManager(store); 
        const render = new Render(document.querySelector('.tasks'), this);

        this.todo = new Todo(taskManager, render);
    }

    

    execute() {
        this.todo.firstUpdateTasks();

        const buttonCreate = document.querySelector(".btnCreate");
      
        buttonCreate.addEventListener("click", () => {
            this.todo.addTask();
        });

        const tasksRef = document.querySelector(".tasks");
        tasksRef.addEventListener("click", () => {
            this.todo.clickTask(tasksRef);
        });
    }
    
}

new TodoApp().execute();       //new Todo()).execute();