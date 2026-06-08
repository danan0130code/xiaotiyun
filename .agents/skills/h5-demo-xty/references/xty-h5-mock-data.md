# Mock 数据规范

## 通用原则

- 使用工厂函数生成模拟数据
- 列表数据默认生成合理数量即可（无需 100 条）
- 字段命名贴合业务场景
- 使用枚举值表示状态

## K12学生H5 Mock 示例

```js
// src/mock/sportsRecords.js
import dayjs from 'dayjs'

const sportTypes = ['跳绳', '仰卧起坐', '50米跑', '坐位体前屈', '肺活量']
const grades = ['优秀', '良好', '及格']

function generateSportRecord(id) {
  return {
    id,
    date: dayjs().subtract(id, 'day').format('YYYY-MM-DD'),
    type: sportTypes[id % sportTypes.length],
    duration: Math.floor(Math.random() * 30 + 10), // 分钟
    calories: Math.floor(Math.random() * 200 + 50),
    score: Math.floor(Math.random() * 40 + 60),
    grade: grades[Math.floor(Math.random() * grades.length)],
  }
}

export function generateSportList(count = 50) {
  return Array.from({ length: count }, (_, i) => generateSportRecord(i + 1))
}

export const sportList = generateSportList()
```

## K12教师端 Mock 示例

```js
// src/mock/studentList.js
const classes = ['三年级1班', '三年级2班', '四年级1班', '四年级2班']

function generateStudent(id) {
  return {
    id,
    name: ['张三', '李四', '王五', '赵六', '钱七'][id % 5],
    class: classes[id % classes.length],
    totalScore: Math.floor(Math.random() * 40 + 60),
    grade: ['优秀', '良好', '及格'][Math.floor(Math.random() * 3)],
  }
}

export const studentList = Array.from({ length: 30 }, (_, i) => generateStudent(i + 1))
```

## 高校H5 Mock 示例

```js
// src/mock/runRecords.js
import dayjs from 'dayjs'

const statuses = ['正常', '异常', '申诉中', '已通过']

function generateRunRecord(id) {
  return {
    id,
    date: dayjs().subtract(id, 'day').format('YYYY-MM-DD'),
    distance: (Math.random() * 3 + 1).toFixed(2),
    duration: Math.floor(Math.random() * 1200 + 600),
    pace: (Math.random() * 3 + 4).toFixed(2),
    calories: Math.floor(Math.random() * 400 + 100),
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }
}

export function generateRunList(count = 50) {
  return Array.from({ length: count }, (_, i) => generateRunRecord(i + 1))
}

export const runList = generateRunList()
```

## 分页处理

在 Vue 组件中使用 computed 切片：

```vue
<script setup>
import { ref, computed } from 'vue'

const page = ref(1)
const pageSize = 20

const currentData = computed(() =>
  sportList.slice((page.value - 1) * pageSize, page.value * pageSize)
)

const onLoad = () => {
  if (page.value * pageSize < sportList.length) {
    page.value++
  }
}
</script>
```
