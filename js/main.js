import { Fetch } from "./fetch.js";
import { Foods } from "./foods.js";

export class Main {
  static _apiKey = "012568df-07a1-4b75-8bd3-3ceb408ebd3d";
  constructor() {
    // input handlers
    this.loupe = document.querySelector(".header__loupe");
    this.loupe.addEventListener("click", this.search.bind(this));
    document.addEventListener("keydown", this.search.bind(this));
    this.endPoint = null;

    // page nav settings
    this.page = 0;
    this.left = document.querySelector(".body__btn_left");
    this.right = document.querySelector(".body__btn_right");

    // ingredients portion manage
    this.subtract = document.querySelector(".body__icon-3");
    this.add = document.querySelector(".body__icon-4");

    // for slider toggle
    this.bookmarkBtn1 = document.querySelector(".header__bookmark_1");
    this.bookmarkBtn2 = document.querySelector(".header__bookmark_2");
    this.slider = document.querySelector(".body__slider");

    // toggling and managing slider
    this.bookmarkBtn1.addEventListener("click", (e) => {
      e.preventDefault();
      this.slider.classList.toggle("active__slider");
    });

    // for mobile slider
    this.bookmarkBtn2.addEventListener("click", (e) => {
      e.preventDefault();
      this.slider.classList.toggle("active__slider");
    });

    // add to slider (added button)
    this.addToSliderBtn = document.querySelector(".body__bookmark");
  }

  // search functionality
  search(e) {
    if (e.type == "click" || (e.type == "keydown" && e.keyCode == 13)) {
      e.preventDefault();

      // getting value from input field
      let inputVal = document.querySelector(".header__input");
      if (inputVal.value != "") {
        // sending endpoint to fetch class through letsGo function
        const product = inputVal.value.toLowerCase().trim();
        this.endPoint = `https://forkify-api.herokuapp.com/api/v2/recipes?search=${product}&key=${Main._apiKey}`;
        this.letsGo();
      } else {
        Fetch.sendMessage(
          "Invalid input entered!. Please check and search again!."
        );
      }

      // clearing input field
      inputVal.value = "";
    }
  }

  // updating textcontent of nav buttons
  updateNavText(slicedFoodsArr) {
    this.left.textContent = this.page == 0 ? `First` : `< Page ${this.page}`;
    this.right.textContent =
      slicedFoodsArr.length >= this.page + 2
        ? `Page ${this.page + 2} >`
        : "Last";
  }

  // entire logic of app
  letsGo() {
    const fetching = new Fetch(this.endPoint);
    fetching.fetchingDataMinor().then((data) => {
      // creating and appending foodboxes to body__left div
      const foods = new Foods(data);
      foods.createFoods();
      foods.oneTimeFoods(0);

      // moving to backward page
      this.left.addEventListener("click", (e) => {
        console.log("Left");

        if (this.page > 0) {
          this.page--;
          foods.oneTimeFoods(this.page);
          this.updateNavText(foods.slicedFoodsArr);
        }
      });

      // moving to forward page
      this.right.addEventListener("click", (e) => {
        console.log("Right");

        if (this.page < foods.slicedFoodsArr.length - 1) {
          this.page++;
          foods.oneTimeFoods(this.page);
          this.updateNavText(foods.slicedFoodsArr);
        }
      });

      // active/clicked foodbox
      foods.activeFoodbox(Main._apiKey, foods.foodsArr);

      // adding portion of ingredients
      this.add.addEventListener("click", (e) => {
        foods.servings++;
        foods.manageIngredientsPortion(foods.servings);
      });

      // subtracting portion of ingredients
      this.subtract.addEventListener("click", (e) => {
        foods.servings--;
        foods.manageIngredientsPortion(foods.servings);
      });

      // adding to slider handler
      this.addToSliderBtn.addEventListener("click", (e) => {
        foods.addToSlider();
      });
    });
  }
}

const main = new Main();
