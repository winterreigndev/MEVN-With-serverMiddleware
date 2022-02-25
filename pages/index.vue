<template>
  <div>
    <header class="from-top"><span>MEVN</span> To-Do List</header>
    <div class="content">
      <div class="todo-add">
        <div>
          <input
            class="todo-forms"
            v-model="title"
            type="text"
            placeholder="Title"
          />
        </div>
        <div>
          <input
            class="todo-forms"
            v-model="description"
            type="text"
            placeholder="Description"
          />
        </div>
        <div>
          <button v-on:click="addItem" :disabled="!title">Add</button>
        </div>
      </div>
      <div class="todo-items" v-for="(item, i) in items" :key="item._id">
        <div v-if="item.taskstatus == 'true'">
          <div class="todo-container todo-complete">
            <div class="no-display">
              <span class="number">{{ i + 1 }}</span>
            </div>
            <div>
              <input
                class="todo-forms"
                v-if="isSelected(item)"
                v-model="editedTitle"
              />
              <p v-else class="text-p todo-title">
                <s>{{ item.title }}</s>
              </p>
            </div>
            <div>
              <input
                class="todo-forms"
                v-if="isSelected(item)"
                v-model="editedDescription"
              />
              <p v-else class="text-p todo-description">
                <s>{{ item.description }}</s>
              </p>
            </div>

            <div>
              <span
                class="icon has-text-primary"
                v-on:click="isSelected(item) ? unselect() : select(item)"
              >
                <i class="material-icons">{{
                  isSelected(item) ? "close" : "edit"
                }}</i>
              </span>
              <span
                class="icon has-text-info"
                v-on:click="
                  isSelected(item) ? updateItem(item, i) : removeItem(item, i)
                "
              >
                <i class="material-icons">{{
                  isSelected(item) ? "save" : "delete"
                }}</i>
              </span>
              <span class="icon" v-on:click="returnStatus(item, i)">
                <i class="material-icons">undo</i>
              </span>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="todo-container">
            <div class="no-display">
              <span class="number">{{ i + 1 }}</span>
            </div>
            <div>
              <input
                class="todo-forms"
                v-if="isSelected(item)"
                v-model="editedTitle"
              />
              <p v-else class="text-p todo-title">
                {{ item.title }}
              </p>
            </div>
            <div>
              <input
                class="todo-forms"
                v-if="isSelected(item)"
                v-model="editedDescription"
              />
              <p v-else class="text-p todo-description">
                {{ item.description }}
              </p>
            </div>

            <div>
              <span
                class="icon has-text-primary"
                v-on:click="isSelected(item) ? unselect() : select(item)"
              >
                <i class="material-icons">{{
                  isSelected(item) ? "close" : "edit"
                }}</i>
              </span>
              <span
                class="icon has-text-info"
                v-on:click="
                  isSelected(item) ? updateItem(item, i) : removeItem(item, i)
                "
              >
                <i class="material-icons">{{
                  isSelected(item) ? "save" : "delete"
                }}</i>
              </span>
              <span class="icon" v-on:click="changeStatus(item, i)">
                <i class="material-icons">done</i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer>
      Created by <a href="https://winterreign.dev">WinterReign</a>
    </footer>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      items: [],
      title: "",
      editedTitle: "",
      description: "",
      editedDescription: "",
      taskstatus: "",
      editedTaskStatus: "true",
      originalTaskStatus: "false",
      selected: {},
    };
  },
  async mounted() {
    const response = await axios.get("api/");
    this.items = response.data;
  },
  methods: {
    async changeStatus(item, i) {
      const response = await axios.put("api/" + item._id, {
        taskstatus: this.editedTaskStatus,
      });
      this.items[i] = response.data;
      this.unselect();
    },
    async returnStatus(item, i) {
      const response = await axios.put("api/" + item._id, {
        taskstatus: this.originalTaskStatus,
      });
      this.items[i] = response.data;
      this.unselect();
    },
    async addItem() {
      const response = await axios.post("api/", {
        title: this.title,
        description: this.description,
      });
      this.items.push(response.data);
      this.title = "";
      this.description = "";
    },
    async removeItem(item, i) {
      await axios.delete("api/" + item._id);
      this.items.splice(i, 1);
    },
    select(item) {
      this.selected = item;
      this.editedDescription = item.description;
      this.editedTitle = item.title;
    },
    isSelected(item) {
      return item._id === this.selected._id;
    },
    unselect() {
      this.selected = {};
      this.editedDescription = "";
      this.editedTitle = "";
    },
    async updateItem(item, i) {
      const response = await axios.put("api/" + item._id, {
        description: this.editedDescription,
        title: this.editedTitle,
      });
      this.items[i] = response.data;
      this.unselect();
    },
  },
  isComplete() {
    return this.description != "";
  },
};
</script>

<style></style>
