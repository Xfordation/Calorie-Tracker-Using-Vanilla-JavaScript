//Storage
const storage = (function () {
  // Public methods
  return {
    storeData: function (item) {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemsFromStorage: function () {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateStorage: function (update) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach(function (item, index) {
        if (update.id === item.id) {
          items.splice(index, 1, update);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteStorage: function (dele) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function (item, index) {
        if (dele === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearStorage: function () {
      localStorage.removeItem("items");
    },
  };
})();

//Item
const Item = (function () {
  const item = function (id, name, calorie) {
    this.id = id;
    this.name = name;
    this.calorie = calorie;
  };

  //State
  const state = {
    items: storage.getItemsFromStorage(),
    currentItem: null,
    totalCalorie: 0,
  };

  //public
  return {
    getStateItems: function () {
      return state.items;
    },
    logState: function () {
      return state;
    },
    additem: function (name, calorie) {
      let ID;
      if (state.items.length > 0) {
        ID = state.items[state.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      //Converting it Calories to a Number
      calorie = parseInt(calorie);
      const newItem = new item(ID, name, calorie);
      state.items.push(newItem);
      return newItem;
    },
    getTotalCalorie: function () {
      let tot = 0;
      state.items.forEach((i) => {
        tot += i.calorie;
      });
      state.totalCalorie = tot;
      return state.totalCalorie;
    },
    getitemById: function (id) {
      let found = null;
      state.items.forEach((i) => {
        if (i.id === id) {
          found = i;
        }
      });
      return found;
    },
    setCurrentItem: function (item) {
      state.currentItem = item;
    },
    getCurrentItem: function () {
      return state.currentItem;
    },
    update: function (name, calorie) {
      calorie = parseInt(calorie);
      let found = null;
      state.items.forEach((i) => {
        if (i.id === state.currentItem.id) {
          i.name = name;
          i.calorie = calorie;
          found = i;
        }
      });
      return found;
    },
    DeleteCurrentItem: function (curritem) {
      //Get Current Element ID using Map (HOAM)
      const id = state.items.map((i) => {
        return i.id;
      });
      const index = id.indexOf(curritem);
      state.items.shift(index);
    },
    ClearAllItems: function () {
      state.items = [];
    },
  };
})();

//UI
const UI = (function () {
  //Html Element ID's
  const elid = {
    tableid: "table",
    tableItem: "#table tr",
    addbtn: "addbtn",
    updatebtn: "updatebtn",
    deletebtn: "deletebtn",
    backbtn: "backbtn",
    addname: "t1",
    addcalorie: "t2",
    totcal: "totcal",
    edit: "edit",
    clearbtn: "clearbtn",
  };

  //public
  return {
    populateItems: function (items) {
      let op = `<tr>
          <th>Item</th>
          <th>Calorie</th>
          <th>Edit Meal</th>
        </tr>`;
      items.forEach((i) => {
        op += `<tr id="item-${i.id}">
          <td>${i.name}</td>
          <td>${i.calorie}</td>
          <td><i class="tiny material-icons" id='edit'>create</i></td>
        </tr>`;
      });
      document.getElementById(elid.tableid).innerHTML = op;
    },
    getSelector: function () {
      return elid;
    },
    getinput: function () {
      return {
        name: document.getElementById(elid.addname).value,
        calorie: document.getElementById(elid.addcalorie).value,
      };
    },
    addItemTable: function (item) {
      document.getElementById(elid.tableid).style.display = "table";
      const tr = document.createElement("tr");
      tr.id = `item-${item.id}`;
      tr.innerHTML = `<td>${item.name}</td>
          <td>${item.calorie}</td>
          <td><i class="tiny material-icons ed" id="edit">create</i></td>`;
      document
        .getElementById(elid.tableid)
        .insertAdjacentElement("beforeend", tr);
    },
    clearField: function () {
      document.getElementById(elid.addname).value = "";
      document.getElementById(elid.addcalorie).value = "";
    },
    hideTable: function () {
      document.getElementById(elid.tableid).style.display = "none";
    },
    disptotcal: function (totcal) {
      document.getElementById(elid.totcal).textContent = totcal;
    },
    editStatenone: function () {
      UI.clearField();
      document.getElementById(elid.addbtn).style.display = "inline";
      document.getElementById(elid.updatebtn).style.display = "none";
      document.getElementById(elid.deletebtn).style.display = "none";
      document.getElementById(elid.backbtn).style.display = "none";
    },
    addToForm: function () {
      document.getElementById(elid.addname).value = Item.getCurrentItem().name;
      document.getElementById(
        elid.addcalorie
      ).value = Item.getCurrentItem().calorie;
    },
    editstateshow: function () {
      document.getElementById(elid.addbtn).style.display = "none";
      document.getElementById(elid.updatebtn).style.display = "inline";
      document.getElementById(elid.deletebtn).style.display = "inline";
      document.getElementById(elid.backbtn).style.display = "inline";
    },
    updatetbl: function (updateItem) {
      let tableitem = document.querySelectorAll(elid.tableItem);
      tableitem = Array.from(tableitem);

      tableitem.forEach((i) => {
        const itemId = i.getAttribute("id");

        if (itemId === `item-${updateItem.id}`) {
          document.querySelector(
            `#${itemId}`
          ).innerHTML = `<td>${updateItem.name}</td>
          <td>${updateItem.calorie}</td>
          <td><i class="tiny material-icons ed" id="edit">create</i></td>`;
        }
      });
    },
    DeleteFromUI: function (id) {
      const itmid = `#item-${id}`;
      const itm = document.querySelector(itmid);
      itm.remove();
    },
    ClearAllItems: function () {
      let tableItem = document.querySelectorAll(elid.tableItem);
      tableItem = Array.from(tableItem);

      //Looping Through Each Item And Removing Them
      tableItem.forEach((i) => {
        i.remove();
      });
    },
  };
})();

//Main
const main = (function (Item, UI) {
  //event listener
  const EventListener = function () {
    const elid = UI.getSelector();

    //Add Element to the Table
    document.getElementById(elid.addbtn).addEventListener("click", additem);

    //Disable Enter Key
    document.addEventListener("keypress", (e) => {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    //Edit Element in the Table
    document.getElementById(elid.tableid).addEventListener("click", edititem);

    //Update Item
    document
      .getElementById(elid.updatebtn)
      .addEventListener("click", updateitem);

    //Back / Clear Text
    document.getElementById(elid.backbtn).addEventListener("click", (e) => {
      e.preventDefault();
      UI.editStatenone();
    });

    //Delete Button Funtion
    document
      .getElementById(elid.deletebtn)
      .addEventListener("click", deleteItem);

    //Clear All Items Function
    document.getElementById(elid.clearbtn).addEventListener("click", ClearAll);
  };

  const additem = function (e) {
    e.preventDefault();
    const input = UI.getinput();

    //Field Empty or not
    if (input.name !== "" && input.calorie !== "") {
      const add = Item.additem(input.name, input.calorie);

      //Adding Item
      UI.addItemTable(add);

      //Get And Display Total Calorie
      const totcal = Item.getTotalCalorie();
      UI.disptotcal(totcal);

      //Adding To Local Storage
      storage.storeData(add);

      //Clearing Field
      UI.clearField();
    } else {
      //Displaying an Alert Box for 4 Seconds
      const alert = document.getElementById("alert");
      alert.className = "alert";
      alert.style.display = "grid";
      setTimeout(() => {
        alert.style.display = "none";
        alert.classList.remove("alert");
      }, 3000);
    }
  };

  //Edt State Function
  const edititem = function (e) {
    e.preventDefault();
    if (e.target.classList.contains("ed")) {
      const tableitem = e.target.parentNode.parentNode.id;

      //Split " - "
      const tableIdarr = tableitem.split("-");

      //ParseInt and Selecting only the Id part
      const id = parseInt(tableIdarr[1]);
      const itemToEdit = Item.getitemById(id);

      //Set Current ITEM
      Item.setCurrentItem(itemToEdit);

      //Add to Form
      UI.addToForm();

      //Displaying Update and Delete Buttons
      UI.editstateshow();
    }
  };

  //Update State Function
  const updateitem = function (e) {
    e.preventDefault();

    //Get Input
    const input = UI.getinput();

    //Update item
    const update = Item.update(input.name, input.calorie);

    //Displaing Updated Item to UI
    UI.updatetbl(update);

    //Get And Display Total Calorie
    const totcal = Item.getTotalCalorie();
    UI.disptotcal(totcal);

    //Local Storage
    storage.updateStorage(update);

    //Hide Update and Delete Buttons
    UI.editStatenone();

    //Clear all Fields
    UI.clearField();
  };

  //Delete Item
  const deleteItem = function (e) {
    e.preventDefault();
    const currItem = Item.getCurrentItem();
    Item.DeleteCurrentItem(currItem.id);

    //Delete from UI
    UI.DeleteFromUI(currItem.id);
    const totcal = Item.getTotalCalorie();
    UI.disptotcal(totcal);

    //Local Storage Delete
    storage.deleteStorage(currItem.id);

    //Hidetable
    UI.hideTable();

    //Hide Update and Delete Buttons
    UI.editStatenone();

    //Clear All Fields
    UI.clearField();
  };

  //Clear All
  const ClearAll = function () {
    Item.ClearAllItems();

    //Clearing Form the UI
    UI.ClearAllItems();

    const totcal = Item.getTotalCalorie();
    UI.disptotcal(totcal);

    //Local Sorage Clear
    storage.clearStorage();

    //Clear field
    UI.clearField();

    //Hide Update ANd Delete Buttons
    UI.editStatenone();

    //Hide Table
    UI.hideTable();
  };

  //public
  return {
    initialize: function () {
      UI.editStatenone();

      //Items
      const items = Item.getStateItems();

      //Check for Items
      if (items.length === 0) {
        //Hide Table
        UI.hideTable();
      } else {
        //UI
        UI.populateItems(items);
      }

      //Get And Display Total Calorie
      const totcal = Item.getTotalCalorie();
      UI.disptotcal(totcal);

      //Events
      EventListener();
    },
  };
})(Item, UI);

//Caller
main.initialize();
