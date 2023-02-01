const Model = () => {
    let list=[] ;
    const returnObject = {
      addTodo: function(name){
        const todo={
          name,
          id:Math.random().toString(16).slice(2), //ok
          isComplete:false
        }
        list.push(todo);
        localStorage.setItem("tasks",JSON.stringify(list));
        return todo;
      },

      delTodo: function(id){
        const idx=list.findIndex((x,i,list) => x.id===id);
        list.splice(idx,1);
        localStorage.setItem("tasks",JSON.stringify(list));
      },

      toggleCompleted: function (id) {
        let return_value;
        list.forEach((x,i,list)=>{
            if(x.id==id){
                x.isComplete=!(x.isComplete);
                return_value=x.isComplete;
            }
            
        })
        localStorage.setItem("tasks",JSON.stringify(list));
        return return_value;
      },

      getTodo: function(id){
        return list.find((x,i,list)=>{
            return x.id==id;
        })
      },

      getTodoList: function(){
        return list.slice(0);
      },

      loadfromlocal: function(){
        let tasks=JSON.parse(localStorage.getItem("tasks")) ||[];
        list=tasks;
      },

      updateTodo: function(id,name){
        const reqTodo=list.find((todo)=>todo.id==id);
        reqTodo.name=name;
        localStorage.setItem("tasks",JSON.stringify(list));
      }

    }
    
    return returnObject;
   }
   
const View = () => {
  function getTodoHtmlString(todo){
    return `
      <div class="todos ${todo.isComplete?"done":""}">
        <div class="name">${todo.name}</div>
        <input class="edit" type="text" value="${todo.name}">
        <div class="check">
        <button class="edit-btn" onclick="onEdit(event)" >🖊️</button>
        <button class="save-btn" onclick="onSaving(event)" data-tdid="${todo.id}">✔️</button>
        <button class="delete" onclick="onDeletion(event)" data-tdid="${todo.id}">🗑️</button>
        <input type="checkbox" onchange="onInputChange(event)" data-tdid="${todo.id}" ${todo.isComplete?"checked":""}>
        
        </div>
      </div>
    
    `
  }


  const obj={
    showTodoList: function(todos=[]){
      const rootEl=document.getElementById("root");
      const htmlstringArray=todos.map((todo)=>getTodoHtmlString(todo));
      const htmlString=htmlstringArray.join("");
      rootEl.innerHTML=htmlString;  
    },

    insertTodo: function(todo){
      const rootEl=document.getElementById("root");
      rootEl.insertAdjacentHTML("beforeend",getTodoHtmlString(todo));
    }
  }
  return obj;
}
let model,view;
function init(){
   model=Model();
   view= View();
  const onButtonClick=()=>{
    const todoname=document.getElementById("addinput").value;
    document.getElementById("addinput").value="";
    const ref=model.addTodo(todoname);
    view.insertTodo(ref);
    
  }
  document.getElementById("addbutton").addEventListener("click",onButtonClick);
  
  model.loadfromlocal();
  view.showTodoList(model.getTodoList());

}

init();
function onInputChange(e){
  const id=e.target.getAttribute("data-tdid");
  model.toggleCompleted(id);
  view.showTodoList(model.getTodoList());
}
function onDeletion(e){
  const id=e.target.getAttribute("data-tdid");
  model.delTodo(id);
  view.showTodoList(model.getTodoList());
}

function onEdit(e){
  const todoEl=e.target.closest(".todos");
  todoEl.classList.add("editing");
}

function onSaving(e){
  const todoEl=e.target.closest(".todos");
  todoEl.classList.remove("editing");
  const inputEl=todoEl.querySelector(".edit");
  model.updateTodo(e.target.getAttribute("data-tdid"),inputEl.value);
  view.showTodoList(model.getTodoList());
}
