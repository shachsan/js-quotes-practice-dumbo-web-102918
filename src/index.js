// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
const quoteContainerDiv = document.getElementById('quote-list');
let inputNewQuote = document.getElementById('new-quote');
let inputAuthor = document.getElementById('author');
const submit = document.querySelector('[type="submit"]');
submit.addEventListener('click', createNewQuote)
const sort=document.getElementById('sort');
sort.addEventListener('change', sortQuotes);

fetch('http://localhost:3000/quotes')
  .then(res => res.json())
  .then(quotes => displayAllQuotes(quotes))


function displayAllQuotes (quotes) {
  // body...
  for(let quote of quotes){
    let ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    ul.setAttribute('id', quote.id);
    for(let key in quote){
      // console.log(key);
      if(key === 'quote'){
        let li = document.createElement('li');
        li.innerHTML = `<textarea class="quotes" cols = '60' readonly disabled>${quote[key]}</textarea>`;
        ul.appendChild(li);
      }else if(key === 'author'){
          let li = document.createElement('li');
        li.innerHTML = `<textarea class="authors" rows='1.5' cols = '20' readonly disabled>${quote[key]}</textarea>`;
          ul.appendChild(li);
      }
    }
      let likeButton = document.createElement('button');
      likeButton.style.backgroundColor = '#00BFFF';
      likeButton.innerText = "Like";
      likeButton.addEventListener('click', likeQuote);
      ul.appendChild(likeButton);

      let likeCtnBtn = document.createElement('button');
      likeCtnBtn.style.backgroundColor = '#00BFFF';
      likeCtnBtn.innerText = quote.likes;
      // likeCtnBtn.addEventListener('click', likeQuote);
      ul.appendChild(likeCtnBtn);

      let editBtn = document.createElement('button');
      editBtn.style.margin = "0px 10px";
      editBtn.innerText = "Edit";
      editBtn.addEventListener('click', editQuote)
      ul.appendChild(editBtn);

      let updateBtn = document.createElement('button');
      updateBtn.style.margin = "0px 10px";
      updateBtn.innerText = "Update";
      updateBtn.style.display = "none";
      // updateBtn.addEventListener('click', updateQuote)
      ul.appendChild(updateBtn);

      let delBtn = document.createElement('button');
      delBtn.style.backgroundColor = '#ff3333';
      delBtn.innerText = "Delete"
      delBtn.addEventListener('click', deleteQuote)
      ul.appendChild(delBtn);

    quoteContainerDiv.appendChild(ul);

  }

}

function createNewQuote (e) {

  e.preventDefault();
  if(inputNewQuote.value !=="" && inputAuthor.value !==""){
    let newQuote = {quote: inputNewQuote.value,
    author: inputAuthor.value,
    likes: 0}
    // console.log(newQuote);
    fetch('http://localhost:3000/quotes',{
      method: 'POST',
      headers: {"Content-Type":"application/json"},
      body:JSON.stringify(newQuote)
    }).then(res => res.json())
      .then(json =>displayAllQuotes([json]))
    }
    inputNewQuote.value="";
    inputAuthor.value="";
}


function likeQuote (e) {
  // body...
  let id = e.target.parentNode.id
  // console.log(id);
  let totalLikes=++e.target.nextElementSibling.innerText
  console.log(totalLikes);
  fetch(`http://localhost:3000/quotes/${id}`,{
    method: 'PATCH',
    headers: {"Content-Type": "application/json"},
    body:JSON.stringify({
      likes:totalLikes
    })
  })
}
function editQuote (e) {
  // body...
  let updateButton = e.target.nextElementSibling
  updateButton.style.display = "inline-block";

  //listen to update button
  updateButton.addEventListener('click', updateQuote)
  e.target.style.display = "none";
  // let id = e.target.parentNode.id
  let textareaQuote = e.target.parentNode.firstChild.firstChild
  textareaQuote.readOnly = false;
  textareaQuote.disabled = false;
  textareaQuote.style.backgroundColor = 'yellow';

  let textareaAuthor = e.target.parentNode.firstChild.nextElementSibling.firstChild
  textareaAuthor.style.backgroundColor = 'yellow';
  textareaAuthor.readOnly = false;
  textareaAuthor.disabled = false;

  //Change Edit button to Update
  // e.target.innerText = "Update";


    // .then(res => res.json())
    // .then()


}

function deleteQuote (e) {
  // body...
  let id = e.target.parentNode.id
  e.target.parentNode.remove();
  fetch(`http://localhost:3000/quotes/${id}`,{
    method: 'DELETE'})
}


function updateQuote (e) {
  // body...
  let id = e.target.parentNode.id
  let textareaQuote = e.target.parentNode.firstChild.firstChild
  let textareaAuthor = e.target.parentNode.firstChild.nextElementSibling.firstChild


  fetch(`http://localhost:3000/quotes/${id}`, {
    method: 'PATCH',
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      quote: textareaQuote.value,
      author: textareaAuthor.value
    })
  }).then(()=>{
    textareaQuote.readOnly = true;
    textareaQuote.disabled = true;
    textareaQuote.style.backgroundColor = '';

    textareaAuthor.style.backgroundColor = '';
    textareaAuthor.readOnly = true;
    textareaAuthor.disabled = true;

    e.target.style.display = 'none';
    e.target.previousElementSibling.style.display = "inline-block";

  })
}

function sortQuotes (e) {
  // console.log(e.target.value);
    fetch('http://localhost:3000/quotes')
      .then(res => res.json())
      .then(quotes => sortByBoth (quotes, e))

      //  {
      //   // body...
      //   if(e.target.value==="author"){
      //     debugger;
      //     sortByAuthors(quotes);
      //   }else if(e.target.value==="likes"){
      //     sortByLikes(quotes);
      //   }
      // })
  }


function sortByBoth (quotes, e) {
  if (e.target.value==='author'){
    quotes.sort(function(a,b){
      if (a.author.toLowerCase() < b.author.toLowerCase()) //sort string ascending
         return -1
     if (a.author.toLowerCase() > b.author.toLowerCase())
         return 1
     return 0 //d

    })

  }else if (e.target.value==='likes'){
    quotes.sort(function(a,b){
      if (a.likes > b.likes) //sort string ascending
        return -1
      if (a.likes < b.likes)
        return 1
      return 0 //d

    })

  }
  while (quoteContainerDiv.hasChildNodes()){
  quoteContainerDiv.removeChild(quoteContainerDiv.firstChild)
  }
  displayAllQuotes(quotes);
}
