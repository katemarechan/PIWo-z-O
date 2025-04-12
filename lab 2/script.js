"use strict";

let lastDeletedTask = null;
let lastDeletedListId = null;

document.addEventListener("DOMContentLoaded", function() {
    const taskInput = document.getElementById("taskInput");
    const listSelector = document.getElementById("listSelector");
    const addBtn = document.getElementById("addBtn");
    const newListInput = document.getElementById("newListInput");
    const createListBtn = document.getElementById("createListBtn");
    const undoBtn = document.getElementById("undoBtn");
    const deleteModal = document.getElementById("deleteModal");
    const modalText = document.getElementById("modalText");
    const confirmDelete = document.getElementById("confirmDelete");
    const cancelDelete = document.getElementById("cancelDelete");
    const listsContainer = document.getElementById("listsContainer");

    let taskToDelete = null;

    addBtn.addEventListener("click", addTask);
    createListBtn.addEventListener("click", function() {
        createNewList();
    });
    undoBtn.addEventListener("click", undoLastDelete);
    confirmDelete.addEventListener("click", confirmDeleteTask);
    cancelDelete.addEventListener("click", closeModal);

    createNewList("My first list");

    taskInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            addTask();
        }
    });

    newListInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            createNewList();
            newListInput.value = "";
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        const selectedListId = listSelector.value;

        if (taskText === "") {
            alert("Please enter a task!");
            return;
        }

        const taskElement = document.createElement("div");
        taskElement.className = "task-item";

        const taskTextElement = document.createElement("div");
        taskTextElement.className = "task-text";
        taskTextElement.textContent = taskText;

        taskTextElement.addEventListener("click", function() {
            toggleTaskCompletion(taskTextElement);
        });

        const taskDateElement = document.createElement("div");
        taskDateElement.className = "task-date";
        taskDateElement.style.display = "none";

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "X";
        deleteBtn.addEventListener("click", function() {
            showDeleteModal(taskElement, taskText, selectedListId);
        });

        taskElement.appendChild(taskTextElement);
        taskElement.appendChild(taskDateElement);
        taskElement.appendChild(deleteBtn);

        const listElement = document.getElementById(selectedListId + "List");
        listElement.appendChild(taskElement);

        taskInput.value = "";
        taskInput.focus();
    }

    function toggleTaskCompletion(taskTextElement) {
        const taskItem = taskTextElement.parentElement;
        const dateElement = taskItem.querySelector(".task-date");

        if (taskTextElement.classList.contains("completed")) {
            taskTextElement.classList.remove("completed");
            dateElement.style.display = "none";
        } else {
            taskTextElement.classList.add("completed");

            const now = new Date();
            const dateString = now.toLocaleString();
            dateElement.textContent = "Done: " + dateString;
            dateElement.style.display = "inline";
        }
    }

    function createNewList(initialName) {
        const newListName = initialName || newListInput.value.trim();

        if (newListName === "") {
            alert("Please enter a list name!");
            return;
        }

        const listId = newListName.toLowerCase().replace(/\s+/g, "-");

        if (document.getElementById(listId + "List")) {
            if (!initialName) {
                alert("A list with this name already exists!");
            }
            return;
        }

        const option = document.createElement("option");
        option.value = listId;
        option.textContent = newListName;
        listSelector.appendChild(option);

        if (listSelector.options.length === 1) {
            option.selected = true;
        }

        const listWrapper = document.createElement("div");
        listWrapper.className = "list-wrapper";
        listWrapper.dataset.listId = listId;

        const listHeader = document.createElement("div");
        listHeader.className = "list-header";
        listHeader.innerHTML = `<h2>${newListName}</h2>`;
        listHeader.onclick = function() {
            toggleList(listId);
        };

        const taskList = document.createElement("div");
        taskList.className = "task-list";
        taskList.id = listId + "List";

        listWrapper.appendChild(listHeader);
        listWrapper.appendChild(taskList);

        listsContainer.appendChild(listWrapper);

        newListInput.value = "";
    }

    function showDeleteModal(taskElement, taskText, listId) {
        taskToDelete = {
            element: taskElement,
            text: taskText,
            listId: listId
        };

        modalText.textContent = `Are you sure you want to delete task: "${taskText}"?`;

        deleteModal.style.display = "block";
    }

    function confirmDeleteTask() {
        if (taskToDelete) {
            lastDeletedTask = taskToDelete.element.cloneNode(true);
            lastDeletedListId = taskToDelete.listId;

            const textElement = lastDeletedTask.querySelector(".task-text");
            textElement.addEventListener("click", function() {
                toggleTaskCompletion(textElement);
            });

            const deleteBtn = lastDeletedTask.querySelector(".delete-btn");
            deleteBtn.addEventListener("click", function() {
                showDeleteModal(lastDeletedTask, taskToDelete.text, taskToDelete.listId);
            });

            taskToDelete.element.remove();

            undoBtn.disabled = false;

            closeModal();
        }
    }

    function closeModal() {
        deleteModal.style.display = "none";
        taskToDelete = null;
    }

    function undoLastDelete() {
        if (lastDeletedTask) {
            const listElement = document.getElementById(lastDeletedListId + "List");
            listElement.appendChild(lastDeletedTask);

            lastDeletedTask = null;
            undoBtn.disabled = true;
        }
    }
});

function toggleList(listId) {
    const list = document.getElementById(listId + "List");
    if (list.style.display === "none") {
        list.style.display = "block";
    } else {
        list.style.display = "none";
    }
}