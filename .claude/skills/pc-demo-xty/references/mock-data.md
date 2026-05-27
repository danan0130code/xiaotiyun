# Mock 数据规范

## 设计原则

1. 每个列表页对应一个 mock 数据文件，放在 `src/mock/` 目录下
2. 使用工厂函数生成数据，默认生成 100 条
3. 数据字段贴合校体云业务实际，不使用无意义占位数据
4. ID 使用递增数字或带业务前缀的编号（如 `STU20260001`）
5. 日期使用合理的时间范围
6. 状态字段使用枚举值，配备中文映射

## 数据生成模板

```js
// mock/studentList.js

// 年级枚举
const GRADES = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '初一', '初二', '初三']

// 状态枚举
export const STUDENT_STATUS = {
  ACTIVE: { value: 'active', label: '在读', color: 'success' },
  GRADUATED: { value: 'graduated', label: '已毕业', color: 'default' },
  TRANSFERRED: { value: 'transferred', label: '已转学', color: 'warning' },
}

// 班级映射（年级 → 班级数）
const CLASS_COUNT = { '一年级': 6, '二年级': 6, '三年级': 5, '四年级': 5, '五年级': 4, '六年级': 4, '初一': 8, '初二': 8, '初三': 6 }

const SURNAMES = ['张', '王', '李', '赵', '刘', '陈', '杨', '黄', '周', '吴', '徐', '孙', '马', '朱', '胡', '郭', '林', '何', '高', '罗']
const GIVEN_NAMES_M = ['伟', '强', '杰', '勇', '浩', '磊', '涛', '鑫', '宇', '博']
const GIVEN_NAMES_F = '芳', '娜', '敏', '静', '丽', '婷', '雪', '梅', '燕', '玲']

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)]

// 生成学籍号
const genStudentNo = (index) => {
  return `STU${String(index + 1).padStart(6, '0')}`
}

// 生成姓名
const genName = () => {
  const surname = randomItem(SURNAMES)
  const isMale = Math.random() > 0.5
  const given = isMale ? randomItem(GIVEN_NAMES_M) : randomItem(GIVEN_NAMES_F)
  return surname + given
}

// 生成数据
export const generateStudentList = (count = 100) => {
  return Array.from({ length: count }, (_, i) => {
    const grade = randomItem(GRADES)
    const classIdx = random(1, CLASS_COUNT[grade] || 6)
    const isMale = Math.random() > 0.5
    return {
      id: i + 1,
      studentNo: genStudentNo(i),
      name: genName(),
      gender: isMale ? '男' : '女',
      grade,
      className: `${grade}${classIdx}班`,
      status: randomItem(Object.values(STUDENT_STATUS)).value,
      hasPhoto: Math.random() > 0.15,
      modelingStatus: Math.random() > 0.2 ? '已建模' : '未建模',
    }
  })
}
```

## 分页逻辑

```js
const [currentPage, setCurrentPage] = useState(1)
const [pageSize, setPageSize] = useState(20)
const [allData] = useState(() => generateStudentList(100))

const currentData = useMemo(() => {
  const start = (currentPage - 1) * pageSize
  return allData.slice(start, start + pageSize)
}, [allData, currentPage, pageSize])
```

## 命名约定

| 业务模块 | 文件名 | 导出函数 |
|---------|--------|---------|
| 学生管理 | `studentList.js` | `generateStudentList` |
| 教师管理 | `teacherList.js` | `generateTeacherList` |
| 班级管理 | `classList.js` | `generateClassList` |
| 随堂训练 | `classTraining.js` | `generateClassTrainingList` |
| 体测成绩 | `physicalScore.js` | `generatePhysicalScoreList` |
| 阳光跑任务 | `sunrunTask.js` | `generateSunrunTaskList` |
| 运动记录 | `sportsRecord.js` | `generateSportsRecordList` |
