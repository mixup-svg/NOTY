"use strict";
document.addEventListener("DOMContentLoaded", () => {
  document.body.style.display = "grid";
  const checkUserAuthentication = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    const path = window.location.pathname;
    const isLoginPage = path === "/" || path.includes("main.html");

    console.log("is logged in", isLoggedIn);
    console.log("current path", path);
    if (!isLoggedIn && isLoginPage) {
      console.log("redirecting logged-in user from login page ...");
      window.location.href = "index.html";
    }
  };

  // Run authentication checks
  checkUserAuthentication();
  // Notes Functionality
  const popupTemplate = `
    <div class="main-pop-up">
      <div class="pop-up">
        <span class="close-popup" style="cursor: pointer; font-size: 20px;background-color:red; padding:10px;border-radius:50%;margin-bottom: 10px;font-weight:900;display:inline-flex;justify-content:center; "><ion-icon name="close-outline"></ion-icon></span>
        <form>
          <label for="note-title">Title:</label>
          <input type="text" id="note-title" placeholder="Enter title" />
          <label for="note-description">Description:</label>
          <textarea
            id="note-description"
            placeholder="Description"
          ></textarea>
          <div style="display: flex; justify-content: space-between; gap: 10px;">
            <button type="button" class="submit-note">Save</button>
            <button type="button" class="delete-note" style="cursor:pointer; background-color:red;border-radius: 10px;color:white;padding:10px; display: none;">Delete</button>
          </div>
        </form>
      </div>
    </div>
  `;

  const addNoteButtons = document.querySelectorAll(".add-notes, .main-btn");
  const notesContainer = document.querySelector(".notes-class");
  const noteButtons = document.querySelectorAll(".show-notes");
  const navAside = document.querySelector(".nav-aside");
  const menuIcon = document.querySelector(".menu-icon");
  const openIcon = document.querySelector(".menu-open-icon");
  const closeIcon = document.querySelector(".menu-close-icon");
  const header = document.querySelector(".main-header");
  const logOut = document.querySelector(".logout-btn");
  const searchInput = document.querySelector(".search-text");
  const notes = document.querySelectorAll(".page");
  const body = document.body;
  let editingNote = null;

  // Load notes from localStorage
  const loadNotes = () => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    notesContainer.innerHTML = ""; // Clear current notes
    savedNotes.forEach((note, index) => {
      const newNote = document.createElement("button");
      newNote.classList.add("page", "show-notes");
      newNote.innerHTML = `
        <h2 class="note-title">${note.title}</h2>
        <p class="note--description">${note.description}</p>
      `;
      newNote.addEventListener("click", () => {
        showPopup(note.title, note.description, true); // Edit mode
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
        noteElement.querySelector(".note--description").textContent;
      notes.push({ title, description });
    });
    localStorage.setItem("notes", JSON.stringify(notes));
  };

  // Show Popup for creating/editing notes
  const showPopup = (title = "", description = "", isEditing = false) => {
    const popupContainer = document.createElement("div");
    popupContainer.classList.add("popup-content");
    popupContainer.innerHTML = popupTemplate;
    document.body.appendChild(popupContainer);

    // Prefill fields if editing
    const titleInput = popupContainer.querySelector("#note-title");
    const descriptionInput = popupContainer.querySelector("#note-description");
    const deleteButton = popupContainer.querySelector(".delete-note");
    titleInput.value = title;
    descriptionInput.value = description;

    // Toggle delete button visibility
    deleteButton.style.display = isEditing ? "block" : "none";

    // Add event listeners for popup actions
    const closeButton = popupContainer.querySelector(".close-popup");
    const saveButton = popupContainer.querySelector(".submit-note");
    const closePopup = () => {
      popupContainer.remove();
      editingNote = null;
    };

    // Close popup on click
    closeButton.addEventListener("click", closePopup);

    // Close popup on Escape key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closePopup();
    });

    // Save button functionality
    saveButton.addEventListener("click", () => {
      const newTitle = titleInput.value.trim();
      const newDescription = descriptionInput.value.trim();
      if (!newTitle || !newDescription) {
        alert("Both fields are required!");
        return;
      }

      if (editingNote) {
        // Update existing note
        editingNote.querySelector(".note-title").textContent = newTitle;
        editingNote.querySelector(".note--description").textContent =
          newDescription;
      } else {
        // Create new note
        const newNote = document.createElement("button");
        newNote.classList.add("page", "show-notes");
        newNote.innerHTML = `
          <h2 class="note-title">${newTitle}</h2>
          <p class="note--description">${newDescription}</p>
        `;
        newNote.addEventListener("click", () => {
          showPopup(
            newNote.querySelector(".note-title").textContent,
            newNote.querySelector(".note--description").textContent,
            true
          ); // Editing mode
          editingNote = newNote;
        });
        notesContainer.appendChild(newNote);
      }
      saveNotesToLocalStorage(); // Save notes to localStorage
      closePopup();
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

  // Add event listeners for adding new notes
  addNoteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showPopup("", "", false); // Open popup without delete button
    });
  });

  // Add event listeners for editing existing notes
  noteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showPopup(
        button.querySelector(".note-title").textContent,
        button.querySelector(".note--description").textContent,
        true // Show delete button in editing mode
      );
      editingNote = button;
    });
  });

  // Search Functionality

  searchInput.addEventListener("input", (event) => {
    console.log("search Query", event.target.value);
    const query = event.target.value.toLowerCase();
    const notes = notesContainer.querySelectorAll(".show-notes");

    notes.forEach((note) => {
      const title = note.querySelector(".note-title").textContent.toLowerCase();
      const description = note
        .querySelector(".note--description")
        .textContent.toLowerCase();

      if (title.includes(query) || description.includes(query)) {
        note.style.display = "";
      } else {
        note.style.display = "none";
      }
    });
  });

  // Toggle Navigation Sidebar
  const toggleNavAside = () => {
    const isHidden = body.classList.toggle("nav-hidden");
    if (isHidden) {
      navAside.style.display = "none";
      header.style.gridColumn = "1 / -1"; // Adjust header to take full width
    } else {
      navAside.style.display = "block";
      header.style.gridColumn = ""; // Revert header to original layout
    }
    openIcon.style.display = isHidden ? "block" : "none";
    closeIcon.style.display = isHidden ? "none" : "block";
  };
  menuIcon.addEventListener("click", toggleNavAside);

  // Initialize navaside state
  openIcon.style.display = "none";
  closeIcon.style.display = "block";

  openIcon.style.display = "none";

  // Ensure note layout does not change during editing
  const setFixedNoteWidths = () => {
    const noteElements = notesContainer.querySelectorAll(".page");
    noteElements.forEach((note) => {
      note.style.width = `${note.offsetWidth}px`; // Set fixed width based on current width
    });
  };
  logOut.addEventListener("click", function () {
    console.log("bkucydbaskjdb");
    localStorage.clear();

    window.location.href = "index.html";
  });
  // Load notes from localStorage when the page loads
  loadNotes();
});
