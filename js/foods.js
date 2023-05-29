import { Fetch } from "./fetch.js";
import { Main } from "./main.js";

// shouldn't be updated when user inputs another data
let bodyLeftFoodboxes = [];

export class Foods {
  constructor(data) {
    this.data = data;
    this.size = 10;
    this.foodsArr = [];
    this.slicedFoodsArr = [];
    this.servings = null;
    this.ingredients = null;
    this.previousServingQuantity = null;
    this.id = null;
  }

  createFoods() {
    for (let i = 0; i < this.data.length; i++) {
      const publisher = this.data[i].publisher;
      const id = this.data[i].id;
      const imageUrl = this.data[i].image_url;
      const title =
        this.data[i].title.length > 25
          ? `${this.data[i].title.slice(0, 22)}...`
          : this.data[i].title;

      // creating div for foods
      const div = document.createElement("div");
      div.classList.add("body__foodbox");
      div.setAttribute("id", id);
      div.setAttribute("data-added", "false");

      // foods image
      const image = document.createElement("img");
      image.setAttribute("src", imageUrl);

      // description (title, publisher)
      const bodyText = document.createElement("div");
      bodyText.classList.add("body__text");
      const h4 = document.createElement("h4");
      const span = document.createElement("span");

      h4.textContent = title;
      span.textContent = publisher;

      // appending description to its div
      bodyText.append(h4, span);

      // appending all food info to main foodbox div
      div.append(image, bodyText);

      // pushing to foodsArr array
      this.foodsArr.push(div);
    }

    // making array slices for page navigation
    this.sliceFoods();
  }

  sliceFoods() {
    for (let i = 0; i < this.foodsArr.length; i += this.size) {
      const subArray = this.foodsArr.slice(i, i + this.size);
      this.slicedFoodsArr.push(subArray);
    }
  }

  // one time page reveal
  oneTimeFoods(page) {
    // clearing outdated/previous childs of body__left
    const bodyLeftChilds = document.querySelectorAll(".body__foodbox");
    bodyLeftChilds.forEach((e) => {
      e.remove();
    });

    // load spinner
    Fetch.loadSpinner(".body__loading_left");

    // slicing array for only show 10 foodbox in one time
    const particularFoods = this.slicedFoodsArr[page];
    for (let i = 0; i < particularFoods.length; i++) {
      const bodyLeft = document.querySelector(".body__left");
      bodyLeft.appendChild(particularFoods[i]);
    }

    // updating slider childs
    this.getFoodboxes();
  }

  // setting retrieved data to ingredients section
  manageIngredients(ingredients) {
    // removing outdated/previous ingredients
    const removeChilds = document.querySelectorAll(".body__ingredient");
    removeChilds.forEach((e) => {
      e.remove();
    });

    for (let i = 0; i < ingredients.length; i++) {
      const ingredient = ingredients[i];
      const bodyRightIngredientsParentDiv =
        document.querySelector(".body__ingredients");
      const bodyRightIngredientsChild = document.createElement("li");
      bodyRightIngredientsChild.classList.add("body__ingredient");

      // elements for bodyRightIngredientsParentDiv's child
      const span = document.createElement("span");
      const p = document.createElement("p");
      const img = document.createElement("img");

      img.setAttribute("src", "images/select.png");

      const quantity =
        ingredient.quantity == null
          ? (span.style.display = "none")
          : parseFloat(ingredient.quantity.toFixed(3));
      span.textContent = quantity;

      const description =
        ingredient.unit == ""
          ? ingredient.description
          : ingredient.unit + " " + ingredient.description;

      p.textContent = description;

      bodyRightIngredientsChild.append(img, span, p);
      bodyRightIngredientsParentDiv.appendChild(bodyRightIngredientsChild);
    }
  }

  bookMarkActiveClass(child) {
    const bodyLeftFoodboxCon = child.getAttribute("data-added");
    const bookmarkBtn = document.querySelector(".body__bookmark");
    if (bodyLeftFoodboxCon == "false") {
      bookmarkBtn.classList.remove("added");
    } else {
      bookmarkBtn.classList.add("added");
    }
  }

  // adding event handler to all childs of bodyLeft
  activeFoodbox(apiKey, arr) {
    arr.forEach((child) => {
      child.addEventListener("click", (e) => {
        // bookmark remove/add active class
        this.bookMarkActiveClass(child);

        // fetch data
        const id = child.getAttribute("id");
        const getUrl = `https://forkify-api.herokuapp.com/api/v2/recipes/${id}?key=${apiKey}`;

        // load spinner
        Fetch.loadSpinner(".body__loading_right");

        // getting major data from api and parsing into UI
        const fetchId = new Fetch(getUrl);
        fetchId.fetchingDataMajor().then((data) => {
          // destructured data
          const cookingTime = data.cooking_time;
          const id = data.id;
          const imgUrl = data.image_url;
          const ingredients = data.ingredients;
          const publisher = data.publisher;
          const servings = data.servings;
          const sourceUrl = data.source_url;
          const title = data.title;

          // for manageIngredientsPortion() function
          this.servings = servings;
          this.ingredients = ingredients;
          this.previousServingQuantity = servings;

          // adding foodbox to slider management
          this.id = id;

          // managing to remove foodbox from slider div
          const h1 = document.querySelector(".body__img h1");
          h1.setAttribute("id", id);

          // bodyRight img and h1
          const bodyRightDivImg = document.querySelector(".body__img");
          const bodyRightH1 = document.querySelector(".body__img h1");
          bodyRightDivImg.style.backgroundImage = `url(${imgUrl})`;
          bodyRightH1.textContent = title;

          // servings
          const bodyRightServings = document.querySelector(
            ".body__servings h4 span"
          );
          bodyRightServings.textContent = servings;

          // cooking time
          const bodyRightCookingTime = document.querySelector(
            ".body__minser h4 span"
          );
          bodyRightCookingTime.textContent = cookingTime;

          // publisher
          const bodyRightPublisher =
            document.querySelector(".body__link p span");
          bodyRightPublisher.textContent = publisher;

          // link for detailed info about food
          const bodyRightCookingLink = document.querySelector(".body__link a");
          bodyRightCookingLink.setAttribute("href", sourceUrl);

          // invoking manageIngredients() function for initial UI
          this.manageIngredients(ingredients);
        });
      });
    });
  }

