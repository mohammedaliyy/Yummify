const input = document.querySelectorAll(".header__input")[0];
const search = document.querySelectorAll(".header__loupe")[0];
search.addEventListener("click", (e) => {
  let foodsArr = [];
  const childs = document.querySelectorAll(".body__foodbox");
  const bodyPag = document.querySelector(".body__pagination");
  if (bodyPag != null) {
    bodyPag.remove()
  }
  childs.forEach((e) => {
    e.remove();
    console.log("removing");
  });
  e.preventDefault();
  const product = input.value.toLowerCase();

  API_KEY = "012568df-07a1-4b75-8bd3-3ceb408ebd3d";
  URL = `https://forkify-api.herokuapp.com/api/v2/recipes?search=${product}&key=${API_KEY}`;
  input.value = ""

  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      const foods = data.data.recipes;
      const size = 10;

      for (let i = 0; i < foods.length; i += size) {
        const subArray = foods.slice(i, i + size);
        foodsArr.push(subArray);
      }
    })
    .catch((error) => console.log(error));

  //Pagination Config
  let page = 0;

  const bodyLeft = document.getElementsByClassName("body__left")[0];
  const pagination = document.createElement("div");
  pagination.classList.add("body__pagination");
  const left = document.createElement("span");
  const right = document.createElement("span");
  pagination.append(left, right);
  bodyLeft.appendChild(pagination);

  function letsGo(foods, page) {
    left.textContent = `< Page ${page + 1}`;
    right.textContent =
      foodsArr.length >= page + 2 ? `Page ${page + 2} >` : "Last";
    const childs = document.querySelectorAll(".body__foodbox");
    childs.forEach((e) => {
      e.remove();
    });
    for (let i = 0; i < foods.length; i++) {
      const div = document.createElement("div");
      div.classList.add("body__foodbox");
      div.setAttribute("id", foods[i].id);
      const publisher = foods[i].publisher;
      const image_url = foods[i].image_url;
      const title =
        foods[i].title.length > 25
          ? `${foods[i].title.slice(0, 22)}...`
          : foods[i].title;

      const image = document.createElement("img");
      image.setAttribute("src", image_url);

      const body = document.createElement("div");
      body.classList.add("body__text");
      const h4 = document.createElement("h4");
      const span = document.createElement("span");

      h4.textContent = title;
      span.textContent = publisher;

      body.append(h4, span);

      const bodyLeft = document.getElementsByClassName("body__left")[0];
      div.append(image, body);
      bodyLeft.appendChild(div);
    }
  }

  setTimeout(() => {
    letsGo(foodsArr[0], page);
  }, 2000);

  const minus = document.querySelectorAll(".body__pagination span")[0];
  const plus = document.querySelectorAll(".body__pagination span")[1];

  minus.addEventListener("click", (e) => {
    if (page > 0) {
      page--;
      letsGo(foodsArr[page], page);
      takeId(0);
    }
  });

  plus.addEventListener("click", (e) => {
    if (page < foodsArr.length - 1) {
      page++;
      letsGo(foodsArr[page], page);
      takeId(0);
    }
  });

  // Information about specific food

  function takeId(s = 2000) {
    setTimeout(() => {
      const childs = document.querySelectorAll(".body__foodbox");
      childs.forEach((e) => {
        e.addEventListener("click", () => {
          const id = e.getAttribute("id");
          const getUrl = `https://forkify-api.herokuapp.com/api/v2/recipes/${id}?key=${API_KEY}`

          fetch(getUrl)
          .then(response=> response.json())
          .then(data => console.log(data))
          .catch(error => console.log(error))
        });
      });
    }, s);
  }
  takeId();
});
