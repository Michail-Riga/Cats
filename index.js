const $wrapper = document.querySelector('[data-wrapper]')
const $addBtn = document.querySelector('[data-add_button]')
const $modalAdd = document.querySelector('[data-modal]')
const $formErrorMsg = document.querySelector('[data-errmsg]')

const HIDDEN_CLASS = 'hidden'

const generateCatCard = (cat) => {

   return (
    `<div data-card_id=${cat.id} class="card mx-2" style="width: 18rem">
        <img 
        src="${cat.image}"
        class="card-img-top"
        alt="фото кота"/>
        
        <div class="card-body">
          <h5 class="card-title">${cat.name}</h5>
          <p class="card-text">${cat.description}</p>
          <button type="button" data-action="open" class="btn btn-primary">Open</button>
          <button type="button" data-action="edit" class="btn btn-warning">Edit</button>
          <button type="button" data-action="delete" class="btn btn-danger">Delete</button>
          <button type="button" data-action="info" class="btn btn-${cat.favorite ? 'info' : 'dark'}">Info</button>
          </div>
      </div>`
   )

}
/*api.getAllCats()
.then(res=>{
console.log({res});

return res.json()
})
.then(data => {
    console.log(data);

    data.forEach(cat => {
        $wrapper.insertAdjacentHTML('afterbegin', generateCatCard(cat))
        
    });

})*/
$wrapper.addEventListener('click', async (event) => {
    const targetElement = event.target;
    const action = targetElement.dataset.action;
    /*if (event.target.dataset.action === 'delete') {
        console.log(2);
    }*/
    
    if (event.target === $wrapper) return;
    const $currentCard = targetElement.closest('[data-card_id]');
    const catId = $currentCard.dataset.card_id;

    switch (action) {
        case 'delete':
            try {
            const res = await api.deleteCat(catId);
            const responce = await res.json();
            if(!res.ok) throw Error(responce.message)
           // alert(responce.message)
            //console.log(responce);
            $currentCard.remove()//удаляет кота без обновления страницы
            } catch (error) {
              console.log(error);
            }
            break;

        case 'open':
            //открывается модалка, где расположена подробная информация о коте
            //должен происходить какой-то запрос на бэк о всей информации о конкретном коте по id
            //вывести в модальном окне
            break;

        case 'edit':
            //открывается модалка с формой
             //должен происходить какой-то запрос на бэк о всей информации о конкретном коте по id
             //форма уже заполнена информацией о коте
            break;

        case 'info':
             // если favorite то класс success, если нет то dark
            const res = await api. deleteCat(id)
            if (res.ok) {
            if (event.target.className === 'btn-btn-dark') {
                event.target.className === 'btn-btn-info'  
            } else {
                event.target.className === 'btn-btn-dark'
            }
        }
            break;

        default:
            break;
    }
})

$addBtn.addEventListener('click', (event) => {
    $modalAdd.classList.remove(HIDDEN_CLASS) //открываем модалку
})


//addEventListener по закрытию модалки

document.forms.add_cats_form.addEventListener('submit', async (event)=> {
    event.preventDefault();
    $formErrorMsg.innerText = ' ';
    //console.log(event.target);
    const data = Object.fromEntries(new FormData(event.target).entries());
    
    data.id = Number(data.id)
    data.age = Number(data.age)
    data.rate = Number(data.rate)
    data.favorite = !!data.favorite

    //console.log(data);

    const res = await api.addNewCat(data)

    if (res.ok) {
        $wrapper.replaceChildren(); 
        getCatsFunc()
        $modalAdd.classList.add(HIDDEN_CLASS) //убираем модалку
        event.target.reset() //сброс формы
    } else {
        const responce = await res.json();
        $formErrorMsg.innerText = responce.message
        return;
    }
    
})
    //const responce = await res.json()
    //console.log(responce);

    //как-то вывести сразу этого кота(перезапросить всех котов)

const getCatsFunc = async () => {
    const res = await api.getAllCats();

    if (res.status !==200) {  //проверка на ошибку
      const $errorMessage = document.createElement('p');
      $errorMessage.classList.add('error-msg')
      $errorMessage.innerText = 'Ошибка. Выполните запрос позже.';
      return $wrapper.appendChild($errorMessage);
  } 

    const data = await res.json();

    if (data.length ===0) { //проверка на длину массива
      const $notificationMessage = document.createElement('p');
      $notificationMessage.innerText = 'Список пуст, добавьте первого кота';
      return $wrapper.appendChild($notificationMessage);
}
    data.forEach(cat => {
        $wrapper.insertAdjacentHTML("afterbegin", generateCatCard(cat))
        
    });
}
getCatsFunc()



  