  // managing ingredients portion (substracting/adding)
  manageIngredientsPortion(servings) {
    if (servings > 0) {
      const bodyRightServingsQuantity = document.querySelector(
        ".body__servings h4 span"
      );
      const bodyRightIngredients = document.querySelectorAll(
        ".body__ingredient span"
      );

      bodyRightServingsQuantity.textContent = servings;

      for (let i = 0; i < this.ingredients.length; i++) {
        const dataQuantity = this.ingredients[i].quantity;
        const dataServings = this.previousServingQuantity;
        const span = bodyRightIngredients[i];

        span.textContent =
          dataQuantity != null
            ? parseFloat(((dataQuantity / dataServings) * servings).toFixed(3))
            : "";
      }
    }
  }

  getFoodboxes() {
    // removes previous childs
    const sliderChilds = document.querySelectorAll(
      ".body__slider .body__foodbox"
    );
    sliderChilds.forEach((e) => {
      e.remove();
    });

    // fetching data from local storage
    const foodboxArr = localStorage.getItem("foodboxArr");
    const myArray = JSON.parse(foodboxArr);
    if (myArray != null) {
      for (let i = 0; i < myArray.length; i++) {
        document
          .querySelector(".body__slider")
          .insertAdjacentHTML("beforeend", myArray[i]);
      }

      // adding click handler to slider childs
      const updatedSliderChilds = document.querySelectorAll(
        ".body__slider .body__foodbox"
      );
      updatedSliderChilds.forEach((child) => {
        child.addEventListener("click", (e) => {
          this.activeFoodbox(Main._apiKey, updatedSliderChilds);
        });
      });
    }
  }

  addToSlider() {
    const bookmark = document.querySelector(".body__bookmark");
    if (bookmark.classList.contains("added")) {
      // removing foodbox from bodyLeftFoodboxes if user clicks active bookmark
      for (let i = 0; i < bodyLeftFoodboxes.length; i++) {
        const div = document.createElement("div");
        div.innerHTML = bodyLeftFoodboxes[i];

        const sliderFoodboxId = div.firstElementChild.getAttribute("id");
        const bodyRightH1 = document.querySelector(".body__img h1");
        const bodyRightH1Id = bodyRightH1.getAttribute("id");

        if (sliderFoodboxId == bodyRightH1Id) {
          const indexOfFoodboxInArr = bodyLeftFoodboxes.indexOf(
            bodyLeftFoodboxes[i]
          );
          bodyLeftFoodboxes.splice(indexOfFoodboxInArr, 1);

          // updates slider div
          localStorage.setItem("foodboxArr", JSON.stringify(bodyLeftFoodboxes));
          this.getFoodboxes();

          // bookmark remove active class
          bookmark.classList.remove("added");
          for (let i = 0; i < this.foodsArr.length; i++) {
            const bodyLeftFoodboxId = this.foodsArr[i].getAttribute("id");
            const bodyLeftFoodboxCon =
              this.foodsArr[i].getAttribute("data-added");
            const bodyLeftFoodbox = this.foodsArr[i];

            if (
              bodyRightH1Id == bodyLeftFoodboxId &&
              bodyLeftFoodboxCon == "true"
            ) {
              bodyLeftFoodbox.setAttribute("data-added", "false");
            }
          }
        }
      }
    } else {
      for (let i = 0; i < this.foodsArr.length; i++) {
        const bodyLeftFoodboxId = this.foodsArr[i].getAttribute("id");
        const bodyLeftFoodboxCon = this.foodsArr[i].getAttribute("data-added");
        const bodyLeftFoodbox = this.foodsArr[i];

        if (this.id == bodyLeftFoodboxId && bodyLeftFoodboxCon == "false") {
          // added
          this.foodsArr[i].setAttribute("data-added", "true");

          // posting data to localStorage
          const bodyRightFoodbox = bodyLeftFoodbox.cloneNode(true);
          bodyLeftFoodboxes.push(bodyRightFoodbox.outerHTML);
          localStorage.setItem("foodboxArr", JSON.stringify(bodyLeftFoodboxes));

          // updates slider div
          this.getFoodboxes();

          // bookmark add/remove active class
          this.bookMarkActiveClass(this.foodsArr[i]);
        }
      }
    }
  }
}
