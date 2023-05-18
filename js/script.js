const input = document.querySelectorAll(".header__input")[0];
const search = document.querySelectorAll(".header__loupe")[0];
search.addEventListener("click", (e) => {
  setTimeout((e) => {
    const loading = document.querySelector(".body__loading");
    loading.style.display = "flex";
    setTimeout((e) => {
      loading.style.display = "none";
    }, 2500);
  }, 0);

  let foodsArr = [];
  const childs = document.querySelectorAll(".body__foodbox");
  const bodyPag = document.querySelector(".body__pagination");
  if (bodyPag != null) {
    bodyPag.remove();
  }
  childs.forEach((e) => {
    e.remove();
  });
  e.preventDefault();
  const product = input.value.toLowerCase();

  API_KEY = "012568df-07a1-4b75-8bd3-3ceb408ebd3d";
  URL = `https://forkify-api.herokuapp.com/api/v2/recipes?search=${product}&key=${API_KEY}`;
  input.value = "";

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
    left.textContent = page == 0 ? `First` : `< Page ${page}`;
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
      div.setAttribute("data-added", "false");
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
    setTimeout((e) => {
      const loading = document.querySelector(".body__loading");
      loading.style.display = "flex";
      setTimeout((e) => {
        loading.style.display = "none";
      }, 1000);
    }, 0);

    if (page > 0) {
      page--;
      letsGo(foodsArr[page], page);
      takeId(0);
    }
  });

  plus.addEventListener("click", (e) => {
    setTimeout((e) => {
      const loading = document.querySelector(".body__loading");
      loading.style.display = "flex";
      setTimeout((e) => {
        loading.style.display = "none";
      }, 1000);
    }, 0);
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
          setTimeout((e) => {
            const loading = document.querySelector(".body__loading_right");
            const h1 = document.querySelector(".body__img");
            h1.style.display = "none";
            loading.style.display = "flex";
            setTimeout((e) => {
              loading.style.display = "none";
              h1.style.display = "block";
            }, 1500);
          }, 0);

          // Bookmark
          const bookmarkBtn = document.querySelector(".body__bookmark");
          if (e.getAttribute("data-added") == "true") {
            bookmarkBtn.classList.add("added");
          } else {
            bookmarkBtn.classList.remove("added");
          }

          // Getting id
          const id = e.getAttribute("id");
          const getUrl = `https://forkify-api.herokuapp.com/api/v2/recipes/${id}?key=${API_KEY}`;

          // for bookmark use; setting id to body__right
          const bodyRight = document.querySelector(".body__right");
          bodyRight.setAttribute("id", id);

          fetch(getUrl)
            .then((response) => response.json())
            .then((data) => {
              const source = data.data.recipe;

              const imgUrl = source.image_url;
              const bodyImg = document.querySelector(".body__img");
              const h1 = document.querySelector(".body__img h1");
              bodyImg.style.backgroundImage = `url(${imgUrl})`;
              h1.textContent = source.title;

              const spanServings = document.querySelector(
                ".body__servings h4 span"
              );
              spanServings.textContent = source.servings;

              const cookingTime = document.querySelector(
                ".body__minser h4 span"
              );
              cookingTime.textContent = source.cooking_time;

              const cookedBy = document.querySelector(".body__link p span");
              cookedBy.textContent = source.publisher;

              const linkForCooking = document.querySelector(".body__link a");
              linkForCooking.setAttribute("href", source.source_url);

              // Managing ingredients
              let servings = source.servings;
              const removeChild =
                document.querySelectorAll(".body__ingredient");
              removeChild.forEach((e) => {
                e.remove();
              });

              for (let i = 0; i < source.ingredients.length; i++) {
                const data = source.ingredients[i];
                const bodyUl = document.querySelector(".body__ingredients");
                const childUl = document.createElement("li");
                childUl.classList.add("body__ingredient");

                const span = document.createElement("span");
                const p = document.createElement("p");
                const img = document.createElement("img");

                img.setAttribute("src", "images/select.png");

                const quantity =
                  data.quantity == null
                    ? (span.style.display = "none")
                    : parseFloat(data.quantity.toFixed(3));
                span.textContent = quantity;

                const description =
                  data.unit == ""
                    ? data.description
                    : data.unit + " " + data.description;

                p.textContent = description;

                childUl.append(img, span, p);
                bodyUl.appendChild(childUl);
              }

              const minus = document.querySelector(".body__icon-3");
              const plus = document.querySelector(".body__icon-4");

              function manageQuantities(servings) {
                if (servings > 0) {
                  const manageNum = document.querySelector(
                    ".body__servings h4 span"
                  );
                  const bodyIngredient = document.querySelectorAll(
                    ".body__ingredient span"
                  );
                  manageNum.textContent = servings;

                  for (let i = 0; i < source.ingredients.length; i++) {
                    const dataQuantity = source.ingredients[i].quantity;
                    const dataServings = source.servings;
                    const span = bodyIngredient[i];

                    span.textContent =
                      dataQuantity != null
                        ? parseFloat(
                            ((dataQuantity / dataServings) * servings).toFixed(
                              3
                            )
                          )
                        : "";
                  }
                }
              }

              minus.addEventListener("click", (e) => {
                e.preventDefault();
                servings--;
                manageQuantities(servings);
              });

              plus.addEventListener("click", (e) => {
                e.preventDefault();
                servings++;
                manageQuantities(servings);
              });
            })
            .catch((error) => console.log(error));
        });
      });
    }, s);
  }
  takeId();

  // Add to BookMark
  const bookmarkBtn = document.querySelector(".body__bookmark");
  const inscription = document.querySelector(".body__bookmark span");

  bookmarkBtn.addEventListener("click", (e) => {
    bookmarkBtn.classList.toggle("added");
    const allbodyFoodBox = document.querySelectorAll(".body__foodbox");
    const bodySlider = document.querySelector(".body__slider");

    allbodyFoodBox.forEach((e) => {
      const bodyRight = document.querySelector(".body__right");
      const childId = e.getAttribute("id");
      const parentId = bodyRight.getAttribute("id");
      const copyElement = e.cloneNode(true);
      copyElement.style.backgroundColor = "var(--light-background)";
      copyElement.setAttribute("id", parentId);
      copyElement.addEventListener("click", (e) => {
        takeId();
      });

      if (childId == parentId) {
        bodySlider.appendChild(copyElement);
        e.setAttribute("data-added", "true");
      }
    });

    // checking if food added to bookmark previous
    const addedFoods = document.querySelectorAll(
      ".body__slider .body__foodbox"
    );
    const bodyRight = document.querySelector(".body__right");
    addedFoods.forEach((e) => {
      const dataAdded = e.getAttribute("id");
      const bodyId = bodyRight.getAttribute("id");
      if (dataAdded == bodyId && !bookmarkBtn.classList.contains("added")) {
        e.remove();
        bookmarkBtn.classList.remove("added");
      }
    });
    if (bookmarkBtn.classList.contains("added")) {
      inscription.textContent = "Added";
    } else {
      inscription.textContent = "Add to Bookmark";
    }
  });

  bookmarkBtn.addEventListener("mouseover", (e) => {
    inscription.style.display = "flex";
  });

  bookmarkBtn.addEventListener("mouseout", (e) => {
    inscription.style.display = "none";
  });
});

// Adding to Bookmark
const btnBookmark = document.querySelector(".header__bookmark");
const bookmarkSlider = document.querySelector(".body__slider");
const btnBookmark2 = document.querySelector(".header__bookmark_2");
btnBookmark2.addEventListener("click", function (e) {
  e.preventDefault();
  bookmarkSlider.classList.toggle("active__slider");
  btnBookmark.classList.toggle("active__btnBookmark");
});

btnBookmark.addEventListener("click", (e) => {
  e.preventDefault();
  bookmarkSlider.classList.toggle("active__slider");
  btnBookmark.classList.toggle("active__btnBookmark");
});
