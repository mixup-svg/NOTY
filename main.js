"use strict";
document.addEventListener("DOMContentLoaded", () => {
  document.body.style.display = "grid";

  const checkUserAuthentication = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const path = window.location.pathname;
    const isLoginPage = path === "/" || path.includes("main.html");

    if (!isLoggedIn && isLoginPage) {
      window.location.href = "index.html";
    }
  };

  // Run authentication checks
  checkUserAuthentication();

  const popupTemplate = `
    <div class="main-pop-up">
      <div class="pop-up">
        <span class="close-popup" style="cursor: pointer; font-size: 20px;background-color:pink; padding:10px;border-radius:50%;margin-bottom: 10px;font-weight:900;display:inline-flex;justify-content:center;"><ion-icon name="close-outline"></ion-icon></span>
        <form>
          <label for="note-title">Title:</label>
          <input type="text" id="note-title" placeholder="Enter title" />
          <label for="note-description">Description:</label>
          <textarea id="note-description" placeholder="Description"></textarea>
          <label for="note-date">Date:</label>
          <input type="date" class="pop-up-date" id="note-date" />
          <div style="display: flex; justify-content: space-between; gap: 10px;">
            <button type="button" class="submit-note">Save</button>
            <button type="button" class="delete-note" style="cursor:pointer; background-color:pink;border-radius: 10px;border:none;color:white;padding:10px; display: none;">Delete</button>
          </div>
        </form>
      </div>
    </div>
  `;

  const addNoteButtons = document.querySelectorAll(".add-notes, .main-btn");
  const notesContainer = document.querySelector(".notes-class");
  const searchInput = document.querySelector(".search-text");
  const navAside = document.querySelector(".nav-aside");
  const menuIcon = document.querySelector(".menu-icon");
  const openIcon = document.querySelector(".menu-open-icon");
  const closeIcon = document.querySelector(".menu-close-icon");
  const header = document.querySelector(".main-header");
  const logOut = document.querySelector(".logout-btn");
  const filterByAlphabets = document.querySelector(".filter-search-alpha");
  const filterBydate = document.querySelector(".filter-search-date");
  let editingNote = null;
  let isPopupOpen = false; // Track if the popup is currently open
  let isAlphaAsc = true; // Track if alphabetical sort is ascending
  let isDateAsc = true; // Track if date sort is ascending

  // Load notes from localStorage
  const loadNotes = () => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    notesContainer.innerHTML = ""; // Clear current notes
    savedNotes.forEach((note) => {
      const newNote = document.createElement("button");
      newNote.classList.add("page", "show-notes");
      newNote.innerHTML = `
        <h2 class="note-title">${note.title}</h2>
        <p class="note-description">${note.description}</p>
        <p class="note-date">${note.date}</p>
      `;
      newNote.addEventListener("click", () => {
        showPopup(note.title, note.description, note.date, true); // Edit mode
        editingNote = newNote;
      });
      notesContainer.appendChild(newNote);
    });
  };

  // Save notes to localStorage
  const saveNotesToLocalStorage = () => {
    const notes = [];
    document.querySelectorAll(".show-notes").forEach((noteElement) => {
      const title = noteElement.querySelector(".note-title").textContent;
      const description =
        noteElement.querySelector(".note-description").textContent;
      const date = noteElement.querySelector(".note-date").textContent;
      notes.push({ title, description, date });
    });
    localStorage.setItem("notes", JSON.stringify(notes));
  };

  // Show Popup for creating/editing notes
  const showPopup = (
    title = "",
    description = "",
    date = "",
    isEditing = false
  ) => {
    if (isPopupOpen) return; // Prevent opening a new popup if one is already open

    isPopupOpen = true; // Mark the popup as open

    const popupContainer = document.createElement("div");
    popupContainer.classList.add("popup-content");
    popupContainer.innerHTML = popupTemplate;
    document.body.appendChild(popupContainer);

    // Prefill fields if editing
    const titleInput = popupContainer.querySelector("#note-title");
    const descriptionInput = popupContainer.querySelector("#note-description");
    const dateInput = popupContainer.querySelector("#note-date");
    const deleteButton = popupContainer.querySelector(".delete-note");
    const saveButton = popupContainer.querySelector(".submit-note");
    const closeButton = popupContainer.querySelector(".close-popup");
    titleInput.value = title;
    descriptionInput.value = description;
    dateInput.value = date;

    // Toggle delete button visibility
    deleteButton.style.display = isEditing ? "block" : "none";

    const closePopup = () => {
      popupContainer.remove();
      isPopupOpen = false; // Reset popup state
      editingNote = null;
    };

    // Close popup on click
    closeButton.addEventListener("click", closePopup);

    // Close popup on Escape key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closePopup();
    });

    // Save button functionality
    const saveNote = () => {
      const newTitle = titleInput.value.trim();
      const newDescription = descriptionInput.value.trim();
      const newDate = dateInput.value;

      if (!newTitle || !newDescription || !newDate) {
        alert("All fields are required!");
        return;
      }

      if (editingNote) {
        editingNote.querySelector(".note-title").textContent = newTitle;
        editingNote.querySelector(".note-description").textContent =
          newDescription;
        editingNote.querySelector(".note-date").textContent = newDate;
      } else {
        const newNote = document.createElement("button");
        newNote.classList.add("page", "show-notes");
        newNote.innerHTML = ` 
          <h2 class="note-title">${newTitle}</h2>
          <p class="note-description">${newDescription}</p>
          <p class="note-date">${newDate}</p>
        `;
        newNote.addEventListener("click", () => {
          showPopup(
            newNote.querySelector(".note-title").textContent,
            newNote.querySelector(".note-description").textContent,
            newNote.querySelector(".note-date").textContent,
            true
          );
          editingNote = newNote;
        });
        notesContainer.appendChild(newNote);
      }
      saveNotesToLocalStorage(); // Save notes to localStorage
      closePopup();
    };

    // Attach save functionality to save button
    saveButton.addEventListener("click", saveNote);

    // Save note and close popup on Enter key
    popupContainer.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        saveNote();
      }
    });

    // Delete button functionality
    deleteButton.addEventListener("click", () => {
      if (editingNote) {
        editingNote.remove();
        saveNotesToLocalStorage(); // Save updated notes to localStorage
      }
      closePopup();
    });
  };

  addNoteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showPopup("", "", "", false);
    });
  });

  // Search Functionality
  searchInput.addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    const notes = notesContainer.querySelectorAll(".show-notes");

    notes.forEach((note) => {
      const title = note.querySelector(".note-title").textContent.toLowerCase();
      const description = note
        .querySelector(".note-description")
        .textContent.toLowerCase();
      const date = note.querySelector(".note-date").textContent.toLowerCase();

      if (
        title.includes(query) ||
        description.includes(query) ||
        date.includes(query)
      ) {
        note.style.display = "";
      } else {
        note.style.display = "none";
      }
    });
  });

  // Sort Notes Alphabetically
  filterByAlphabets.addEventListener("click", () => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    console.log("sorting");
    savedNotes.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      return isAlphaAsc
        ? titleA.localeCompare(titleB)
        : titleB.localeCompare(titleA);
    });
    isAlphaAsc = !isAlphaAsc; // Toggle sort order
    localStorage.setItem("notes", JSON.stringify(savedNotes)); // Save sorted notes
    loadNotes(); // Reload notes after sorting
  });

  // Sort Notes by Date
  filterBydate.addEventListener("click", () => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    savedNotes.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return isDateAsc ? dateA - dateB : dateB - dateA;
    });
    isDateAsc = !isDateAsc; // Toggle sort order
    localStorage.setItem("notes", JSON.stringify(savedNotes)); // Save sorted notes
    console.log("sorting");

    loadNotes(); // Reload notes after sorting
  });

  // Toggle Navigation Sidebar
  const toggleNavAside = () => {
    const isHidden = document.body.classList.toggle("nav-hidden");
    navAside.style.display = isHidden ? "none" : "block";
    header.style.gridColumn = isHidden ? "1 / -1" : "";
    openIcon.style.display = isHidden ? "block" : "none";
    closeIcon.style.display = isHidden ? "none" : "block";
  };

  menuIcon.addEventListener("click", toggleNavAside);

  // Logout functionality
  logOut.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
  });

  loadNotes();
});
