<template>
  <div id="app">

    <!-- 固定在顶部 -->
    <div class="fixed-top">
      <div class="container">
        <!-- 添加待办事项 -->
        <form class="input-form" @submit.prevent="addTask">
          <label class="form-label" for="content">Todo</label>
          <input type="text" ref="content">
          <button type="submit" class="btn-regular">Add</button>
        </form>
        <!-- 筛选项 -->
        <div class="status-boxes">
          <label v-for="item in options" :key="item.value">
            <input type="checkbox" :value="item.value" v-model="filterOption">
            <span class="status-name">{{item.name}}</span>
            <span :class="['badge', 'badge-'+item.color]">{{todoCounts(item.value)}}</span>
          </label>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- 列表 -->
      <div class="main-content">
        <div class="list-group">
          <!-- handle是拖拽时的作用对象，end是拖拽后触发的函数 -->
          <draggable handle=".todo-move" @end="onDragEnd">
            <todo-item v-for="item in filteredTodos"
              :key="item.id" :todo="item"
              @edit="editTask(item.id)"></todo-item>
          </draggable>
        </div>
      </div>

      <!-- 编辑的弹框 -->
      <modal-dialog v-if="isEditing" :todo="editingItem" @close="closeModal"/>
    </div>
  </div>
</template>

<script>
import TodoItem from './components/TodoItem'
import ModalDialog from './components/ModalDialog'
import { TaskState } from './assets/Todo.js'
import draggable from 'vuedraggable'

export default {
  name: 'App',
  components: {
    TodoItem,
    ModalDialog,
    draggable
  },
  data() {
    return {
      isEditing: false,
      //任务状态数据
      options: TaskState,
      // 默认选中Todo和InProgress
      filterOption: [TaskState[0].value, TaskState[1].value],
      editingItem: null,
    }
  },
  computed: {
    filteredTodos() {
      return this.$store.getters.getFilteredTodos(this.filterOption)
    }
  },
  methods: {
    onDragEnd(e) {
      // 拖拽之前和之后的index没变，就直接return
      if (e.newIndex == e.oldIndex) {
        return
      }
      let params = {
        oldIndex: e.oldIndex,
        newIndex: e.newIndex,
        option: this.filterOption
      }
      //提交到store中
      this.$store.commit('changeOrder', params)
    },
    // 关闭编辑弹框
    closeModal() {
      this.isEditing = false;
    },
    // 点击编辑图标，让其编辑弹框弹出
    editTask(id) {
      this.isEditing = true
      // 根据ID获取其任务项
      this.editingItem = this.$store.getters.getTodoById(id)
    },
    // 添加待办事项数据
    addTask() {
      let content = this.$refs.content;
      // 值为空字符串
      if (!content.value.trim().length) return;
      // 提交mutation
      this.$store.commit('addTask', content.value);
      // 添加完之后，清空输入框的数据
      content.value = ''
    },
    // 获取各状态的任务数量
    todoCounts(state) {
      return this.$store.getters.getTaskCount(state)
    },
  }
}
</script>


<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #212529;
  margin-top: 80px;
}
*, ::after, ::before {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
.container {
  width: 100%;
  max-width: 720px;
  padding: 0 15px;
  margin: 0 auto;
}
button {
  cursor: pointer;
}
.btn-regular {
  padding: .25rem .5rem;
  color: #fff;
  background-color: #007bff;
  border: 1px solid #007bff;
  border-radius: 0;
  font-size: .875rem;
  line-height: 1.5;
}
.fixed-top {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;

  // 添加待办事项
  .input-form {
    display: flex;
    width: 100%;
    margin-top: 15px;

    .form-label {
      display: flex;
      font-size: 1rem;
      border: 1px solid #979797;
      border-right: none;
      background: #faf9f9;
      line-height: 1.5;
      padding: .25rem .5rem;
    }

    input[type="text"] {
      padding: 2px 4px;
      font-size: 1rem;
      flex-grow: 1;
    }
  }

  // 筛选项
  .status-boxes {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;

    label {
      display: flex;
      align-items: center;
    }

    .status-name {
      margin: 0 5px;
    }

    .badge {
      display: inline-block;
      padding: 2px 5px;
      text-align: center;
      border-radius: .25rem;
      font-size: 75%;
      white-space: nowrap;
      font-weight: bold;
      vertical-align: baseline;

      &-light {
        background-color: #fff;
        border: 1px solid #000;
      }

      &-warning {
        background-color: #ffc107;
        border: 1px solid #ffc107;
      }

      &-success {
        color: #fff;
        background-color: #28a745;
        border: 1px solid #28a745;
      }
    }
  }
}

</style>
