const Model = () => {
    let list=[] ;
    const returnObject = {
      addTodo: function(name){
        const todo={
          name,
          id:Math.random().toString(16).slice(2),
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
      }

    }
    
    return returnObject;
   }
   
const View = () => {
  function getTodoHtmlString(todo){
    return `
      <div class="todos">
        <div>${todo.name}</div>
        
        <div class="check">
        <button class="delete" onclick="onDeletion(event)" data-tdid="${todo.id}">🗑️</button>
        <input type="checkbox" onchange="onInputChange(event)" data-tdid="${todo.id}" ${todo.isComplete?"checked":""}></div>
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