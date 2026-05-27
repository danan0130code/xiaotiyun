import dayjs from 'dayjs'

// K12 年级列表
export const GRADES = [
  '一年级', '二年级', '三年级', '四年级', '五年级', '六年级',
  '初一', '初二', '初三', '高一', '高二', '高三',
]

// 学校列表
export const SCHOOLS = ['萧山六中', '杭州市第一中学', '宁波市实验学校']

// 性别
export const GENDERS = [
  { value: 'male', label: '男生' },
  { value: 'female', label: '女生' },
]

// 学生配速全局默认值
export const DEFAULT_STUDENT_PACE = {
  minPace: 3.5,
  maxPace: 8.0,
  updateTime: '2026-05-10 09:00:00',
}

// 学生配速规则（12年级 × 2性别 = 24行）
// 大部分行继承全局默认，个别行有自定义值
export function generatePaceRules(globalPace = DEFAULT_STUDENT_PACE) {
  const rules = []
  GRADES.forEach((grade, gi) => {
    GENDERS.forEach((gender) => {
      // 高三 和 高一男生 有自定义规则，其余继承全局
      const isCustom = gi >= 9 || (gi === 8 && gender.value === 'male')

      rules.push({
        id: `pace_${gi}_${gender.value}`,
        grade,
        gender: gender.value,
        genderLabel: gender.label,
        minPace: isCustom ? 3.0 : globalPace.minPace,
        maxPace: isCustom ? 6.5 : globalPace.maxPace,
        isCustom,
        updateTime: isCustom
          ? dayjs().subtract(gi, 'day').format('YYYY-MM-DD HH:mm:ss')
          : globalPace.updateTime,
      })
    })
  })
  return rules
}

// 老师配速默认值
export const DEFAULT_TEACHER_PACE = {
  minPace: 4.0,
  maxPace: 7.0,
  updateTime: '2026-05-10 09:00:00',
}

// 格式化配速
export function formatPace(min, max) {
  if (!min && !max) return '未限制'
  const minStr = min !== undefined && min !== null ? `${min}'00"` : '不限'
  const maxStr = max !== undefined && max !== null ? `${max}'00"` : '不限'
  return `${minStr} - ${maxStr}`
}
