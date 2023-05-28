export class Fetch {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  // notifying user whether data fetched properly or not
  static sendMessage(messageText) {
    const message = document.querySelector(".message");
    const main = document.getElementsByTagName("main")[0];

    setTimeout((e) => {
      message.classList.add("message__active");
      message.textContent = messageText;
      main.classList.add("blur");

      setTimeout((e) => {
        message.classList.remove("message__active");
        main.classList.remove("blur");
      }, 3000);
    }, 1500);
  }

  // load spinner
  static loadSpinner(side) {
    const loadingLeft = document.querySelector(side);
    setTimeout((e) => {
      loadingLeft.style.display = "flex";

      setTimeout((e) => {
        loadingLeft.style.display = "none";
      }, 2500);
    }, 0);
  }

  fetchingDataMinor() {
    return fetch(this.endpoint)
      .then((response) => response.json())
      .then((data) => {
        // loading spinner
        Fetch.loadSpinner(".body__loading_left");

        // checking whether data is exists or not if not then user will be notified
        const dataArr = data.data.recipes;
        if (dataArr.length == 0) {
          Fetch.sendMessage(
            "The data that you are searching for is not avaliable!."
          );
        }
        return dataArr;
      })
      .catch((error) => {
        Fetch.sendMessage(`${error}`);
        throw new Error("Could not fetch the data!. Please try again!.");
      });
  }

  fetchingDataMajor() {
    return fetch(this.endpoint)
    .then((response) => response.json())
    .then((data)=>{
      const dataArr = data.data.recipe
      return dataArr
    })
    .catch((error) => {
      Fetch.sendMessage(`${error}`)
      throw new Error("Could not fetch the data!. Please try again!.");
    })
  }
}